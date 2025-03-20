// [Dependencies and Modules] 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// //[Routes] 
const userRoutes = require("./routes/user.js");
const commentRoutes = require("./routes/comment.js");
const postRoutes = require("./routes/post.js");

require('dotenv').config();


const app = express();

app.use(express.json());


const corsOptions = {
    origin: [
        'http:localhost:3000',
        'https://sample-blog-client.vercel.app', 
        'https://sample-blog-5.onrender.com'], 

    credentials: true,  // Allow cookies and headers
    optionsSuccessStatus: 200 // For legacy browser support
};


app.use(cors(corsOptions));




mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open',()=> console.log('Now Connected to MongoDB Atlas.'));

app.use("/users", userRoutes);
app.use("/comments", commentRoutes);
app.use("/posts", postRoutes);




if(require.main === module){
    app.listen( process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${ process.env.PORT }`)
    });
}

module.exports = { app, mongoose };