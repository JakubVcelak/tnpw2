const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstname: String,
    lastname:String,
    phone: String,
    comment: String,
    group: String,
    work: String,
    email: String,
    owner: String
});

module.exports = mongoose.model('Contact', contactSchema);

