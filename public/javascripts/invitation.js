$(document).ready(function(){
  const inv = getInvitaion();
  console.log(inv)
  $(".logo").attr("src", inv.logo);
  $(".company-name").html(inv.companyName)
  $(".email").html(inv.email)
});

function getInvitaion(){
  let url = window.location.pathname;
  let array = url.split("/");
  let token = array[array.length-1];
  const inv = decodeToken(token);
  inv.data["token"] = token;
  return inv.data;
}

$(document).ready(function(){
  $("form").submit(async function(e){
    e.preventDefault();
    const inv = getInvitaion();
    const token = getCookie("authToken");
    const formData = new FormData(this);
    formData.append("token", inv.token);
    const request = {
      type: "POST",
      url: "/clients/"+inv.clientId,
      data: formData
    }
    await ajax(request);
    window.location = "/";

  })
})
