const bcrypt = require("bcrypt");

const encrypt = async (data)=>{
	const encrypted = await bcrypt.hash(data, 12);
	return encrypted;
}

const dcrypt = async (typedPass, realPass)=>{
	const isVerified = await bcrypt.compare(typedPass, realPass);
	return isVerified;
}

module.exports = {
	encrypt: encrypt,
	dcrypt: dcrypt
}