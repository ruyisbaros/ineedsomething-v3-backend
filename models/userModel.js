const mongoose = require("mongoose")
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema({

})

authSchema.pre('save', function (next) {
    if (!this.password.isModified()) return;
    this.password = bcrypt.hash(this.password);
    next();
});

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordTrue = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}
userSchema.methods.hashPassword = async function (password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model("User", userSchema)

module.exports = User