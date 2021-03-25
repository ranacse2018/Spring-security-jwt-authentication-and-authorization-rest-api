$(document).ready(function () {

	const result = JSON.parse(localStorage.getItem('user'));

	//for string convert to camle case word
	function toCamleCase(str) {
		return str.replace(/\w\S*/g,
			function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			}
		);
	}

	//for url change
	function change_url(url) {
		var new_url = "http://localhost:8080/api/test/" + url;
		window.history.pushState("data", "Title", new_url);
		document.title = toCamleCase(url);
	}

	function pageRefresh() {
		$(window).on('popstate', function () {
			location.reload(true);
		});
	}

	//alert( user);

	if (result) {
		//for page refresh
		/*$(window).on('popstate', function() {
		       location.reload(true);
		 });*/
		pageRefresh();
		$("#response").html("<p style='background-color:#7FA7B0; color:white; padding:20px 20px 20px 20px'>" +
			"Post Successfully! <br>" +
			" User's Info:<br> jwt = " +
			result.token + " ,<br>Id = " + result.id + " ,<br>UserName = " + result.username + ",<br>Email = " + result.email + ",<br>Roles = " + result.roles + "</p>");

		/*                 $("#btn-admin").hide();
		                 $("#btn-user").hide();
		                 $("#btn-moderator").hide();*/

		for (x in result.roles) {
			if ("ROLE_ADMIN" == result.roles[x]) {
				$("#btn-admin").show();
			}
			if ("ROLE_USER" == result.roles[x]) {
				$("#btn-user").show();
			}
			if ("ROLE_MODERATOR" == result.roles[x]) {
				$("#btn-moderator").show();
			}
		}


	}

	$("#btn-user").click(function () {

		$.ajax({
			type: 'GET',
			url: 'http://localhost:8080/api/test/user',
			beforeSend: function (request) {
				if (localStorage.getItem('user')) {
					request.setRequestHeader('Authorization', 'Bearer ' + result.token);
				}
			},

			success: function (data) {

				alert('Hello ! You have successfully accessed in user page.');
				var text = $('#head_title').text();
				$('#head_title').text("User");
				change_url("user");
				pageRefresh();
				$("#response").html("<h1 style='background-color:#7FA7B0; color:white; padding:200px 20px 200px 20px'>" + data + "</h1>");
				$("#divForm").hide();
			},
			error: function () {
				alert("Sorry, you are not logged in.");
				$("#response").html("<h1 style='background-color:#7FA7B0; color:red; padding:200px 20px 200px 20px'>" + "Unauthorized User" + "</h1>");
			}
		});

	});


	$("#btn-all").click(function () {

		$.ajax({
			type: 'GET',
			url: 'http://localhost:8080/api/test/all',
			beforeSend: function (request) {
				if (localStorage.getItem('user')) {
					request.setRequestHeader('Authorization', 'Bearer ' + result.token);
				}
			},

			success: function (data) {

				alert('Hello ! You have successfully accessed in public page.');
				var text = $('#head_title').text();
				$('#head_title').text("All User");
				change_url("all");
				pageRefresh();
				$("#response").html("<h1 style='background-color:#7FA7B0; color:white; padding:200px 20px 200px 20px'>" + data + "</h1>");
				$("#divForm").hide();
			},
			error: function () {
				alert("Sorry, you are not logged in.");
				$("#response").html("<h1 style='background-color:#7FA7B0; color:red; padding:200px 20px 200px 20px'>" + "Unauthorized User" + "</h1>");
			}
		});

	});


	$("#btn-admin").click(function () {

		var text = $('#head_title').text();
		$('#head_title').text("Admin");
		$.ajax({
			type: 'GET',
			url: 'http://localhost:8080/api/test/admin',
			beforeSend: function (request) {
				if (localStorage.getItem('user')) {
					request.setRequestHeader('Authorization', 'Bearer ' + result.token);
				}
			},

			success: function (data) {

				alert('Hello ! You have successfully accessed in admin page.');
				//var text = $('#head_title').text();
				$('#head_title').text("Admin");
				change_url("admin");
				$("#response").html("<h1 >" + data + "</h1>");
				//$("#response").html("<h1 >"+data+ "</h1>");
				$("#divForm").show();
			},
			error: function () {
				alert("Sorry, you are not logged in.");
				$("#response").html("<h1 style='background-color:#7FA7B0; color:red; padding:200px 20px 200px 20px'>" + "Unauthorized User" + "</h1>");
			}
		});

	});


	$('#addrole-form').submit(function (event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();
		// PREPARE FORM DATA
		var formData = {
			userId: $("#userId").val(),
			role: $("#role").val()
		}

		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: "/api/auth/addrole",
			data: JSON.stringify(formData),
			dataType: 'json',
			success: function (res) {
				alert("test");

				if (res.status == "Role rigistered successfully") {
					$("#roleInfo").html("<h1 style='color:green; '>" + res.status + "</h1>");
				} else if (res.status == "This role is already taken") {
					$("#roleInfo").html("<h1 style='color:red; '>" + res.status + "</h1>");

				} else {
					$("#roleInfo").html("<h1 style=' color:red; '>" + "Unauthorized User" + "</h1>");
				}
			},
			error: function (res) {
				//alert("Login Failed");
				alert(res);
			}
		});


	});


	$("#btn-moderator").click(function () {

		var text = $('#head_title').text();
		$('#head_title').text("Moderator");
		$.ajax({
			type: 'GET',
			url: 'http://localhost:8080/api/test/mod',
			beforeSend: function (request) {
				if (localStorage.getItem('user')) {
					request.setRequestHeader('Authorization', 'Bearer ' + result.token);
				}
			},

			success: function (data) {

				alert('Hello ! You have successfully accessed in moderator page.');
				//var text = $('#head_title').text();
				$('#head_title').text("Moderator");
				change_url("mod");
				pageRefresh();

				$("#response").html("<h1 style='background-color:#7FA7B0; color:white; padding:200px 20px 200px 20px'>" + data + "</h1>");
				$("#divForm").hide();
			},
			error: function () {
				alert("Sorry, you are not logged in.");
				$("#response").html("<h1 style='background-color:#7FA7B0; color:red; padding:200px 20px 200px 20px'>" + "Unauthorized User" + "</h1>");
			}
		});

	});


	$('#btn-logout').click(function () {
		localStorage.clear();
		window.location.replace('http://localhost:8080/login?logout');
	});

});