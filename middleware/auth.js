const jwt = require('jsonwebtoken') 
const User = require('../models/user')
const auth = async (req, res, next)=>{
    // console.log('hhh');
    try {
        const token = req.headers.authorization.split(" ")[1]
        const isCustomAuth = token.length < 500
        let decodedData

        if(token && isCustomAuth){

            decodedData = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedData?.id;
        }else{
            decodedData = jwt.decode(token)
            const googleId = decodedData?.sub.toString();
            const client = await User.findOne({googleId})
            req.userId = client?._id
        }
        next()
    } catch (error) {
        console.log(error);
    }
}

module.exports = auth;