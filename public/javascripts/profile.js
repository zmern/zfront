// load access
$(document).ready(async function(){
	const request = {
		type: "GET",
		url: "/access"
	}

	const response = await ajax(request);
	showToolbar(response.data.toolbar);
});

function showToolbar(toolbar){
	console.log(toolbar)
	for(let menu of toolbar)
	{
		let li = `
			<li class="nav-item">
				<button class="btn toolbar p-0 ms-3 ${menu.design}">
					<a class="nav-link ${menu.design}" href=${menu.link}>
						<i class="${menu.icon}"></i>
					</a>
				</button>
			</li>
		`;
		$("#toolbar").append(li);
	}
}

// control sidenav and section
$(document).ready(()=>{
	$(".toggler").click(()=>{
		const state = $(".sidenav").hasClass("sidenav-open");
		if(state)
		{
			$(".sidenav").removeClass("sidenav-open");
			$(".sidenav").addClass("sidenav-close");

			// section control
			$(".section").removeClass("section-open");
			$(".section").addClass("section-close");
		}
		else {
			$(".sidenav").removeClass("sidenav-close");
			$(".sidenav").addClass("sidenav-open");

			// section control
			$(".section").removeClass("section-close");
			$(".section").addClass("section-open")
		}
	})
})


// show company info
$(document).ready(function(){
	const token = getCookie("authToken");
	let company = decodeToken(token).data.companyInfo;
	$(".company-name").html(company.company_name);
	$(".company-email").html(company.email);
	$(".company-mobile").html(company.mobile);
	if(company.isLogo)
	{
		$(".logo-box").html("");
		$(".logo-box").css({background: `url(${company.logoUrl})`, backgroundSize: "cover"})
	}
})

// upload logo
$(document).ready(function(){
	$(".logo-box").click(function(){
		const ext = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
			"image/webp"
		]
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.click();

		input.onchange = async function()
		{
			const file = input.files[0];
			const imageUrl = URL.createObjectURL(file);
			if(ext.indexOf(file.type) != -1)
			{
				// show uploader
				$(".file-name").html(file.name);
				$(".uploader").addClass("animate__animated animate__fadeInTopLeft");
				$(".uploader").toast("show");
				let objectUrl = await uploadFileOnS3(file);
				$(".logo-box").html("Wait...");
				const isUpdated = await updateLogoUrl(objectUrl);
				if(isUpdated)
				{
					$(".logo-box").html("");
					$(".logo-box").css({
						background: `url(${imageUrl})`,
						backgroundSize: "cover"
					})
				}
				else {
					alert("unable upload logo please try again");
				}
			}
			else {
				alert("upload a valid file")
			}
		}
	});
});

async function updateLogoUrl(objectUrl) {
	const token = getCookie("authToken");
	const company = decodeToken(token);
	let id = company.data.uid;
	const formData = new FormData();
	formData.append("isLogo", true);
	formData.append("logoUrl", objectUrl);
	formData.append("token", token);

	const request = {
		type: "PUT",
		url: "api/private/company/"+id,
		data: formData
	}

	try {
		await ajax(request);
		return true;
	}
	catch(error)
	{
		return false;
	}

}
