const mongo = require("mongoose");
const bcrypt = require("../services/bcrypt.service");
const {Schema} = mongo;
const userSchema = new Schema({
	uid: {type: String, unique: true},
	password: {type: String, required: [true, "password field is required"]},
	token: String,
	expiresIn: Number,
	isLogged: Boolean,
	role: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

userSchema.pre("save", async function(next){
	const data = this.password.toString();
	const encrypted = await bcrypt.encrypt(data);
	this['password'] = encrypted;
	next()
})

module.exports = mongo.model("User", userSchema);
