//import express
const express = require("express")
const app = express()
app.use(express.json())

// import md5
const md5 = require("md5")

//import multer
const multer = require("multer")
const path = require("path")
const fs = require("fs")

//import model
const models = require("../models/index")
const user = models.user

//config storage image
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"../backend/image/user")
    },
    filename: (req,file,cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({storage: storage})

//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "TryMe"

//login
app.post("/auth", async (req,res) => {
    let data= {
        email: req.body.email,
        password: md5(req.body.password)
    }

    let result = await user.findOne({where: data})
    if(result){
        let payload = JSON.stringify(result)
        // generate token
        let token = jwt.sign(payload, SECRET_KEY)
        res.json({
            logged: true,
            data: result,
            token: token
        })
    }else{
        res.json({
            logged: false,
            message: "Invalid username or password"
        })
    }
})


//get data
app.get("/", auth, (req,res) => {
    user.findAll()
        .then(result => {
            res.json({
                user : result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//get data by id
app.get("/:id", auth, (req, res) =>{
    user.findOne({ where: {id_user: req.params.id}})
    .then(result => {
        res.json({
            user: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//post data
app.post("/", upload.single("foto"), auth, (req, res) =>{
    if (!req.file) {
        res.json({
            message: "No uploaded file"
        })
    } else {
        let data = {
            nama_user : req.body.nama_user,
            foto : req.file.filename,
            email : req.body.email,
            password : md5(req.body.password),
            role : req.body.role
        }
        user.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    }
})


//edit data by id
app.put("/:id", upload.single("foto"), auth, (req, res) =>{
    let param = { id_user: req.params.id}
    let data = {
        nama_user : req.body.nama_user,
        email : req.body.email,
        role : req.body.role
    }
    if (req.file) {
        // get data by id
        const row = user.findOne({where: param})
        .then(result => {
            let oldFileName = result.image
           
            // delete old file
            let dir = path.join(__dirname,"../backend/image/user",oldFileName)
            fs.unlink(dir, err => console.log(err))
        })
        .catch(error => {
            console.log(error.message);
        })

        // set new filename
        data.foto = req.file.filename
    }

    if(req.body.password){
        data.password = md5(req.body.password)
    }

    user.update(data, {where: param})
        .then(result => {
            res.json({
                message: "data has been updated",
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
        id_user : req.params.id
    }
    user.destroy({where: param})
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