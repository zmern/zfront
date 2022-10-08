if(document.cookie.indexOf("authToken") != -1)
{
	window.location = "clients";
}

// handle modal
$(document).ready(()=>{
	// requesting login modal
	$(".request-login-modal").click((e)=>{
		e.preventDefault();
		closeOpenModal();
	});

	// requesting signup modal
	$(".request-signup-modal").click((e)=>{
		e.preventDefault();
		closeOpenModal();
	});

});

const closeOpenModal = ()=>{
	$("#signup-modal").modal("toggle");
	$("#login-modal").modal("toggle");
}

// http signup request
$(document).ready(()=>{

	$("#signup-form").submit((e)=>{
		e.preventDefault();
		$.ajax({
			type: "POST",
			url: "api/signup",
			data: new FormData(e.target),
			contentType: false,
			processData: false,
			beforeSend: ()=>{
				$(".signup-btn").addClass("d-none");
				$(".signup-before-send").removeClass("d-none");
			},
			success: (response)=>{
				$(".signup-before-send").addClass("d-none");
				$(".signup-btn").removeClass("d-none");
				if(response.isUserCreated)
				{
					window.location = "clients"
				}
			},
			error: (errorRes)=>{
				$(".signup-before-send").addClass("d-none");
				$(".signup-btn").removeClass("d-none");
				if(errorRes.status == 409)
				{

					const error = errorRes.responseJSON.message;
					const field = "."+error.field;
					const label = error.label;

					$(field).addClass("border-danger");
					$(field+"-error").html(label);
					setTimeout(()=>{
						$(field).removeClass("border-danger");
						$(field+"-error").html("");
					}, 3000);
				}
				else {
					alert("internal server error");
				}

			}
		})
	})

});

// enable and disable login button
$(document).ready(function(){
	$(".login-as").each(function(){
		$(this).on("change", function(){
			$(".login-btn").attr("disabled", false);
		})
	})
})

// login http request
$(document).ready(()=>{
	$("#login-form").submit((e)=>{
		e.preventDefault();
		$.ajax({
			type: "POST",
			url: "api/login",
			data: new FormData(e.target),
			processData: false,
			contentType: false,
			beforeSend: ()=>{
				$(".login-btn").addClass("d-none");
				$(".login-before-send").removeClass("d-none");
			},
			success: (response)=>{
				$(".login-btn").removeClass("d-none");
				$(".login-before-send").addClass("d-none");
				if(response.isLogged)
				{
					if(response.role == "admin")
					{
						window.location = "clients";
					}
					else if(response.role == "client"){
						window.location = "business";
					}
					else{
						// teams
					}

				}
			},
			error: (errorRes)=>{
				$(".login-btn").removeClass("d-none");
				$(".login-before-send").addClass("d-none");
				if(errorRes.status == 404)
				{
					$(".login-email").addClass("border-danger");
					$(".login-email-error").html("Company not found !");
					setTimeout(()=>{
						$(".login-email").removeClass("border-danger");
						$(".login-email-error").html("");
					}, 3000);
				}
				else if(errorRes.status == 401)
				{
					$(".login-password").addClass("border-danger");
					$(".login-password-error").html("Wrong password !");
					setTimeout(()=>{
						$(".login-password").removeClass("border-danger");
						$(".login-password-error").html("");
					}, 3000);
				}
				else if(errorRes.status == 406)
				{
					$(".other-message").html(errorRes.responseJSON.message);
					setTimeout(()=>{
						$(".other-message").html("");
					}, 3000);
				}
				else {
					// alert("internal server error");
				}
			}
		})
	})
});
