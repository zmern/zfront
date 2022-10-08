const mongo = require("mongoose");
const {Schema} = mongo;
const clientSchema = new Schema({
  companyId: [String],
  clientName: String,
  clientEmail: String,
  clientCountry: String,
  clientMobile: Number,
  isUser: {
    type: Boolean,
    default: false
  },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

clientSchema.pre("save", async function(next){
  const query = {
    companyId: this.companyId,
    clientEmail: this.clientEmail
  }
  let length = await mongo.model("Client").countDocuments(query);
  if(length === 0)
  {
    next();
  }
  else {
    throw next("Client email already exist");
  }
});

module.exports = mongo.model("Client", clientSchema);
