$(document).ready(function () {

	$('#registration-form').submit(function (event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();
		// PREPARE FORM DATA
		var formData = {
			username: $("#username").val(),
			password: $("#password").val(),
			email: $("#email").val()
		}

		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: "api/auth/signup",
			data: JSON.stringify(formData),
			dataType: 'json',
			success: function (result) {
				//localStorage.setItem("user",  JSON.stringify(result));
				alert("Registration is successful");
				$("#response").html("<h1 style='background-color:#7FA7B0; color:green; padding:20px 20px 20px 20px'>Registration is Successful.</h1>");
				//console.log(result);

               //window.location.href = "http://localhost:8080/api/auth/profile";
              // window.location.reload("http://localhost:8080/api/test/all");
			},
			error: function () {
				alert("Registration Failed");
				$("#response").html("<h1 style='background-color:#7FA7B0; color:red; padding:20px 20px 20px 20px'>Registration is not Successful.</h1>");
				//window.location.reload('http://localhost:8080/login?error');
				//window.location.href = "http://localhost:8080/login?error";
			}
		});


	});


});