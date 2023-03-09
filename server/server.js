require('dotenv').config()
const User = require('./models/User');
const Contact = require('./models/Contact');
const express = require('express')
const cors = require('cors')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

const app = express()

connectDB();

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json({ limit: '50mb' }))


app.post('/login', async (req,res) =>{

    //nalezení uživatele podle loginu
    const user = await User.findOne({ login: req.body.login }).exec()

    //validace hesla
    if(!user || !await bcrypt.compare(req.body.password, user.password)){
        res.send("invalid user")
        return
    }

    res.json({accessToken: jwt.sign(req.body.login, process.env.ACCESS_TOKEN_SECRET)});
})

app.post('/register', async (req,res) => {

    //najít zda existuje daný uživatel
    if (await User.findOne({login: req.body.login}).exec()){
        res.send()
        return
    }

    //hash hesla
    const hashPass = await bcrypt.hash(req.body.password, 10)

    //vytvoření uživatele v databázi
    const result = await User.create({
        login: req.body.login,
        password: hashPass,
        email: req.body.email
    });

    //odeslání tokenu v případě úspěšného vytvoření účtu
    if(result){
        res.json({accessToken: jwt.sign(req.body.login, process.env.ACCESS_TOKEN_SECRET)});
        return
    }
    res.send()
})

app.get('/contact', authenticateToken,async (req,res) =>{
    //najít podle id
    const contact = await Contact.findOne({ _id: req.query.id }).exec();

    //odpověď podle výsledku hledání
    if(contact){
        res.json(contact)
        return
    }
    res.send('')
})

app.get('/contacts', authenticateToken, async (req,res) =>{

    //najít podle loginu
    const contacts = await Contact.find({ owner: req.query.login}).exec();

    //odpověď podle výsledku hledání
    if(contacts){
        res.json(contacts)
        return
    }
    res.send('')
})

app.post('/createContact', authenticateToken, async (req,res) =>{

    //vytvořit podle input
    const result = await Contact.create({
        firstname: req.body.input.firstName,
        lastname: req.body.input.lastName,
        phone: req.body.input.phone,
        comment: req.body.input.comment,
        group: req.body.input.group,
        work: req.body.input.work,
        email: req.body.input.email,
        owner: req.body.login
    });

    //odpověď podle vytvoření kontaktu
    if(result){
        res.sendStatus(200)
        return
    }
    res.send('')
})

app.put('/updateContact', authenticateToken, async(req,res) =>{

    //najít podle id
    const contact = await Contact.findOne({ _id: req.body.id }).exec();
    contact.firstname = req.body.input.firstName
    contact.lastname = req.body.input.lastName
    contact.phone = req.body.input.phone
    contact.comment = req.body.input.comment
    contact.group = req.body.input.group
    contact.work = req.body.input.work
    contact.email = req.body.input.email

    //odpověď podle změny kontaktu
    if(await contact.save()){
        res.sendStatus(200)
        return
    }
    res.send('')
})

app.delete('/deleteContact', authenticateToken, async(req,res) =>{
    console.log(req.query.id)

    //najít podle id
    const contact = await Contact.findOne({ _id: req.query.id }).exec();

    //odpověď podle výsledku smazání
    if(await contact.deleteOne()){
        res.sendStatus(200)
        return
    }
    res.send('')
})



function authenticateToken(req, res, next) {
    let token = req.query.token
    if(token == null)
        token = req.body.token
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, login) => {
        if (err) return res.sendStatus(403)
        let reqLogin = req.query.login
        if(reqLogin == null)
            reqLogin = req.body.login
        if(reqLogin !== login) return res.sendStatus(403)
        req.login = login
        next()
    })
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (error) {
        console.error(error);
    }
}

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`App is running on port ${ PORT }`);
    });
});



