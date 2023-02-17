exports.createCode = (size) => {
    let code = ""
    let schema = "0123456789"
    for (let index = 0; index < schema.length; index++) {
        code += schema.charAt(Math.floor(Math.random() * schema.length))
    }

    return code;
}