const mongoose = require("mongoose");

require("dotenv").config();


const DBConnect = () => {

    mongoose.connect(process.env.DB_URL)
    .then( () => {
        console.log("DataBase is Connected Successfully");
    }
    )
    .catch((err) => {
        console.log("DataBase Connection is Failed");
        console.error("error -> ",err.message);
        process.exit(1);
    })
}


module.exports = DBConnect;