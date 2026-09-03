import mongoose from "mongoose" ;

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  });