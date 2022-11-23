let userName = localStorage.getItem('userName')
if (userName){
	loadProfileImage(userName)
}

function loadProfileImage(user){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", '/api/get_profile_photo')
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.onload = function() {
		if (xhr.status == 200){ 
			let answer = JSON.parse(xhr.response);
			if (answer.successfully){
				if (answer.image.split('.').pop() != "svg"){
					let img = document.querySelector("#myAccount img");
					if (img){
						img.src = "";
					}
					else{
						let svg = document.querySelector("#myAccount svg")
						svg.outerHTML = "<img>"
						img = document.querySelector("#myAccount img")
					}
					img.className = "loader";
					var image_href = new URL("/" + answer.image + "?size=small", window.location.href).href
					img.src = image_href;
					img.onload = ()=>{
						img.classList.remove("loader")
					};	
				}
			}
		}
	}
	xhr.send(JSON.stringify({'artist': user}))
}