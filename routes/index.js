const authRoutes = require("./authRoutes")
const postRoutes = require("./postRoutes")
const userRoutes = require("./userRoutes")
const imageRoutes = require("./imageRoutes")
const healthRoutes = require("./healthRoutes")
const reactRoutes = require("./reactRoutes")

const routes = {
    authRoutes,
    postRoutes,
    userRoutes,
    imageRoutes,
    healthRoutes,
    reactRoutes
}

module.exports = routes