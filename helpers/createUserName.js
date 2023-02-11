const User = require("../models/userModel")
exports.createUsername = async (name1, name2) => {
    let temp;
    temp = name1 + name2
    return await checkIfUsernameExist(temp)
}

async function checkIfUsernameExist(username) {
    let a = false

    do {
        let check = await User.findOne({ username })
        if (check) {
            username = username + (new Date() * Math.random().toString().substring(0, 1))
            a = true
        } else {
            a = false
        }
    } while (a);

    return username
}