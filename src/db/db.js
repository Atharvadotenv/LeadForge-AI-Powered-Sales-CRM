const mongoose  = require("mongoose");

function connectDB()
{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("Mongo DB conected successfully");
        
    });
}

module.exports = connectDB;