const mongoose = require('mongoose');
require("dotenv").config();

const dbConnect = () => {
  mongoose.connect(process.env.DATABSE_URL, {
    
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log(`Db connected Succesfully on port ${process.env.PORT}`);
    })
    .catch((err) => {
      console.log("yahan gltii aa rhi");
      console.log(err);
      process.exit(1);
    });
};

module.exports = dbConnect;
