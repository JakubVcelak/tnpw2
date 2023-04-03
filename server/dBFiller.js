require('dotenv').config()
const mongoose = require("mongoose");
const Contact = require('./models/Contact');
const User = require('./models/User');


//passwords: novakda: heslo1234    svobofr: 1234heslo
const users = [
    {login: "novakda", password: "$2b$10$apEEPTyLKW84Ul7tdj06YuZs2vkUdpmZe7P2V1rmM8qCK0GMO9hDG", email: "david.novak@gmail.com"},
    {login: "svobofr", password: "$2b$10$uGaNk.cjLW2rUsNEwZPTr.KzxYCnwxveaLvK1zGwfywUrMYlRNDl.", email: "fratiska.svobodova@gmail.com"}

]
const contacts =[
    {_id: "6408c50f5bc9b76d6ece0407", firstname: "Pavel", lastname: "Vomáčka", phone: "123456789", comment: "Friend from primary school.", group:"friends", work:"electrician", email: "pavel.vomacka@gmail.com", owner:"novakda"},
    {_id: "6408c50f5bc9b76d6ece5402", firstname: "Jan", lastname: "Hrdý", phone: "987654321", comment: "Head of the recruitment department.", group:"colleagues", work:"musician",email: "jan.hrdy@gmail.com",owner:"novakda"},
    {_id: "6408c50f5bc9b79d6ece0403", firstname: "Jana", lastname: "Lišková", phone: "654789123", comment: "Aunt from mother side.", group:"family", work:"teacher",email: "jana.liskova@gmail.com",owner:"novakda"},
    {_id: "6408c50f5bc9b76d6ece0404", firstname: "Filip", lastname: "Lesák", phone: "684269753", comment: "Friend from sport team.", group:"friends", work:"policeman",email: "filip.lesak@gmail.com",owner:"novakda"},
    {_id: "6408c50f55c9b76d6ece0408", firstname: "Dan", lastname: "Morávek", phone: "369852741", comment: "", group:"colleagues", work:"bartender",email: "dan.moravek@gmail.com",owner:"novakda"},
    {_id: "6408c50f5bc9b76d6ece0409", firstname: "Alžběta", lastname: "Vašatová", phone: "856749123", comment: "Head of the complaints department.", group:"colleagues", work:"cashier",email: "alzbeta.vasatova@gmail.com",owner:"svobofr"},
    {_id: "6408450f5bc9b76d6ece0411", firstname: "František", lastname: "Zajíc", phone: "147852369", comment: "Friend from primary school.", group:"friends", work:"judge",email: "frantisek.zajic@gmail.com",owner:"svobofr"},
    {_id: "6408c50f5bc9b76d6ece0412", firstname: "Jiří", lastname: "Milý", phone: "957846213", comment: "Grandfather from mother.", group:"family", work:"soldier",email: "jiri.mily@gmail.com",owner:"svobofr"},
    {_id: "6408c50f5bc6b76d6ece0400", firstname: "Pavla", lastname: "Veselá", phone: "951236847", comment: "", group:"colleagues", work:"journalist ",email: "pavla.vesela@gmail.com",owner:"svobofr"},
    {_id: "6408c50f5bc9b76d6ece0433", firstname: "Monika", lastname: "Procházková", phone: "246951387", comment: "Friend from sport team.", group:"friends", work:"dentist",email: "monika.prochazkova@gmail.com",owner:"svobofr"}
]

//connect DB
async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/contactApp');
    } catch (error) {
        console.error(error);
    }
}

//add user
async function addUser(u) {
    if (await User.findOne({login: u.login}).exec()){
        console.log("USER: "+u.login+" already exist")
        return
    }
    await User.create({
        login: u.login,
        password: u.password,
        email: u.email
    })
    console.log("USER: "+u.login+" added")
}

//add contact
async function addContact(c) {
    if (await Contact.findOne({_id: c._id}).exec()){
        console.log("CONTACT: "+c._id+" already exist")
        return
    }
    await Contact.create({
        _id: c._id,
        firstname: c.firstname,
        lastname: c.lastname,
        phone: c.phone,
        comment: c.comment,
        group: c.group,
        work: c.work,
        email: c.email,
        owner: c.owner
    })
    console.log("CONTACT: "+c._id+" added")
}

//fillDB
function fillDB() {
    connectDB()
    users.forEach(u=>addUser(u))
    contacts.forEach(c=>addContact(c))
}

fillDB()

