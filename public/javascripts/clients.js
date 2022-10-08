// working with country api
$(document).ready(function(){
  $("#country").on("input", async function(){
    let keyword = $("#country").val().trim().toLowerCase();
    const check = checkInLs("country");
    if(check.isExist)
    {
      const countries = check.data;
      let dial_code = 0;
      for(let country of countries)
      {
        if(country.name.toLowerCase().indexOf(keyword) != -1)
        {
          dial_code = country.dial_code;
        }
      }
      $("#code").html(dial_code);
    }
    else {
        const request = {
          type: "GET",
          url: "../json/countrycodes.json"
        }
      try {
        const response = await ajax(request);
        const jsonData = JSON.stringify(response);
        localStorage.setItem("country", jsonData);
      }
      catch(error)
      {
        console.log(error);
      }
    }

  });
});

function checkInLs(key)
{
  if(localStorage.getItem(key) != null)
  {
    const tmp = localStorage.getItem(key);
    const data = JSON.parse(tmp);
    return {
      isExist: true,
      data: data
    }
  }
  else {
    return {
      isExist: false
    }
  }
}

// open modal
$(document).ready(function(){
  $("#add-client-btn").click(function(){
    $("#client-modal").modal("show");
    $("#client-form").trigger("reset");
    $("#client-form").removeClass("update-client-form");
    $("#client-form").addClass("add-client-form");
    $("#add-client-submit").html("Submit");
    $("#add-client-submit").removeClass("btn-danger px-3");
    $("#add-client-submit").addClass("btn-primary");
    addClient();
  });
});


// add client
function addClient(){
  $(".add-client-form").submit( async function(e){
    e.preventDefault();
    const token = getCookie("authToken");
    const formData = new FormData(this);
    formData.append("token", token);
    const request = {
      type: "POST",
      url: "/clients",
      data: formData,
      isLoader: true,
      commonBtn: "#add-client-submit",
      loaderBtn: "#add-client-loader"
    }
    try {
      const dataRes = await ajax(request);
      const client = dataRes.data;
      $(".add-client-form").unbind();
      $("#client-modal").modal("hide");
      const tr = dynamicTr(client);
      $("table").append(tr);
      // activate edit delete or share
      clientAction();
    }
    catch(error)
    {
      $("#add-client-email").addClass("text-danger animate__animated animate__shakeX");
      $("#add-client-email").click(function(){
        $(this).removeClass("text-danger animate__animated animate__shakeX");
      });
    }
  });
};

// update client
function updateClient(oldTr){
  $(".update-client-form").submit(async function(e){
    e.preventDefault();
    const id = $(this).data("id");
    const token = getCookie("authToken");
    const formData = new FormData(this);
    formData.append("token", token);
    formData.append("updatedAt", new Date());
    const request = {
      type: "PUT",
      url: "clients/"+id,
      data: formData,
      isLoader: true,
      commonBtn: "#add-client-submit",
      loaderBtn: "#add-client-loader"
    }
    const response = await ajax(request);
    const client = response.data;
    const tr = dynamicTr(client);
    let newTr = $(tr).html();
    $(oldTr).html(newTr);
    $("#client-form").trigger("reset");
    $("#client-modal").modal("hide");
    clientAction()
  });
};

// show clients
$(document).ready(async function(){
  let from = 0;
  let to = 5;
  await showClients(from, to);
  await getPaginationList();
});

async function showClients(from, to)
{
  $("table").html(`
    <tr>
      <th class="py-2 ps-3">Client</th>
      <th>Email</th>
      <th>Mobile</th>
      <th>Status</th>
      <th>Date</th>
      <th>Action</th>
    </tr>
    `);
  const request = {
    type: "GET",
    url: `clients/${from}/${to}`,
    isLoader: true,
    commonBtn: ".tmp",
    loaderBtn: ".clients-skeleton"
  }

  try {
    const response = await ajax(request);
    sessionStorage.removeItem("current-client");
    if(response.data.length > 0)
    {
      let currentClient = JSON.stringify(response.data);
      sessionStorage.setItem("current-client", currentClient);
      for(let client of response.data)
      {
        const tr = dynamicTr(client);
        $("table").append(tr);
      }
      clientAction();

    }
    else {
      // alert("no data found")
    }
  }
  catch(error)
  {
    console.log(error);
  }
}

// client actions
function clientAction()
{
  // delete clients
  $(document).ready(function(){
    $(".delete-client").each(function(){
      $(this).click(async function(){
        let tr = this.parentElement.parentElement.parentElement;// div->td->tr
        const id = $(this).data("id");
        const token = getCookie("authToken");
        const request = {
          type: "DELETE",
          url: "clients/"+id,
          data: {
            token: token
          }
        }

        const response = await ajax(request);
        $(tr).removeClass("animate__animated animate__fadeIn");
        $(tr).addClass("animate__animated animate__fadeOut");
        setTimeout(function(){
          $(tr).remove();
        },800);

      });
    });
  });

  // edit clients
  $(document).ready(function(){
    $(".edit-client").each(function(){
      $(this).click(function(){
        const tr = this.parentElement.parentElement.parentElement;
        let id = $(this).data("id");
        const clientData = $(this).data("client");
        const clientString = clientData.replace(/'/g, '"');
        const client = JSON.parse(clientString);
        $("#client-form").trigger("reset");
        for(let key in client)
        {
          let value = client[key];
          $(`[name=${key}]`, "#client-form").val(value);
        }
        $("#client-form").attr("data-id", id);
        $("#client-form").removeClass("add-client-form");
        $("#client-form").addClass("update-client-form");
        $("#add-client-submit").html("Save");
        $("#add-client-submit").addClass("btn-danger px-3");
        $("#add-client-submit").removeClass("btn-primary");
        updateClient(tr);
        $("#client-modal").modal("show");
      });
    });
  });

  // open share modal
  $(document).ready(function(){
      $(".share-client").click(async function(){
        let clientId = $(this).data("id");
        let clientEmail = $(this).data("email");
        $(".share-on-email").attr("data-email", clientEmail);
        const token = getCookie("authToken");
        const tmp = decodeToken(token);
        const company = tmp.data.companyInfo;

        const prepareDataForToken = JSON.stringify({
          clientId: clientId,
          companyName: company.company_name,
          email: company.email,
          logo: company.logoUrl
        })
        const formData = new FormData();
        formData.append("token", token);
        formData.append("data", prepareDataForToken);

        const request = {
          type: "POST",
          url: "get-token/172800",
          data: formData
        }

        const response = await ajax(request);
        const linkToken = response.token;

        let link = `${window.location}/invitation/${linkToken}`;
        $(".link").val(link);
        $("#share-modal").modal("show")
      });
  });

  // prevent from link changes
  $(document).ready(function(){
    $(".link").on("keydown",function(){
      return false;
    });
  });

  // copy link
  $(document).ready(function(){
    $(".copy-link").click(function(){
      let linkInput = document.querySelector(".link");
      linkInput.select();
      document.execCommand("copy");
      $("i", this).removeClass("fa fa-copy");
      $("i", this).addClass("fa fa-check");
      setTimeout(()=>{
        $("i", this).removeClass("fa fa-check");
        $("i", this).addClass("fa fa-copy");
      },1000);
    });
  });

  // share on email
  $(document).ready(function(){
    $(".share-on-email").click(async function(){
      let clientEmail = $(this).attr("data-email");
      const token = getCookie("authToken");
      const tokenData = decodeToken(token);
      const company = tokenData.data.companyInfo;
      const formData = new FormData();
      formData.append("token", token);

      const reciept = {
        to: clientEmail,
        subject: "Business Invitation",
        message: "Thank you being the part of our business. We are happy to serve our services for you.",
        companyName: company.company_name,
        companyEmail: company.email,
        companyMobile: company.mobile,
        invitaionLink: $(".link").val(),
        companyLogo: company.logoUrl
      }
      let string = JSON.stringify(reciept);
      formData.append("reciept", string);

      const request = {
        type: "POST",
        url: "/sendmail",
        data: formData,
        isLoader: true,
        commonBtn: ".tmp",
        loaderBtn: ".progressive-loading"
      }
      try {
        const response = await ajax(request);
        $("#share-modal").modal("hide");
      }
      catch(error)
      {
        console.log(error);
      }
    });
  });

}

function dynamicTr(client)
{
  const clientString = JSON.stringify(client);
  const clientData = clientString.replace(/"/g, "'");
  const tr = `
    <tr class="animate__animated animate__fadeIn">
      <td>
        <div class="d-flex align-items-center">
          <i class="fa fa-user-circle me-3" style="font-size: 45px"></i>
          <div>
            <p class="p-0 m-0 text-capitalize client-name">${client.clientName}</p>
            <small class="text-uppercase">${client.clientCountry}</small>
          </div>
        </div>
      </td>
      <td class="client-email">${client.clientEmail}</td>
      <td>${client.clientMobile}</td>
      <td>
        <span class="badge badge-danger">Offline</span>
      </td>
      <td>${formatDate(client.createdAt)}</td>
      <td>
        <div class="d-flex">
          <button class="icon-btn-primary me-3 edit-client" data-client="${clientData}" data-id="${client._id}">
            <i class="fa fa-edit"></i>
          </button>
          <button class="icon-btn-danger me-3 delete-client" data-id="${client._id}">
            <i class="fa fa-trash"></i>
          </button>
          <button class="icon-btn-info share-client" data-id="${client._id}" data-email="${client.clientEmail}">
            <i class="fa fa-share-alt"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
  return tr;
}



async function getPaginationList()
{
  const request = {
    type: "GET",
    url: "clients/count-all"
  }
  const response = await ajax(request);
  const totalClient = response.data;
  let length = totalClient/5;
  let dataSkip = 0
  let i;
  if(length.toString().indexOf(".") != -1)
  {
    length = length+1;
  }
  for(i=1;i<=length;i++)
  {
    let button = `
      <button class="btn border paginate-btn ${i == 1 ? "active" : ""}" data-skip="${dataSkip}">
        ${i}
      </button>
    `;
    $("#client-pagination").append(button);
    dataSkip = dataSkip+5;
  }

  getPaginationData();
}

function getPaginationData()
{
  $(document).ready(function(){
    $(".paginate-btn").each(function(index){
      $(this).click(async function(){
        controlPrevAndNext(index);
        removeClasses("active");
        $(this).addClass("active");
        let skip = $(this).data("skip");
        showClients(skip, 5);
      })
    })
  })
}

function removeClasses(className)
{
  $("."+className).each(function(){
    $(this).removeClass(className);
  })
}

$(document).ready(function(){
  $("#next").click(function(){
    let currentIndex = 0;
    $(".paginate-btn").each(function(){
      if($(this).hasClass("active"))
      {
        currentIndex = $(this).index();
      }
    });
    $(".paginate-btn").eq(currentIndex+1).click()
    controlPrevAndNext(currentIndex+1);
  });
});

$(document).ready(function(){
  $("#prev").click(function(){
    let currentIndex = 0;
    $(".paginate-btn").each(function(){
      if($(this).hasClass("active"))
      {
        currentIndex = $(this).index();
      }
    });
    $(".paginate-btn").eq(currentIndex-1).click()
    controlPrevAndNext(currentIndex-1);
  });
});

function controlPrevAndNext(currentIndex)
{
  const totalBtn = $(".paginate-btn").length-1;
  if(currentIndex == totalBtn)
  {
    $("#next").prop("disabled", true);
  }
  else if(currentIndex > 0)
  {
    $("#prev").prop("disabled", false);
    $("#next").prop("disabled", false);
  }
  else {
    $("#next").prop("disabled", false);
    $("#prev").prop("disabled", true);
  }
}

// filter control
$(document).ready(function(){
  filterByName()
  $(".filter-btn").click(function(){
    if($(".filter").hasClass("filter-by-name"))
    {
      $(".filter").removeClass("filter-by-name");
      $(".filter").addClass("filter-by-email");
      $(".filter").attr("placeholder", "Search by email");
      filterByEmail();
    }
    else {
      $(".filter").addClass("filter-by-name");
      $(".filter").removeClass("filter-by-email");
      $(".filter").attr("placeholder", "Search by name");
    }
  });
});

// filter by name
function filterByName(){
  $(".filter-by-name").on("input", function(){
    let tr = "";
    let keyword = $(this).val().trim().toLowerCase();
    $(".client-name").each(function(){
      let clientName = $(this).html().trim().toLowerCase();
      if(clientName.indexOf(keyword) == -1)
      {
        tr = $(this).parent().parent().parent().parent();
        $(tr).addClass("d-none");
      }
      else {
        tr = $(this).parent().parent().parent().parent();
        $(tr).removeClass("d-none");
      }
    })
  });
};

// filter by email
function filterByEmail(){
  $(".filter-by-email").on("input", function(){
    let tr = "";
    let keyword = $(this).val().trim().toLowerCase();
    $(".client-email").each(function(){
      let clientEmail = $(this).html().trim().toLowerCase();
      if(clientEmail.indexOf(keyword) == -1)
      {
        tr = $(this).parent();
        $(tr).addClass("d-none");
      }
      else {
        tr = $(this).parent();
        $(tr).removeClass("d-none");
      }
    })
  });
};

// export to pdf
$(document).ready(function(){
  $("#current").click(async function(e){
    e.preventDefault();

    let currentClients = sessionStorage.getItem("current-client");
    if(currentClients != null)
    {

      const token = getCookie("authToken");
      const formdata = new FormData();
      formdata.append("token", token);
      formdata.append("data", currentClients);
      const request = {
        type: "POST",
        url: "export-to-pdf",
        data: formdata
      }

      try {
        const response = await ajax(request);
        const downloadRequest = {
          type: "GET",
          url: "exports/"+response.filename
        }
        const pdfFile = await ajaxDownloader(downloadRequest);
        let file = URL.createObjectURL(pdfFile);
        const a = document.createElement("a");
        a.href = file;
        a.download = response.filename;
        a.click();
        a.remove();

        await deletePdf(response.filename);
      }
      catch(error)
      {
        console.log(error);
      }
    }
    else {
      alert("client not found");
    }

  });
});

$(document).ready(function(){
// all data to pdf
  $("#all").click(async function(e){
    e.preventDefault();
    const token = getCookie("authToken");
    let companyId = decodeToken(token).data.uid;
    const clientRequest = {
      type: "GET",
      url: "clients/all/"+companyId
    }
    const response = await ajax(clientRequest);
    let allClients = JSON.stringify(response.data);

    const formdata = new FormData();
    formdata.append("token", token);
    formdata.append("data", allClients);
    const exportRequest = {
      type: "POST",
      url: "export-to-pdf",
      data: formdata
    }

    try {
      const response = await ajax(exportRequest);
      const downloadRequest = {
        type: "GET",
        url: "exports/"+response.filename
      }
      const pdfFile = await ajaxDownloader(downloadRequest);
      let file = URL.createObjectURL(pdfFile);
      const a = document.createElement("a");
      a.href = file;
      a.download = response.filename;
      a.click();
      a.remove();

      await deletePdf(response.filename);
    }
    catch(error)
    {
      console.log(error);
    }
  });
})

async function deletePdf(filename){
  const token = getCookie("authToken");
  const request = {
    type: "DELETE",
    url: "export-to-pdf/"+filename,
    data: {
      token: token
    }
  }
  await ajax(request);
}
