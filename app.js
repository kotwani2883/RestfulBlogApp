var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

//App config
const url=process.env.MONGO_URL||'mongodb://localhost:27017/restful_blog_app';
mongoose.connect(url , { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Mongoose.model config
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);
/*Blog.create({
    title:"Test",
    image:"https://images.unsplash.com/photo-1519337265831-281ec6cc8514?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    body:"hello Welcome to the first Blog!!"
});*/
//Restful Routes

app.get("/",function(req,res){
    res.redirect("/blogs");
})
//index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("ERROR!!");
        }else{
            res.render("index",{blogs: blogs});
        }
    });
});

//NEW Route
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//Create route
app.post("/blogs",function(req,res){
    //create blog
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
  if(err)
  res.render("new");
  else
  res.redirect("/blogs");
    });
});
//Show route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
 });

 //EDIT
 app.get("/blogs/:id/edit",function(req,res){
     Blog.findById(req.params.id,function(err,foundBlog){
         if(err)
         res.redirect("/blogs");
         else
         res.render("edit",{blog:foundBlog});
     });
 });

 //Update Route
 app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
     Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
         if(err)
         {
         res.redirect("/blogs");
         }
         else
         {res.redirect("/blogs/"+req.params.id);
        }
     });
 });

 //DELETE ROuTE
 app.delete("/blogs/:id",function(req,res){
   //destroy blog
   Blog.findByIdAndDelete(req.params.id,function(err){
       if(err)
       res.redirect("/blogs");
       else
       res.redirect("/blogs");
   })
   //redirect
 });


var  port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log("server is up and Running!!");
})
