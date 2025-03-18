const jwt = require("jsonwebtoken");
// [SECTION] Environment Setup
// import our .env for environment variables
require('dotenv').config();


//[Section] Token Creation

module.exports.createAccessToken = (user) => {
    const data = {
        id : user._id,
        email : user.email,
        isAdmin : user.isAdmin
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
    
};


//[Token Verification]

module.exports.verify = (req, res, next) => {
    console.log("headers:", req.headers.authorization); //checked if this is received

    let token = req.headers.authorization;

    if(typeof token === "undefined"){
        return res.send({ auth: "Failed. No Token" }); //no token
    } else {
        console.log("token:", token);     
        token = token.slice(7, token.length);

        console.log("sliced token:", token);


        //[Token decryption] 

        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){
            
            //If there was an error in verification, an erratic token, a wrong secret within the token, we will send a message to the client.
            if(err){
                return res.status(403).send({
                    auth: "Failed",
                    message: err.message
                });

            } else {

                console.log("result from verify method:")
                console.log(decodedToken);
                
                // Else, if our token is verified to be correct, then we will update the request and add the user's decoded details.
                req.user = decodedToken;

                next();
            }
        })
    }
};

//[Verify Admin] 
module.exports.verifyAdmin = (req, res, next) => {


    if(req.user.isAdmin){
        next();
    } else{
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        })
    }

}


//[Error Handler]
module.exports.errorHandler = (err, req, res, next) => {
    console.log(err);
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';


    res.status(statusCode).json({
        error:{
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    })


}

//[auth.js] Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}
