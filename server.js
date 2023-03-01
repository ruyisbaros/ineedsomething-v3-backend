require("dotenv").config()
const routes = require('./routes/index');
const express = require("express")
const cookieSession = require("cookie-session")
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require("mongoose")
const fileUpload = require("express-fileupload")

const bodyParser = require("body-parser");

const app = express()



//Related middleware
app.use(cors({
    origin: process.env.FRONT_URL,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200
}))
app.use(morgan("dev"));
app.set("trust proxy", 1)
app.use(
    cookieSession(
        {
            name: "session",
            //domain: "https://ineedsomething.org",
            keys: [process.env.KEY_ONE, process.env.KEY_TWO],
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
            secure: true,
            sameSite: "none",//use for production
        })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({
    useTempFiles: true
}))
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

//DB connection
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
})
    .then(() => {
        console.log("DB connection done")
    })
    .catch(e => {
        console.log(e)
    })
mongoose.set('strictQuery', false);
//Routes
app.use("", routes.healthRoutes)
app.use("/api/v3/auth", routes.authRoutes)
app.use("/api/v3/posts", routes.postRoutes)
app.use("/api/v3/users", routes.userRoutes)
app.use("/api/v3/images", routes.imageRoutes)


app.listen(5000, () => {
    console.log("Server runs at port 5000")
})