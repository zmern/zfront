const mongo = require("mongoose");
const {Schema} = mongo;
const companySchema = new Schema({
	company_name: {type: String, unique: true},
	email: {type: String, unique: true},
	mobile: Number,
	logoUrl: String,
	emailVerified: {type: Boolean, default: false},
	mobileVerified: {type: Boolean, default: false},
	isLogo: {type: Boolean, default: false},
	createdAt: {type: Date, default: Date.now}
});

// company name unique validation
companySchema.pre("save", async function(next){
	const query = {
		company_name: this.company_name
	}

	const length = await mongo.model("Company").countDocuments(query);
	if(length > 0)
	{
		const cmpError = {
			label: "company name already exist",
			field: "company-name"
		}
		throw next(cmpError);
	}
	else {
		next();
	}
});

// company email uique validation
companySchema.pre("save", async function(next){
	const query = {
		email: this.email
	}

	const length = await mongo.model("Company").countDocuments(query);
	if(length > 0)
	{
		const emailError = {
			label: "company email already exist",
			field: "company-email"
		}
		throw next(emailError);
	}
	else {
		next();
	}
});

module.exports = mongo.model("Company", companySchema);
