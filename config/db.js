if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI : "mongodb+srv://delciomanico2003:<db_password>@blogapp.rzo0p.mongodb.net/?retryWrites=true&w=majority&appName=blogapp"}
}else{
    module.exports = {mongoURI : "mongodb://localhost/agtfixed"}
}
