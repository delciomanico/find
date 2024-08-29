module.exports = {
    eLog: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 0){
            return next()
        }
        req.flash("error_msg", "Apenas Usuario logados podem aceder a esta pagina")
        res.redirect('/')
    }
}