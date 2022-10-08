
const config = {
  accessKeyId: "AKIAVEAAIUOQH7T7FA4F",
  secretAccessKey: "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",
  region: "ap-south-1",
  params: {
    Bucket: "docs.zmern.tech"
  }
}

const s3 = new AWS.S3(config);

function ajax(request)
{
  return new Promise((resolve, reject)=>{
    let options = {
      type: request.type,
      url: request.url,
      beforeSend: function()
      {
        if(request.isLoader)
        {
          $(request.commonBtn).addClass("d-none");
          $(request.loaderBtn).removeClass("d-none");
        }
      },
      success: function(response)
      {
        if(request.isLoader)
        {
          $(request.loaderBtn).addClass("d-none");
          $(request.commonBtn).removeClass("d-none");
        }
        resolve(response);
      },
      error: function(errorRes)
      {
        if(request.isLoader)
        {
          $(request.loaderBtn).addClass("d-none");
          $(request.commonBtn).removeClass("d-none");
        }
        reject(errorRes);
      }
    };
    if(request.type == "POST" || request.type == "PUT")
    {
      options['data'] = request.data;
      options['contentType'] = false;
      options['processData'] = false;
    }
    else if(request.type == "DELETE")
    {
      options['data'] = request.data;
    }
    $.ajax(options);

  });

}

// get cookie
function getCookie(cookieName){
  const allCookie = document.cookie;
  const cookies = allCookie.split(";");
  let cookieValue = "";
  for(let cookie of cookies)
  {
    let currentCookie = cookie.split("=");
    if(currentCookie[0].trim() == cookieName)
    {
      cookieValue = currentCookie[1];
      break;
    }
  }
  return cookieValue;


}

function formatDate(dateString){
  const date = new Date(dateString);
  let dd = date.getDate();
  let mm = date.getMonth()+1;
  const yy = date.getFullYear();

  // get time
  let time = date.toLocaleTimeString();
  const times = time.split(":");
  const amPm = times[2].split(" ")[1];
  time = times[0]+":"+times[1]+"<sup class='m-0 p-0'>"+amPm+"</sup>";
  // insert 0 before date
  dd < 10 ? dd = "0"+dd : null;
  // insert 0 before month
  mm < 10 ? mm = "0"+mm : null;
  return dd+"-"+mm+"-"+yy+"/ "+time;
}


// decode token
function decodeToken(token){
  let payload = token.split(".")[1];
  let string =  atob(payload);
  let objectData = JSON.parse(string)
  return objectData;
}

// upload file
async function uploadFileOnS3(file){
  const fileInfo = {
    Key: file.name,
    Body: file,
    Acl: "public-read"
  }
  try {
    const object = await s3.upload(fileInfo)
    .on("httpUploadProgress", (progress)=>{
      let loaded = progress.loaded;
      let total = progress.total;
      let percentage = Math.floor((loaded*100)/total);
      $(".progress-width").css({width: percentage+"%"});
      $(".progress-text").html(percentage+"%");

      // calculate mb
      let totalMb = (total/1024/1024).toFixed(1);
      let loadedMb = (loaded/1024/1024).toFixed(1);
      $(".progress-in-mb").html(loadedMb+"Mb / "+totalMb+"Mb");
    })
    .promise();
    return object.Location;
  }
  catch(err)
  {
    return err;
  }
}

function ajaxDownloader(request) {
  return $.ajax({
    type: request.type,
    url: request.url,
    xhr: function(){
      const xml = new XMLHttpRequest();
      xml.responseType = "blob";
      return xml;
    }
  }).promise();
}
