const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstname: {type: String, require:true},
    lastname:{type: String, require:true},
    phone: {type: String, require:true},
    comment: String,
    group: String,
    work: String,
    email: String,
    owner: {type: String, require:true}
});

module.exports = mongoose.model('Contact', contactSchema);

