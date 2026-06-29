
 const userModel = require("../models/user.model")

async function registerController(req,res ,next){
  
    try{
        const{email  , password ,username, displayName } = req.body;
        const emailExists = await userModel.exists({email});
        if(emailExists)
        {
            return res.status(400).json({error:"This Email is already registered please try logging in"})
        }
       
        const userNameExists = await userModel.exists({username});
        if(userNameExists)
        {
            return res.status(400).json({error:"This Username is already taken please try something else"})
        }

        const newUser = new userModel({
            email,
            username,
            password,
            profile:{displayName}
        });
        await newUser.save();
        return res.status(201).json({message:"User Account Registered Successfully !!"});
    }catch(error)
    {
        next(error);
    }

}



async function loginController(req,res){
    const {email , username , password} = req.body; 
}




module.exports = {
    registerController,
    loginController
}