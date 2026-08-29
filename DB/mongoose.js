const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB Connected Successfully');
    })
    .catch((error) => {
        console.log('MongoDB Connection Error:', error);
    });