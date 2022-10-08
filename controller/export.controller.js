const tokenService = require("../services/token.service");
const Pdf = require("pdfkit-table");
const fs = require("fs");
const crypto = require("crypto");

const pdf = async (request, response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const company = token.data.companyInfo;

    const comingData = request.body;
    let pdfData = JSON.parse(comingData.data);
    const random = crypto.randomBytes(4).toString("hex");
    let pdfFile = "public/exports/"+random+".pdf";
    const doc = new Pdf({
      margin: 30,
      page: "A4"
    });

    doc.pipe(fs.createWriteStream(pdfFile));
    doc.fontSize(18);
    doc.text(company.company_name,{
      align: "center"
    })

    doc.moveDown(2);

    const table = {
      title: "Clients Report",
      headers: [
        {
          label: "Client name",
          property: "clientName",
          width: 100
        },
        {
          label: "Country",
          property: "country",
          width: 100
        },
        {
          label: "Email",
          property: "email",
          width: 150
        },
        {
          label: "Mobile",
          property: "mobile",
          width: 100
        },
        {
          label: "Joined at",
          property: "joinedAt",
          width: 100
        },
      ],
      datas: []
    }
    //clientName clientEmail clientCountry clientMobile createdAt
    for(let data of pdfData)
    {
      table.datas.push({
        clientName: data.clientName,
        country: data.clientCountry,
        email: data.clientEmail,
        mobile: data.clientMobile,
        joinedAt: data.createdAt
      });
    }

    doc.table(table, {width: 300});

    doc.end();
    response.status(200);
    response.json({message: "success", filename: random+".pdf"})
  }
  else {
    response.status(401);
    response.json({message: "Permission denied"})
  }
}

const deletePdf = async (request, response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    let filename = "public/exports/"+request.params.filename;
    fs.unlinkSync(filename);
    response.status(200);
    response.json({message: "Success"});
  }
  else {
    response.status(401);
    response.json({message: "Permission denied"});
  }
}

module.exports = {
  pdf: pdf,
  deletePdf: deletePdf
}
