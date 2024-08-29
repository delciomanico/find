const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Empresa = Schema({
    nome: {
        type: String,
        required: true
    },
    nif:{
        type: String,
        required: true
    },
    gestor:{
        type: Schema.Types.ObjectId,
        ref: "usuario",
        required: true
    },
    data:{
        type: Date,
        default: Date.now
    }
})

mongoose.model('empresa',Empresa)