require("dotenv").config();
const pug = require("pug");
const AWS = require("aws-sdk");
const config = {
  accessKeyId: process.env.AWS_ACCESSKEYID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1"
}
const mailer = new AWS.SES(config);

const tokenService = require("../services/token.service");

const sendEmail = async (request, response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const data = JSON.parse(request.body.reciept);
    console.log(data);
    const emailInfo = {
        Destination: {
          ToAddresses: [
            data.to
          ]
        },
        Message: {
          Subject: {
            Charset: "UTF-8",
            Data: data.subject
          },
          Body: {
            Html: {
                Charset: "UTF-8",
                Data: pug.renderFile("D:/ADSE/PRACTICAL/NODE JS_PRACTICE/PROJECT/p-38/zfront/views/email-template.pug", data)
            }
          }
        },
        Source: "connect@chitrastore.com"

    }
    try {
      await mailer.sendEmail(emailInfo).promise();
      response.status(200);
      response.json({message: "Sending success"})
    }
    catch(error)
    {
      response.status(424);
      response.json({message: "Sending failed"})
    }

  }
  else {
    response.status(401);
    response.json({message: "permission denied"})
  }
}

module.exports = {
  sendEmail: sendEmail
}
