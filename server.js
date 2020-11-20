const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const superSecret = 'jGafbANeXBoTGDcIZj2x0uQR5pJw0hmg'

const port = 8000

var user = {
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
}

app.get("/", express.static("frontend"))

app.get("/login", (req, res)=>{
    if(req.query.email == user.email && req.query.password == user.password){
        let payload = {
            email: user.email,
            role: user.role
        }

        let token = generateJwt(payload)
        res.status(200).send({token: token});
    }
    else{
        res.status(404).send("User not found!")
    }
})

app.get("/user-endpoint", (req, res)=>{
    if(req.headers.authorization){
        let token = getTokenFromJwt(req.headers.authorization);
        if(token.role == 'user'){
            res.status(200).send("Access granted")
        }
        else{
            res.status(401).send("Unauthorized")
        }
    }
})

app.get("/admin-endpoint", (req, res)=>{
    if(req.headers.authorization){
        let token = getTokenFromJwt(req.headers.authorization);
        if(token.role == 'admin'){
            res.status(200).send("Access granted")
        }
        else{
            res.status(401).send("Unauthorized")
        }
    }
})

app.listen(port, () =>{
    console.log(`Listening on ${port}`)
})

function generateJwt(payload){
    var token = jwt.sign(payload, superSecret, {
        expiresIn: "1h",
        issuer: "WebTechAuth"
    })

    return token;
}

function getTokenFromJwt(data){
    var payload = jwt.verify(data, superSecret)
    return payload
}