require("dotenv").config();
const mongo = require("mongoose");
const companySchema = require("../model/company.model");
const userSchema = require("../model/user.model");
const clientSchema = require("../model/clients.model");
const url = process.env.DBURL;
const options = {useNewUrlParser: true, useUnifiedTopology: true};

mongo.connect(url, options);

const schemaList = {
	company: companySchema,
	user: userSchema,
	client: clientSchema
}

const createRecord = async (data, schema)=>{
	const currentSchema = schemaList[schema];
	const collection = new currentSchema(data);
	const dataRes = await collection.save();
	return dataRes;
}

const getByQuery = async (query, schema)=>{
	const currentSchema = schemaList[schema];
	const dataRes = await currentSchema.find(query);
	return dataRes;
}

const updateByQuery = async (query, schema, data)=>{
	const currentSchema = schemaList[schema];
	const dataRes = await currentSchema.updateOne(query, data);
	return dataRes;
}

const countData = async (schema)=>{
	const currentSchema = schemaList[schema];
	const dataRes = await currentSchema.countDocuments();
	return dataRes;
}

const paginate = async (query, from, to, schema)=>{
	const currentSchema = schemaList[schema];
	const dataRes = await currentSchema.find(query).skip(from).limit(to);
	return dataRes;
}

const deleteById = async (id, schema)=>{
	const currentSchema = schemaList[schema];
	const dataRes = await currentSchema.findByIdAndDelete(id);
	return dataRes;
}

const updateById = async (id, data, schema)=>{
	const currentSchema = schemaList[schema];
	const updateRes = await currentSchema.findByIdAndUpdate(id, data, {new: true});
	return updateRes;
}

module.exports = {
	createRecord: createRecord,
	getByQuery: getByQuery,
	updateByQuery: updateByQuery,
	countData: countData,
	paginate: paginate,
	deleteById: deleteById,
	updateById: updateById
}
