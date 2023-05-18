//import library
const express = require('express');
const bodyParser = require('body-parser');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const model = require('../models/index');
const pemesanan = model.pemesanan
const user = model.user
const kamar = model.kamar
const tipe_kamar = model.tipe_kamar
const detail_pemesanan = model.detail_pemesanan
const customer = model.customer

//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "TryMe"

const sequelize = require(`sequelize`);
const operator = sequelize.Op;

//get data
app.get("/", auth, (req,res) => {
    pemesanan.findAll({
        include: [
            {
                model: user, as:'user'
            },
            {
                model: tipe_kamar, as:'tipe_kamar'
            },
            {
                model: customer, as:'customer'
            }
        ]
    })
        .then(result => {
            res.json({
                pemesanan : result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.get("/findById/:id", auth, (req,res) => {
    pemesanan.findAll({ where: {id_customer: req.params.id},
        include: [
            {
                model: user, as:'user'
            },
            {
                model: tipe_kamar, as:'tipe_kamar'
            },
            {
                model: customer, as:'customer'
            }
        ]
    })
        .then(result => {
            res.json({
                pemesanan : result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})


//get data by id
app.get("/:id", (req, res) =>{
    pemesanan.findOne({ where: {id_pemesanan: req.params.id}, 
        include: [
            {
                model: user, as:'user'
            },
            {
                model: tipe_kamar, as:'tipe_kamar'
            },
            {
                model: customer, as:'customer'
            }
        ]
    })
    .then(result => {
        res.json({
            pemesanan: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//get order detail by order
app.get("/idOrder/:id_pemesanan", async (req,res) => {
    let sql = `select * from pemesanan inner join detail_pemesanan on pemesanan.id_pemesanan = detail_pemesanan.id_pemesanan WHERE pemesanan.id_pemesanan  = ${req.params.id_pemesanan}` ;

    
    try {
        const data = await pemesanan.sequelize.query(sql, {
            model: pemesanan,
            mapToModel: true
        })
        res.status(200).json(data)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.post('/', async (req, res) => {
    let tw = Date.now()

    let numberRandom = Math.floor(Math.random() * (10000000 - 99999999) + 99999999);

    let requestData = {
        nomor_pemesanan: numberRandom,
        id_customer: req.body.id_customer,
        tgl_pemesanan: tw,
        tgl_check_in: req.body.tgl_check_in,
        tgl_check_out: req.body.tgl_check_out,
        nama_tamu: req.body.nama_tamu,
        jumlah_kamar: req.body.jumlah_kamar,
        id_tipe_kamar: req.body.id_tipe_kamar,
        status_pemesanan: req.body.status_pemesanan,
        id_user: req.body.id_user

    };

    // rooms data
    let dataKamar = await kamar.findAll({
        where: {
            id_tipe_kamar: requestData.id_tipe_kamar,
        },
    });

    // room type data
    let dataTipeKamar = await tipe_kamar.findOne({
        where: { id_tipe_kamar: requestData.id_tipe_kamar },
    });

    //  booking data
    let dataPemesanan = await tipe_kamar.findAll({
        attributes: ["id_tipe_kamar", "nama_tipe_kamar"],
        where: { id_tipe_kamar: requestData.id_tipe_kamar },
        include: [
            {
                model: kamar,
                as: "kamar",
                attributes: ["id_kamar", "id_tipe_kamar"],
                include: [
                    {
                        model: detail_pemesanan,
                        as: "detail_pemesanan",
                        attributes: ["tgl_akses"],
                        where: {
                            tgl_akses: {
                                [operator.between]: [
                                    requestData.tgl_check_in,
                                    requestData.tgl_check_out,
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    });

    // get available rooms
    let bookedRoomIds = dataPemesanan[0].kamar.map((room) => room.id);
    let availableRooms = dataKamar.filter((room) => !bookedRoomIds.includes(room.id));


    // process add data room where status is available to one list
    let roomsDataSelected = availableRooms.slice(0, requestData.jumlah_kamar);

    //count day
    let checkInDate = new Date(requestData.tgl_check_in);
    let checkOutDate = new Date(requestData.tgl_check_out);
    const dayTotal = Math.round(
        (checkOutDate - checkInDate) / (1000 * 3600 * 24)
    );

    // process add detail
    if (
        dataKamar == null ||
        availableRooms.length < requestData.jumlah_kamar ||
        dayTotal == 0 ||
        roomsDataSelected == null
    ) {
        return res.json({
            message: "Room not available!",
        });
    } else {
        await pemesanan
            .create(requestData)
            .then(async (result) => {
                // process to add booking detail
                for (let i = 0; i < dayTotal; i++) {
                    for (let j = 0; j < roomsDataSelected.length; j++) {
                        let tgl_akses = new Date(checkInDate);
                        tgl_akses.setDate(tgl_akses.getDate() + i);
                        let requestDataDetail = {
                            id_pemesanan: result.id_pemesanan,
                            id_kamar: roomsDataSelected[j].id_kamar,
                            tgl_akses: tgl_akses,
                            harga: dataTipeKamar.harga,
                        };
                        await detail_pemesanan.create(requestDataDetail);
                    }
                }
                return res.json({
                    data: result,
                    statusCode: res.statusCode,
                    message: "New user has been created",
                });
            })
            .catch((error) => {
                return res.json({
                    message: error.message,
                });
            });
    }
})

//edit data by id
app.put("/:id", auth, (req,res) => {
    let param = {
        id_pemesanan : req.params.id
    }
    let data = {
        nomor_pemesanan : req.body.nomor_pemesanan,
        nama_pemesanan : req.body.nama_pemesanan,
        email_pemesanan : req.body.email_pemesanan,
        tgl_pemesanan : req.body.tgl_pemesanan,
        tgl_check_in : req.body.tgl_check_in,
        tgl_check_out : req.body.tgl_check_out,
        nama_tamu : req.body.nama_tamu,
        jumlah_kamar : req.body.jumlah_kamar,
        id_tipe_kamar : req.body.id_tipe_kamar,
        status_pemesanan : req.body.status_pemesanan,
        id_user : req.body.id_user
    }
    pemesanan.update(data, {where: param})
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//delete data by id
app.delete("/:id", auth, (req,res) => {
    let param = {
        id_pemesanan : req.params.id
    }
    pemesanan.destroy({where: param})
        .then(result => {
            res.json({
                message: "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

module.exports = app