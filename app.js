const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const port=3000;
const app=express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",(req,res)=>{
    const fName=req.body.firstName;
    const lName=req.body.secondName;
    const email=req.body.email;

    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FName: fName,
                    LName: lName
                }
            }
        ]
    }

    const JSONData=JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/8fbd8608a3";
    
    const options={
        method: "POST",
        auth: "apikey:84706a01ce914fc68759597e88f819f1-us21"
    }

    const request=https.request(url,options,function(response){
        if(response.statusCode===200){
            // res.send("Thanks for subscribing to our newsletter");
            res.sendFile(__dirname+"/success.html");
        }else{
            // res.send("Uh Oh! There's some mistake. Please try again dude!");
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            const string=data.toString();
            // console.log(JSON.parse(string));
        })
    });
    request.on("error",(err)=>{
        console.log("Error aagyo isme",err);
    })

    request.write(JSONData);
    request.end();
});

app.listen(process.env.PORT || port,(err)=>{
    if(err){
        console.log("Error in running the server");
    }
    console.log("Server is up and running on port 3000");
});



// api key:  d66fd0eb9a52adb22d5abaa1e81d1a41-us21
// 84706a01ce914fc68759597e88f819f1-us21
// unique id: 8fbd8608a3