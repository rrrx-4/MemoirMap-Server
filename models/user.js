const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jsw = require('jsonwebtoken')


const UserSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: false
    },
    googleId:{
        type: String,
        require: false
    },
    id: {type: String},
})

UserSchema.pre('save', async function(){
    if(this.password){
    const salt = await bcrypt.genSalt(10)
     this.password = await bcrypt.hash(this.password, salt)}
})

UserSchema.methods.createJWT = function(){
    return jsw.sign({id:this._id}, process.env.JWT_SECRET, {expiresIn:"30d"})
}


UserSchema.methods.comparePassword = async function (userPassword){
    const isMatch = await bcrypt.compare(userPassword, this.password)

    return isMatch
}


module.exports = mongoose.model("User", UserSchema);