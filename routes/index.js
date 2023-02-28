const authRoutes = require("./authRoutes")
const postRoutes = require("./postRoutes")
const userRoutes = require("./userRoutes")
const imageRoutes = require("./imageRoutes")
const healthRoutes = require("./healthRoutes")

const routes = {
    authRoutes,
    postRoutes,
    userRoutes,
    imageRoutes,
    healthRoutes
}

module.exports = routes