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


//handle login
app.post('/login', async (req,res) =>{
    const user = await User.findOne({ login: req.body.login }).exec()

    if(!user || !await bcrypt.compare(req.body.password, user.password)){
        res.send("invalid user")
        return
    }

    res.json({accessToken: jwt.sign(req.body.login, process.env.ACCESS_TOKEN_SECRET)});
})

//handle registration
app.post('/register', async (req,res) => {
    if (await User.findOne({login: req.body.login}).exec()){
        res.send()
        return
    }

    const hashPass = await bcrypt.hash(req.body.password, 10)

    const result = await User.create({
        login: req.body.login,
        password: hashPass,
        email: req.body.email
    });

    if(result){
        res.json({accessToken: jwt.sign(req.body.login, process.env.ACCESS_TOKEN_SECRET)});
        return
    }
    res.send()
})

//get contact
app.get('/contact', authenticateToken,async (req,res) =>{
    const contact = await Contact.findOne({ _id: req.query.id }).exec();

    if(contact){
        res.json(contact)
        return
    }
    res.send('')
})

//get all users contacts
app.get('/contacts', authenticateToken, async (req,res) =>{
    const contacts = await Contact.find({ owner: req.query.login}).exec();

    if(contacts){
        res.json(contacts)
        return
    }
    res.send('')
})

//create contact
app.post('/createContact', authenticateToken, async (req,res) =>{
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

    if(result){
        res.sendStatus(200)
        return
    }
    res.send('')
})

//update contact
app.put('/updateContact', authenticateToken, async(req,res) =>{
    const contact = await Contact.findOne({ _id: req.body.id }).exec();
    contact.firstname = req.body.input.firstName
    contact.lastname = req.body.input.lastName
    contact.phone = req.body.input.phone
    contact.comment = req.body.input.comment
    contact.group = req.body.input.group
    contact.work = req.body.input.work
    contact.email = req.body.input.email

    if(await contact.save()){
        res.sendStatus(200)
        return
    }
    res.send('')
})

//delete contact
app.delete('/deleteContact', authenticateToken, async(req,res) =>{
    const contact = await Contact.findOne({ _id: req.query.id }).exec();

    if(await contact.deleteOne()){
        res.sendStatus(200)
        return
    }
    res.send('')
})

//authentication
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

//connection to database
async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/contactApp');
    } catch (error) {
        console.error(error);
    }
}

//start server
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`App is running on port ${ PORT }`);
    });
});



