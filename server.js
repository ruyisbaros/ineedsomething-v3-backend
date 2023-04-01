/* something-deploy.s3-website.eu-central-1.amazonaws.com */
require("dotenv").config()
const routes = require('./routes/index');
const express = require("express")
const cookieSession = require("cookie-session")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const mongoose = require("mongoose")
const SocketServer = require("./socketServer")
//const WebSocketServer = require("websocket").server
const { Server } = require("socket.io")

const app = express()
//Sockets
const http = require("http").createServer(app)
const io = new Server(http, {
    pingTimeout: 60000,
    cors: {
        origin: `${process.env.FRONT_URL}`,
        credentials: true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    },
})

//Related middleware
app.set("trust proxy", 1)
app.use(
    cookieSession(
        {
            name: "session",
            //domain: "https://ineedsomething.org",
            keys: [`${process.env.KEY_ONE}`, `${process.env.KEY_TWO}`],
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
            secure: true,
            //secure: process.env.NODE_ENV === "production",
            sameSite: "none",//use for production
        })
)

app.use(
    cors({
        origin: `${process.env.FRONT_URL}`,
        credentials: true,
        allowedHeaders: ['Content-Type', "Origin", "X-Requested-Width", "Accept", 'Authorization', "X-HTTP_Method-Override", "Access-Control-Allow-Origin", "X-PINGOTHER"],
        preflightContinue: false,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        optionsSuccessStatus: 200,
        maxAge: 600
    })
);
app.use(helmet())

app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(__dirname + "/public"));

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

//Socket functions

io.on("connection", (socket) => {
    //console.log("Connected to: ", socket.id)
    SocketServer(socket)
})
//Routes
app.use("", routes.healthRoutes)
app.use("/api/v3/auth", routes.authRoutes)
app.use("/api/v3/posts", routes.postRoutes)
app.use("/api/v3/users", routes.userRoutes)
app.use("/api/v3/images", routes.imageRoutes)
app.use("/api/v3/post/reacts", routes.reactRoutes)
app.use("/api/v3/post/comments", routes.commentRoutes)
app.use("/api/v3/user/notifications", routes.notifyRoutes)

http.listen(5000, () => {
    console.log("Server runs at port 5000")
})

/* const wss = new WebSocketServer({
    httpServer: http
})

const clients = {}
const getUniqID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)

    return s4() + s4() + "-" + s4()
}
wss.on("request", (request) => {
    const userID = getUniqID()
    console.log((new Date()) + "request received from: " + request.origin)

    const connection = request.accept(null, request.origin)
    clients[userID]=connection
}) */