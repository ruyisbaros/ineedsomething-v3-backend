require("dotenv").config()
const routes = require('./routes/index');
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require("mongoose")
const app = express()

//Related middleware
app.use(cors({
    origin: `${process.env.FRONT_URL}`,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200
}))
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//DB connection
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
})
    .then(() => {
        console.log("DB connection done")
    })
    .catch(e => {
        console.log(e)
})
//Routes
app.use("/api/v3/auth", routes.authRoutes)
app.use("/api/v3/posts", routes.postRoutes)


app.listen(5000, () => {
    console.log("Server runs at port 5000")
})