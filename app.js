const express = require("express");
const routes = require('./routes');

const app = express();

app.set("view engine", "pug");

app.use(routes);

app.listen(3000, () => {
    console.log("hello world listening on localhost:3000")
});