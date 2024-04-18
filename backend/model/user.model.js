const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true }
},{
    versionKey:false
});

const UserModel =mongoose.model('user',userSchema)


module.exports ={
    UserModel
}