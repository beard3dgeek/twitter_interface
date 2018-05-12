const express = require("express");
const bodyParser = require("body-parser");
const routes = require('./routes');

const app = express();

app.set("view engine", "pug");
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.use(routes);

app.use((request,response,next) => {
    const err = new Error("Tweet Not Found !!")
    err.status = 404;
    next(err);
});

app.use((error,request,response,next )=> {
    response.render('error',{error, message: "oh no something went wrong"});
});

app.listen(3000, () => {
    console.log("listening on localhost:3000")
});