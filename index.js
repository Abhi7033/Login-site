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

app.post("/signup", function(req, res){
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

app.post("/signin", function(req, res){
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

app.get("/me", function(req, res){
    const token = req.header.token; //jwt
    const decodedInfo = jwt.verify(token , JWT_SECRET); // we will get the decoded username here {username : abc} 
    const username = decodedInfo.username;

    const foundUser = users.find(function(u){
        if(u.username == username){
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

app.listen(3000);

