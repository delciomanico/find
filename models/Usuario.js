const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Usuario = Schema({
    nome: {
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    },
    eAdmin:{
        type: Number,
        default: 0
    },
    email:{
        type: String,
        required: true
    }
})

mongoose.model('usuario',Usuario)