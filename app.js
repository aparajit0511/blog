var express = require("express");
var app = express();

var method = require("method-override");

var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:true}));

app.use(method("_method"));

//APP CONFIG-----------------------------------------------------------------
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/tech_blog");

app.set("view engine","ejs");
app.use(express.static("views" + "/public"));

//MONGOOSE MODEL CONFIG-------------------------------------------------------
 var techSchema = new mongoose.Schema({
     title: String,
     image: String,
     body: String,
     date:{type: Date, default: Date.now}
 });
 
var tech = mongoose.model("tech",techSchema);

// tech.create({
//     title: "HP new Zbook ",
//     image: "https://cdn.vox-cdn.com/thumbor/UfAssPA1cOZs7_6Jy9MzditjQs0=/0x0:5000x2814/920x613/filters:focal(2100x1007:2900x1807):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/59277159/HP_ZBook_Studio_X360_Front_ME.0.jpg",
//     body: "The laptop has a 15.6-inch, 4K, touchscreen display and comes with a Wacom AES pen with 4,000 levels of pressure sensitivity."
// });

//RESTFUL ROUTES----------------------------------------------------------------

app.get("/",function(req,res){
   res.redirect("/tech"); 
});

app.get("/tech",function(req,res){
    tech.find({},function(err,list){
        if(err){
            console.log(err);
        }
        else {
            res.render("index",{tech:list});
        }
    });
    // res.send("hi there!! You are on tech page");
});

//NEW----------------------------------------------------------------------------

app.get("/tech/new",function(req,res){
    res.render("new");
});

app.post("/tech",function(req,res){
    tech.create(req.body.tech,function(err,tech){
        if(err){
            console.log(err);
        }
        else {
            res.redirect("/tech");
        }
    });
});

//SHOW--------------------------------------------------------------------------

app.get("/tech/:id",function(req, res) {
    tech.findById(req.params.id,function(err,find){
        if(err){
            console.log(err);
        }
        else {
            res.render("show",{tech:find});
        }
    });
    // res.send("Welcome to show page!!!");
});

//EDIT--------------------------------------------------------------------------

app.get("/tech/:id/edit",function(req, res) {
    tech.findById(req.params.id,function(err,edit){
        if(err){
            console.log(err);
        }
        else {
             res.render("edit",{tech:edit});
        }
    });
   
    // res.send("welcome to edit page");
});

//UPDATE------------------------------------------------------------------------

app.put("/tech/:id",function(req,res){
    tech.findByIdAndUpdate(req.params.id,req.body.tech,function(err,id){
        if(err){
            console.log(err);
        }
        else {
            res.redirect("/tech/" + req.params.id);
        }
    });
});

//SEEK AND DESTROY--------------------------------------------------------------

app.delete("/tech/:id",function(req,res){
    tech.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }
        else {
            res.redirect("/tech");
        }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server is Running!!!!");
});