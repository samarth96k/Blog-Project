import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;
let saved_blog_list = [];
app.use(express.static("public"));
app.set("view engine", "ejs"); 
app.get("/",(req,res)=>{
    res.render("index.ejs",{
        blog_list: saved_blog_list // ADDED: handed over blog data to EJS
    });
});

app.use(bodyParser.urlencoded({extended:true}));

app.post("/submit-new-vlog",(req,res)=>{
    let title = req.body["title"];
    let category =req.body["category"]; 
    let auth = req.body["author"];
    let desc = req.body["desc"];
    let date = new Date().getDate()+"-"+(new Date().getMonth()+1)+"-"+new Date().getFullYear();
    let new_blog_entry = [title,category,auth,desc,date];
    saved_blog_list.push(new_blog_entry);
    res.render("index.ejs",{
        blog_list:saved_blog_list
    })
    console.log(saved_blog_list);
    // res.redirect("/");
});

app.get("/vlog/:id",(req,res)=>{
    const id = req.params.id;
    const vlog = saved_blog_list[id];
    if(!vlog){
        return res.redirect("/");
    }
    res.render("vlog",{ vlog, id });
});

app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id); // ✅ convert to integer

    const vlog = saved_blog_list[id];  // ✅ fetch blog

    if (!vlog) {                        // ✅ check existence
        return res.redirect("/");       // redirect if invalid
    }

    res.render("edit.ejs", {
        vlog: vlog,
        vlogId: id
    });
});


app.post("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id); // ✅ convert to integer

    const vlog = saved_blog_list[id];
    if (!vlog) {
        return res.redirect("/"); // prevent errors
    }

    saved_blog_list[id][0] = req.body.title;  // title
    saved_blog_list[id][3] = req.body.desc;   // description

    res.redirect("/");
});


app.get("/delete/:id",(req,res)=>{
   saved_blog_list.splice(req.params.id,1);
   res.redirect("/");
});


app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
});