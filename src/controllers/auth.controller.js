
 const userModel = require("../models/user.model")
 const bcrypt = require("bcryptjs");
 const jwt = require("jsonwebtoken");

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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            email,
            username,
            password:hashedPassword,
            profile:{displayName}
        });
        await newUser.save();
        const token = jwt.sign({id:newUser._id} , process.env.JWT_SECRET,{expiresIn:'12h'})
        const cookieOptions = {
            httpOnly: true, // Blocks frontend JavaScript from reading the cookie (Stops XSS)
            secure: process.env.NODE_ENV === "production", // Ensures cookie is only sent over HTTPS in production
            sameSite: "strict", // Prevents Cross-Site Request Forgery (CSRF) attacks
            maxAge: 12 * 60 * 60 * 1000 // Cookie lifespan in milliseconds (matches your 12h JWT)
        };

        res.cookie("token",token,cookieOptions);
        return res.status(201).json(
            {message:"User Account Registered Successfully !!",
                user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profile: newUser.profile
            }
            }
        );
    }catch(error)
    {
        next(error);
    }

}



async function loginController(req,res,next){
    try{

     const { password} = req.body;
     const user = req.user;
     if(!password)
     {
        return res.status(400).json({error:"password is required !!"})
     }
     const checkPassword = await bcrypt.compare(password,user.password);
     if(!checkPassword)
     {
        return res.status(401).json({error:"invalid credentials!!"})
     }
     const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:'12h'});
     const cookieOptions = {
            httpOnly: true, // Blocks frontend JavaScript from reading the cookie (Stops XSS)
            secure: process.env.NODE_ENV === "production", // Ensures cookie is only sent over HTTPS in production
            sameSite: "strict", // Prevents Cross-Site Request Forgery (CSRF) attacks
            maxAge: 12 * 60 * 60 * 1000 // Cookie lifespan in milliseconds (matches your 12h JWT)
        };
     res.cookie("token" ,token , cookieOptions);
     const userData = user.toObject();
        delete userData.password;

     return res.status(200).json({
            message: "Welcome back! Login successful.",
            user:userData
            
        });


    }catch(err)
    {
        next(err)
    }

}




module.exports = {
    registerController,
    loginController
}