const router = require("express").Router()
const moment = require("moment")
const axios = require("axios")

router.get("/health", (req, res) => {
    res.status(200).send(`Health: Server instance is running healthy with process id ${process.pid} on ${moment().format("LL")} `);
});

router.get("/env", (req, res) => {
    res.status(200).send(`This is the ${process.env.NODE_ENV} environment`);
});

router.get("/instance", async (req, res) => {
    const response = await axios.get(`${process.env.EC2_URL}`);
    res
        .status(200)
        .send(`Server is running on EC2 instance with id:  ${response.data} and process id: ${process.pid} on ${moment().format("LL")}`);
});

module.exports = router