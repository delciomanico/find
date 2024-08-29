const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Categoria = Schema({
    nome: {
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    empresa:{
        type: Schema.Types.ObjectId,
        ref: "empresa",
        required: true
    },
    data:{
        type: Date,
        default: Date.now
    }
})

mongoose.model('categoria',Categoria)