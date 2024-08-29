const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Documento = Schema({
    nome: {
        type: String,
        required: true
    },
    newnome:{
        type: String,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: "categoria",
        required: true
    },
    empresa:{
        type: Schema.Types.ObjectId,
        ref: "empresa",
        required: true
    },
    
    path:{
        type: String,
        required: true
    },
    data:{
        type: Date,
        default: Date.now
    }
})

mongoose.model('documento',Documento)

