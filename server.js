require("dotenv")
const express = require("express")
const app = express()

app.get("/api/v3", (req, res) => {
    res.send("Hello test")
})

app.listen(5000, () => {
    console.log("Server runs at port 5000")
})