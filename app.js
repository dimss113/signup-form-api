const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/signup", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.get("/failure", function(req, res){
    res.sendFile(__dirname + "/failure.html");
});

app.get("/success", function(req, res){
    res.sendFile(__dirname + "/success.html");
});

app.post("/signup", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    console.log(firstName, lastName, email);

    const data = {
        members: [
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url= "https://us21.api.mailchimp.com/3.0/lists/9fb34fe91e";

    const options = {
        method: "POST",
        auth: "dimasf11:a7427d5841de355223281276e861cf1ca-us21"
    }

    const request = https.request(url, options, function(response){
        console.log(response.statusCode);
        if(Number(response.statusCode) === 200){
            // res.sendFile(__dirname + "/success.html");
            res.redirect("/success");
        }else{
            // res.sendFile(__dirname + "/failure.html");
            res.redirect("/failure");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/signup");
});

app.post("/success", function(req,res){
    res.redirect("/signup");
});

app.listen(3000, function(req, res){
    console.log("server is running on port 3000");
});

// api key
// 7427d5841de355223281276e861cf1ca-us21

// list id
// 9fb34fe91e