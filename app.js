const express = require("express");
const routes = require('./routes');

const app = express();

app.set("view engine", "pug");
app.use(express.static('public'));

app.use(routes);

app.listen(3000, () => {
    console.log("listening on localhost:3000")
});