main()

window.onresize = function(){ overflowed() }
window.orientationchange = function(){ overflowed() }
window.onscroll = function(){showScrollTop()}

function darking_images(){
	if (document.getElementById('artist_image').src.split('.').pop() == "svg"){
		try_dark(document.getElementById('artist_image'))
	}
}

var ARTIST;
async function main(){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", `/api/get_user_from_path`)
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.onload = async function() {
		if (xhr.status == 200){
			let answer = JSON.parse(xhr.response);
			if (answer.successfully){
				ARTIST = answer.user
				document.title = ARTIST
				document.getElementById("artist_name").innerHTML = ARTIST
				loadProfileImage()
				submain()
			}
		}
	}
	xhr.send(JSON.stringify({
		'path': window.location.pathname.slice(1, -1)
	}))
}

function loadProfileImage(){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", '/api/get_profile_photo')
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.onload = function() {
		if (xhr.status == 200){ 
			let answer = JSON.parse(xhr.response);
			if (answer.successfully){
				let img = document.getElementById("artist_image");
				img.src = "";
				img.className = "loader";
				var image_href = new URL("/" + answer.image, window.location.href).href
				img.src = image_href;
				img.onload = ()=>{
					img.classList.remove("loader")
				};
				if (image_href.split('.').pop() == "svg"){
					try_dark(img)
				}
			}
		}
	}
	xhr.send(JSON.stringify({'artist': ARTIST}))
}

async function submain(){
	loadArtistProfileData()
	initTabs()

	let loc_seach = window.location.search.replace("?", "");
	if (loc_seach){ document.querySelector(`.tabs > li[data=${loc_seach}]`).scrollIntoView(); }
	if (loc_seach && loc_seach != "all-tracks"){
		changeTab(document.querySelector(`.tabs > li[data=${loc_seach}]`), true)
	}

	let xhr = new XMLHttpRequest();
	xhr.open("POST", `../api/get_tracks`)
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.onload = async function() {
		if (xhr.status == 200){
			let answer = JSON.parse(xhr.response);
			if (answer.successfully){
				if (answer.tracks.length != 0){
					await addNewCategory(answer.tracks)
					await overflowed()
				}
				else{document.getElementById("main_page").innerHTML = empty();}

				await addFavorites()
				if (loc_seach && loc_seach == "all-tracks"){
					changeTab(document.querySelector(`.tabs > li[data=${loc_seach}]`), true)
				}
			}
		}
	}

	let args = {
		"sort_method": localStorage.getItem("sort_method")
	};
	let asArray = Object.entries(args);
	let filtered = asArray.filter(([key, value]) => value);
	let args_filtered = Object.fromEntries(filtered);

	xhr.send(JSON.stringify({
		'user': ARTIST,
		...args_filtered
	}))
}


function showScrollTop(){
	if (window.scrollY > 200){
		document.getElementById("toTop").style.bottom = "10px"
	}
	else{
		document.getElementById("toTop").style.bottom = "-50%"
	}
}
function overflowed() {
	var arr = document.getElementsByClassName('track_name')
	Object.keys(arr).forEach(function(e){
		if (arr[e].scrollWidth>arr[e].offsetWidth){
			arr[e].getElementsByTagName('span')[0].className = "marquee"
		}
		else{
			if (arr[e].getElementsByTagName('span')[0].className){
				arr[e].getElementsByTagName('span')[0].className = ""
			}
		}
	})
}
async function addNewCategory(tracks){
	await new Promise((resolve, reject) => {
		var html = ""
		tracks.forEach(function(e){
			let img = document.createElement('img');
			img.className = "loader"
			img.alt = ""
			img.src = `../${e.path.join("/")}/${e.image}?size=small`
			img.onload = ()=>img.classList.remove("loader");
			html += `
				<a href="../${e.path.join("/")}" class="about_box">
					${img.outerHTML}
					<div class="track_name"><span>${e.track}</span></div>
				</a>
			`
		})
		document.getElementById("main_page").innerHTML += `
			<div class="category">
				<div class="category_body">
					${html}
				</div>
			</div>
		`;
		resolve()
	});
}


function loadArtistProfileData(){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", `../api/get_user_profile_public`)
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.onload = function() {
		if (xhr.status == 200){
			let answer = JSON.parse(xhr.response);
			if (answer.successfully){
				if (answer.advantages){
					if (answer.advantages.official){
						document.getElementById("official_checkmark").style.display = "inline-block";
					}
					if (answer.advantages.premium){
						document.getElementById("crown").style.display = "inline-block";
					}
				}
				if (!answer.public_fields){
					document.getElementById("about").getElementsByTagName("table")[0].style.display = "none";
					if (!answer.social){
						document.getElementById("about").innerHTML = empty();
					}
				}
				else{
					buildAbout(answer.public_fields)
				}
				if (answer.social){
					buildSocial(answer.social)
				}
			}
		}
	}
	xhr.send(JSON.stringify({
		'user': ARTIST
	}))
}
function checkmark_hovered(e){
	e.classList.remove("checkmark__animation")
	setTimeout(function(){
		e.classList.add("checkmark__animation")
	}, 100)
}

function empty(){
	return `
		<h2 class="empty">
			${LANG.nothing_here} <br>
			¯\\_(ツ)_/¯
		</h2>`
}

function buildAbout(arr){
	Object.keys(arr).forEach(function(e){
		let tr = document.createElement("tr");
		let td1 = document.createElement("td");
		let td2 = document.createElement("td");
		tr.appendChild(td1);
		tr.appendChild(td2);
		document.getElementById("about").getElementsByTagName("table")[0].appendChild(tr);

		try{td1.innerHTML = LANG[e];}catch{td1.innerHTML = e;}
		td2.innerHTML = arr[e];

		if (e == "email"){
			td1.insertAdjacentHTML("afterbegin", '<i class="fa-solid fa-envelope"></i>')
			td2.innerHTML = `<a href="mailto:${arr[e]}">${arr[e]}</a>`
		}
		else if (e == "gender"){
			td1.insertAdjacentHTML("afterbegin", '<i class="fa-solid fa-person"></i>')
			try{td2.title = LANG[arr[e]];}catch{td2.title = arr[e];}
			if (arr[e] == "man"){
				td2.innerHTML = '<i style="color:#00c0ff" class="fa-solid fa-mars"></i>'
			}
			else if (arr[e] == "woman"){
				td2.innerHTML = '<i style="color:#f766ad" class="fa-solid fa-venus"></i>'
			}
		}
		else if (e == "phone"){
			td1.insertAdjacentHTML("afterbegin", '<i class="fa-solid fa-phone"></i>')
			td2.innerHTML = `<a href="tel:${arr[e]}">${arr[e]}</a>`
		}
	})
}

var trusted_sites = ["youtube.com", "music.youtube.com", "youtu.be", "instagram.com", "open.spotify.com",
					"discord.com", "t.me", "soundcloud.com", "twitter.com", "facebook.com", "vk.com",
					"github.com", "newgrounds.com"];
function getSecureLink(link){
	if (JSON.parse(localStorage.getItem("secure-links")) == false){
		return link
	}
	else{
		try{
			let url = new URL(link);
			if (url.protocol == "https:"){
				if (trusted_sites.includes(url.hostname.replace("www.", ""))){
					return link
				}
			}
		}catch{}
		return `/redirect?link=${link}`
	}
}
function buildSocial(arr){
	let parrent = document.getElementById("about");
	let area = document.createElement("div");
	area.className = "social_area"
	arr.forEach(function(e){
		let a = document.createElement("a")
		a.className = "social_link"
		a.href = getSecureLink(e); a.target = "_blank"
		a.innerHTML = `
			<img src="https://www.google.com/s2/favicons?domain=${e}&sz=256">
		`
		area.appendChild(a)
	})
	parrent.appendChild(area)
}

function changeTab(element, no_animete=false){
	let old_elem = document.querySelector(".tabs > li.active")
	if (old_elem == element){return}

	if (no_animete){
		old_elem.classList.add("no-animation")
		element.classList.add("no-animation")
		old_elem.classList.remove("active");
		element.classList.add("active");
		animate(old_elem, element, 0);
		setTimeout(function(){
			old_elem.classList.remove("no-animation")
			element.classList.remove("no-animation")
		},0)
		if (element.getAttribute("data")=="all-tracks"){
			document.getElementById("main_page").querySelector(".category").classList.add("flexable")
			try{document.getElementById("favorite-details").style.display = "none"}catch{}
		}
		return;
	}

	old_elem.classList.remove("active")
	element.classList.add("active")

	function animate(from, to, time=350){
		let to_change = {"main": "#main_page", "all-tracks": "#main_page", "about": "#about"}
		let old = document.querySelector(to_change[from.getAttribute("data")])
		let new_ = document.querySelector(to_change[to.getAttribute("data")])
		if (old != new_){
			old.style.opacity = 0;
			new_.style.display = "block";
			setTimeout(function(){
				old.style.display = "none";
				new_.style.opacity = 1;
			},time)
		}
	}
	animate(old_elem, element)

	let data = element.getAttribute("data")

	let temp_url = new URL(window.location.href);
	if (data == "main"){ temp_url.search = "" }
	else{ temp_url.search = data }

	window.history.pushState({path:temp_url.href},'',temp_url.href);

	try{document.getElementById("favorite-details").style.display = "none"}catch{}

	if (data=="main"){
		document.getElementById("main_page").querySelector(".category").classList.remove("flexable")
		try{document.getElementById("favorite-details").style.display = "block"}catch{}
	}
	if (data=="all-tracks"){
		document.getElementById("main_page").querySelector(".category").classList.add("flexable")
	}
}
function initTabs(){
	Array.from(document.querySelectorAll(".tabs > li")).forEach(el=>{
		el.onclick = ()=>changeTab(el);
	})
}


async function addFavorites(){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", '../api/get_favorites', false)
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({'user': ARTIST}))
	if (xhr.status == 200){ 
		let answer = JSON.parse(xhr.response);
		if (answer.successfully){
			if (Object.keys(answer.favorites).length == 0){}
			else{
				await addNewCategoryFavs(answer.favorites.reverse())
				overflowed()

				let script = document.createElement('script')
				script.src = "../root_/scripts/details-animated.js"
				script.onload = () => {
					new Accordion(document.getElementById("favorite-details"));
				}
				document.head.appendChild(script)
			}
		}
	}
}
async function addNewCategoryFavs(tracks){
	await new Promise((resolve, reject) => {
		tracks = tracks.filter(x => x.status != 'deleted')
		var div = document.createElement('div')
		div.className = "category"
		var subdiv = document.createElement('div')
		subdiv.className = "content category_body"
		tracks.forEach(function(e){
			if (e.path[0] == "/" || e.path[0] == "\\"){
				e.path = e.path.slice(1)
			}
			var a = document.createElement('a');
			a.className = "about_box";
			a.href = `/${e.path.join("/")}`;
			let img = document.createElement('img');
			img.className = "loader"
			img.alt = ""
			img.src = `/${e.path.join("/")}/${e.image}?size=small`
			img.onload = ()=>img.classList.remove("loader");

			a.innerHTML = `
				${img.outerHTML}
				<div class="track_name"><span>${e.track}</span></div>
				<div class="artist">${e.artist}</div>
			`
			subdiv.appendChild(a)
		})
		let detail = document.createElement('details')
		detail.id = "favorite-details"
		let sum_ = document.createElement('summary')
		sum_.innerHTML = LANG.favorites_title
		sum_.className = "category_title"
		sum_.style.cursor = "pointer"
		detail.appendChild(sum_)
		detail.appendChild(subdiv)
		div.appendChild(detail)
		document.getElementById("main_page").appendChild(div)
		if(document.getElementById("main_page").querySelector(".category").classList.contains("flexable")){
			detail.style.display = "none"
		}
		resolve()
	});
}