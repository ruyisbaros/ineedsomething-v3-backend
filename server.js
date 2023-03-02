/* something-deploy.s3-website.eu-central-1.amazonaws.com */
require("dotenv").config()
const routes = require('./routes/index');
const express = require("express")
const cookieSession = require("cookie-session")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const mongoose = require("mongoose")
const fileUpload = require("express-fileupload")

const bodyParser = require("body-parser");

const app = express()

//Related middleware
app.use(
    cookieSession(
        {
            name: "session",
            //domain: "https://ineedsomething.org",
            keys: [`${process.env.KEY_ONE}`, `${process.env.KEY_TWO}`],
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",//use for production
        })
);
app.use(helmet())
/* app.use((req,res,next)=>{
    res.header(`Access-Control-Allow-Origin: ${process.env.FRONT_URL}`)
    res.header(`Access-Control-Allow-Methods: POST,GET,DELETE,OPTIONS,PUT,PATCH,HEAD`)
    res.header(`Access-Control-Allow-Headers: Content-Type, Origin, X-Requested-Width, Accept, Authorization, X-HTTP_Method-Override, Access-Control-Allow-Origin`)
}) */
app.options("/api/v3/*", cors({
    origin: process.env.FRONT_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', "Origin", "X-Requested-Width", "Accept", 'Authorization', "X-HTTP_Method-Override", "Access-Control-Allow-Origin"],
    exposedHeaders: [],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
}))
app.use(
    cors({
        origin: process.env.FRONT_URL,
        credentials: true,
        allowedHeaders: ['Content-Type', "Origin", "X-Requested-Width", "Accept", 'Authorization', "X-HTTP_Method-Override", "Access-Control-Allow-Origin"],
        exposedHeaders: [],
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        optionsSuccessStatus: 200,
    })
);
/* app.use(cors({
    origin: `${process.env.FRONT_URL}`,
    allowedHeaders: ['content-type', "Origin", "X-Requested-Width", "Accept", 'Authorization', "access-control-allow-origin"],
    credentials: true,
    preflightContinue: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
})) */
app.use(morgan("dev"));
app.set("trust proxy", 1)

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