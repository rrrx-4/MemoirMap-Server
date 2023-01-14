
const User = require('../models/user')


const signin =  async (req, res)=>{

    const {email, password} = req.body;

    try {
        
        const oldUser = await User.findOne({email})
        
        if(!oldUser){
            return res.status(400).json({message:"User doesn't exist"})
        }

        const isMatch = await oldUser.comparePassword(password)

        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const token = oldUser.createJWT()

        res.status(201).json({ result: oldUser, token})


    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
        console.log(error);
    }

}




const signup = async (req, res)=>{

    const { firstName, lastName, email, password } = req.body;

    try {
        
        const oldUser = await User.findOne({email})

        if(oldUser){
            return res.status(400).json({message:'User already exist'})
        }

      const result = await User.create({
            email,
            name: `${firstName} ${lastName}`,
            password
        })

        const token = result.createJWT()

        res.status(201).json({result, token})

    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
        console.log(error);
    }


}


const googleSignIn = async  (req, res)=>{
    const { email, name, token, googleId } = req.body

    

    try {
        const oldUser = await User.findOne({email})

        if(oldUser){
            const result = {_id:oldUser._id.toString(), email, name}
            return res.status(200).json({result, token})
        }
          
        const result = await User.create({email, name, googleId})

        return res.status(200).json({result, token})

    } catch (error) {
        
        res.status(500).json({message: "Something went wrong"})
        console.log(error);
    }
}

module.exports = { signup , signin, googleSignIn}