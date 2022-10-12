main()

function main(){
	const params = new URLSearchParams(window.location.search);
	const array = Object.fromEntries(params);
	if (array.link){
		document.getElementById("link").innerHTML = array.link;
		document.querySelector("#redirect .buttons .main").href = array.link;
	}
	else{
		window.location.href = "/";
	}
}

function back(){
	if (document.referrer) {
		window.location.href = document.referrer
	}
	else {
		window.location.href = "/";
	}
}