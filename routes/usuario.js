const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const admin = require('./admin')
const passport = require('passport')
const {eLog} = require('../helper/eLog')
require('../models/Usuario')
require('../models/Empresa')
require('../models/Categoria')

const Usuario = mongoose.model('usuario')
const Empresa = mongoose.model('empresa')
const Categoria = mongoose.model('categoria')



/// ========= rotas da empresa
router.get('/empresa', eLog ,(req,res)=>{
    Empresa.find({gestor: req.user._id}).then((empresa)=>{
        if(empresa){
            res.render('usuario/empresa/index',{empresa: empresa})
        }
    })
})
router.get('/empresa/add',eLog , (req,res)=>{
    res.render('usuario/empresa/addEmpresa')
})
router.post('/empresa/delete', eLog , (req,res)=>{
    Empresa.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg', 'Empresa deletada !')
        res.redirect('/usuario/empresa')
    }).catch((error)=>{
        req.flash('error_msg', 'Erro ao deletar Empresa (', error,')')
        res.redirect('/usuario/empresa')
    })
})

router.get('/empresa/edit/:id', eLog , (req,res)=> {
  
    Empresa.findById(req.params.id).then((empresa)=>{
        res.render('usuario/empresa/editEmpresa',{empresa: empresa})
    }).catch((erro)=>{
        req.flash('error_msg', 'A Empresa selecionada nao existe')
        res.redirect('/usuario/empresa')
    })
})
router.post('/empresa/edit', eLog ,(req,res)=> {
  
    Empresa.findOne({_id: req.body.id}).then((empresa)=>{
        empresa.nome = req.body.nome
        empresa.nif = req.body.nif
        empresa.save().then(()=>{
            req.flash('success_msg', 'Empresa editada com sucesso')
            res.redirect('/usuario/empresa')
        }).catch(()=>{
            req.flash('error_msg', 'erro interno ao salvar ediçao da Empresa')
            res.redirect('/usuario/empresa')
        })
    }).catch((error)=>{

        req.flash('error_msg', 'Falha ao editar Empresa')
        res.redirect('/usuario/empresa')
    })
    
})
router.post('/empresa/nova', eLog ,(req,res)=>{

    erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }
    if(!req.body.nif || typeof req.body.nif == undefined || req.body.nif == null){
        erros.push({texto: "NIF invalido"})
    }
    if(req.body.nome.length < 4){
        erros.push({texto: "Nome da Empresa, muito pequeno"})
    }
    if(erros.length > 0){
        res.render("usuario/addEmpresa", {erros: erros})
    }else{
        
        new Empresa({
            nome: req.body.nome,
            nif: req.body.nif,
            gestor: req.user._id
        }).save().then(()=>{
            req.flash('success_msg', 'Empresa criada com exito')
            console.log("Empresa cadastrada")
            res.redirect('/usuario/empresa')
        }).catch((err)=>{
            req.flash('error_msg', 'erro ao criar, tente novamente')
            console.log("erro no cadastro . ", err)
            res.redirect('/usuario/empresa')
        })
    }

})

// ============== rotas da categoria
router.get('/empresa/categoria', eLog ,(req, res)=>{


    Empresa.find({gestor:req.user._id}).then((empresa)=>{


        var listEmpresa = []
        empresa.forEach((value)=>{
            listEmpresa.push({_id: value._id})
        })

        Categoria.find({empresa: {$in: listEmpresa}}).populate('empresa').then((categoria)=>{
            res.render('usuario/empresa/categoria/index',{categoria: categoria})
        })
    })

   
})
router.get('/empresa/categoria/add', eLog ,(req, res)=>{
    Empresa.find({gestor: req.user._id}).then((empresa)=>{
            
            if(empresa.length == 0){
                req.flash('error_msg', 'nenhuma empresa registrada ')
                res.redirect('/usuario/empresa/categoria')
            }
            res.render('usuario/empresa/categoria/addCategoria',{empresa: empresa})
        
    }).catch((error)=>{
        req.flash('error_msg', 'erro interno (',error)
        res.redirect('/usuario/empresa/categoria')
    })
})

router.post('/empresa/categoria/nova', eLog ,(req,res)=>{

    erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug invalido"})
    }
    if(req.body.nome.length < 4){
        erros.push({texto: "Nome da Categoria, muito pequeno"})
    }
    if(erros.length > 0){
        res.render("usuario/empresa/addCategoria", {erros: erros})
    }else{
        
        new Categoria({
            nome: req.body.nome,
            slug: req.body.slug,
            empresa: req.body.empresa
        }).save().then(()=>{
            req.flash('success_msg', 'Categoria criada com exito')
            console.log("Categoria cadastrada")
            res.redirect('/usuario/empresa/categoria')
        }).catch((err)=>{
            req.flash('error_msg', 'erro ao criar, tente novamente')
            console.log("erro no cadastro . ", err)
            res.redirect('/usuario/empresa/categoria')
        })
    }

})

router.get('/empresa/categoria/edit/:id', eLog ,(req, res)=>{
    Empresa.find({gestor:req.user._id}).then((empresa)=>{


        var listEmpresa = []
        empresa.forEach((value)=>{
            listEmpresa.push({_id: value._id})
        })

        Categoria.findOne({_id: req.params.id}).populate('empresa').then((categoria)=>{
           
            res.render('usuario/empresa/categoria/editCategoria',{categoria: categoria, empresas: empresa})
        })
    })
})

router.post('/empresa/categoria/edit', eLog , (req,res)=> {
  
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        categoria.empresa = req.body.empresa
        categoria.save().then(()=>{
            req.flash('success_msg', 'Categoria editada com sucesso')
            res.redirect('/usuario/empresa/categoria')
        }).catch(()=>{
            req.flash('error_msg', 'erro interno ao salvar na ediçao da Categoria')
            res.redirect('/usuario/empresa/categoria')
        })
    }).catch((error)=>{

        req.flash('error_msg', 'Falha ao editar Categoria')
        res.redirect('/usuario/empresa')
    })
    
})

router.post('/empresa/categoria/delete', eLog ,(req,res)=>{
    Categoria.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg', 'Categoria deletada !')
        res.redirect('/usuario/empresa/categoria')
    }).catch((error)=>{
        req.flash('error_msg', 'Erro ao deletar Categoria (', error,')')
        res.redirect('/usuario/empresa/categoria')
    })
})

// ============= rotas do documento

router.get('/empresa/documento/:id', eLog ,(req, res)=>{
    res.render('usuario/empresa/documento/index',{empresa:req.params.id})
})
router.get('/empresa/documento/:empresa/add', eLog ,(req, res)=>{
    Categoria.find({empresa:req.params.empresa}).then((categoria)=>{
        
        res.render('usuario/empresa/documento/addDocumento',{categoria: categoria, _idEmp: req.params.empresa})
    })
})

router.post('/empresa/documento/novo', eLog ,(req, res)=>{
    req.flash('success_msg', 'Documento Registrado')
    res.render('usuario/empresa/documento/index')
})

// ============= rotas do gestor


router.get('/registro' ,(req, res) => {
    res.render('usuario/registro')
})

router.post('/registro/add' ,(req, res) => {
    var error = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        error.push({ texto: "Nome invalido !" })
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        error.push({ texto: "Senha invalido !" })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        error.push({ texto: "Email invalido !" })
    }

    if (req.body.senha.length < 4) {
        error.push({ texto: "Senha muito curta" })
    }

    if (req.body.senha != req.body.senha2) {
        error.push({ texto: "Senhas não correspondem" })
    }

    if (error.length > 0) {
        res.render("usuario/registro", { error: error })
    } else {

        Usuario.findOne({ email: req.body.email }).then((usuario) => {

            if (usuario != null ) {
                req.flash('error_msg', "Ja exite um usuario com este email")
                res.redirect('/usuario/registro')
            } else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                })
                
                let senha = novoUsuario.senha
                let salt = bcrypt.genSaltSync(10)
                
                bcrypt.hash(senha,salt, (err, hashed)=>{
                    if(err){
                        console.error(err)
                        return
                    }
                    novoUsuario.senha = hashed
                    novoUsuario.save().then(() => {
                        req.flash('success_msg', "Usuario Cadastrado com Sucesso")
                        res.redirect('/')
                    }).catch((error) => {
                        console.log(error)
                        req.flash('error_msg', "Houve um erro ao criar usuario, tente novamente")
                        res.redirect('/')
                    })
                })
                    


            }

        }).catch((error) => {
            req.flash('error_msg', "Houve um erro interno (", error)
            res.redirect('/')
        })
    }
})




router.get('/login',( req, res)=>{
       res.render('usuario/login')
})
router.post('/login',( req, res, next)=>{

        passport.authenticate('local',{
            successRedirect: "/",
            failureRedirect: "/usuario/login",
            failureFlash: true,
        })(req, res, next)
})

router.get('/logout', eLog ,(req, res)=>{
    req.logout(()=>{

        req.flash('success_msg','Sessão Terminada!')
        res.redirect('/')
    })
})
module.exports = router