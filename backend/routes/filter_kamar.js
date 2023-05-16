const sequelize = require(`sequelize`);
const operator = sequelize.Op;

const express = require("express")

const app = express()
app.use(express.json())

const models = require("../models/index")
const Kamar = models.kamar
const Tp_kamar = models.tipe_kamar
const detail_pemesanan = models.detail_pemesanan

app.post('/', async (req, res) => {

    let checkInDate = req.body.check_in_date;
    let checkOutDate = req.body.check_out_date;

    let roomData = await Tp_kamar.findAll({
        // attributes: ["id_tipe_kamar", "nama_tipe_kamar"],
        include: [
            {
                model: Kamar,
                as: "kamar",
            },
        ],
    });

    let roomBookedData = await Tp_kamar.findAll({
        attributes: ["id_tipe_kamar", "nama_tipe_kamar"],
        include: [
            {
                model: Kamar,
                as: "kamar",
                include: [
                    {
                        model: detail_pemesanan,
                        as: "detail_pemesanan",
                        attributes: ["tgl_akses"],
                        where: {
                            tgl_akses: {
                                [operator.between]: [checkInDate, checkOutDate],
                            },
                        },
                    },
                ],
            },
        ],
    });
    console.log(roomBookedData)

    let available = [];
    let availableByType = [];

    for (let i = 0; i < roomData.length; i++) {
        roomData[i].kamar.forEach((kamar) => {
            let isBooked = false;
            roomBookedData.forEach((booked) => {
                booked.kamar.forEach((bookedRoom) => {
                    if (kamar.id === bookedRoom.id) {
                        isBooked = true;
                    }
                });
            });
            if (!isBooked) {
                available.push(kamar);
            }
        });
    }

    for (let i = 0; i < roomData.length; i++) {
        let roomType = {};
        roomType.id_tipe_kamar = roomData[i].id;
        roomType.nama_tipe_kamar = roomData[i].nama_tipe_kamar;
        roomType.harga = roomData[i].harga;
        roomType.deskripsi = roomData[i].deskripsi;
        roomType.foto = roomData[i].foto;
        roomType.kamar = [];
        available.forEach((kamar) => {
            roomType.kamar.push(kamar);
            // if (kamar.id_tipe_kamar === roomData[i].id) {
            // }
        });
        availableByType.push(roomType);
        // if (roomType.kamar.length > 0) {
        //     console.log(roomType.tipe_kamar.dataValues)
        // }
    }
    return res.json({  room: availableByType });
})

module.exports = app