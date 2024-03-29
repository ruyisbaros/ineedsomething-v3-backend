const authRoutes = require("./authRoutes");
const postRoutes = require("./postRoutes");
const userRoutes = require("./userRoutes");
const imageRoutes = require("./imageRoutes");
const healthRoutes = require("./healthRoutes");
const reactRoutes = require("./reactRoutes");
const commentRoutes = require("./commentRoutes");
const notifyRoutes = require("./notifyRoute");
const chatRoutes = require("./chatRouter");

const routes = {
  authRoutes,
  postRoutes,
  userRoutes,
  imageRoutes,
  healthRoutes,
  reactRoutes,
  commentRoutes,
  notifyRoutes,
  chatRoutes,
};

module.exports = routes;
