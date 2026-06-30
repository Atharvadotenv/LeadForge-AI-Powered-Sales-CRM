const userModel = require("../models/user.model")

async function checkUser(req,res,next){
    try{

        const{email,username} = req.body;

        if(!email && !username)
        {
            return res.status(400).json({error:"please provide email or username"})
        }
        const query = email ? {email}:{username};

        const user  = await userModel.findOne(query).select("+password")

        if(!user)
        {
            return res.status(401).json({error:"Invalid Credentials"});

        }
        req.user = user;
        next();

    }catch(err)
    {
        next(error);
    }
}

module.exports = {checkUser}