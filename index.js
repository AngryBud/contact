require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const morgan = require("morgan");
const cors = require("cors");
const mg= require('mailgun-js');
const app = express();
app.use(express());
app.use(formidableMiddleware());
app.use(morgan("dev"));
app.use(cors())

const mailgun = () =>
    mg({
        apiKey: process.env.MAILGUN_KEY,
        domain: process.env.MAILGUN_DOMAIN
});



app.post('/api/email', (req,res) =>{

    const {email, subject, message} = req.fields;
    mailgun().messages().send({
        from:`${email}`,
        to:`<clem.notin@gmail.com>`,
        subject:`${subject}`,
        html: `<p>${message}</p>`
    }, (error, fields) =>{
        if (error){
            console.log(error);
            res.status(500).send({message : "Erreur d'envoi"});
        }
        else{
            console.log(fields);
            res.status(200).send({message : "Message envoyé"});
        }
    });
})

app.get("/", (req,res) => {res.status(200).json("Bienvenue sur l'api email");});

app.all("*", (req,res) => {res.status(404).json("Page not found");});

app.listen(process.env.PORT, () => {console.log("Server started");});