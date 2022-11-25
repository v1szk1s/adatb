const express =  require("express");
const path = require("path");

const app = express();

const router = require("./routes/routes.js");

const PORT = process.env.PORT || 8000;
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(PORT, () => console.log('Server running at http://localhost:' + PORT));


