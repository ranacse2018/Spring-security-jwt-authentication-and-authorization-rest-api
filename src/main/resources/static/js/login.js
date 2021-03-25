$(document).ready(function () {

	$('#login-form').submit(function (event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();
		// PREPARE FORM DATA
		var formData = {
			username: $("#username").val(),
			password: $("#password").val()
		}

		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: "api/auth/signin",
			data: JSON.stringify(formData),
			dataType: 'json',
			success: function (result) {
				localStorage.setItem("user",  JSON.stringify(result));
				alert('Got a token from the server! Token: ' + result.token);
				console.log(result);

               window.location.href = "http://localhost:8080/api/auth/profile";
              // window.location.reload("http://localhost:8080/api/test/all");
			},
			error: function () {
				alert("Login Failed");
				//window.location.reload('http://localhost:8080/login?error');
				window.location.href = "http://localhost:8080/login?error";
			}
		});


	});


});

