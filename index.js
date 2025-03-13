const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "randomabhishek"
const app = express();

app.use(express.json());

const users =  [];
//[
//       {username:"abhi" , password: "argusadmin" }
//
//]

//should return a random long string
//we should use jwt instead of this
// function generateToken() {
//     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     let token = "";
//     for (let i = 0; i < 32; i++) {
//         // use a simple function here
//         token += options[Math.floor(Math.random() * options.length)];
//     }
//     return token;
// }

//middleware (logger)

function logger( req, res, next){
    console.log(req.method + "request came");
    next();
    
}

app.get("/", function(req,res){
    res.sendFile(__dirname + "/public/index.html")
})

app.post("/signup", logger, function(req, res){
    //input validation using zod -> later
    const username = req.body.username;
    const password = req.body.password;
    users.push({
        username : username,
        password : password
    })

    res.json({
        message: "you are signed up"
    })

    console.log(users);
    

})

app.post("/signin", logger, function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = users.find(function(u){
        if(u.username == username && u.password == password){
            return true;
        }else{
            return false;
        }
    })

    if(foundUser){
         //convert their username over to a jwt
        const token = jwt.sign({
            username : username
        }, JWT_SECRET); 
        // foundUser.token = token;  //no need to store it in memory variable
        res.json({
            token: token
        })
    }else{
        res.status(403).send({
            messsage: "Invalid username and password"
        })
    }

    console.log(users);
    

})

function auth(req, res, next){
    const token =  req.header.token;
    const decodedInfo = jwt.verify(token, JWT_SECRET);
    if(decodedInfo.username){
        req.username = decodedInfo.username;
        next()
    }else{
        res.json({
            message: "you are not logged in"
        })
    }
}

app.get("/me", logger, auth, function(req, res){
   
    const foundUser = users.find(function(u){
        if(u.username == req.username){
            return true;
        }else{
            return false;
        }
    })

    if(foundUser){
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    }else{
        res.json({
            message: "token invalid"
        })
    }
})

//if we have to authenticate the user in multiple apis then we have to write logic for auth again and again so we should make a middleware
//to use it in multiple apis 
// {const token = req.header.token;
//   const decodedInfo = jwt.verify(token , JWT_SECRET);}

app.listen(3000);

