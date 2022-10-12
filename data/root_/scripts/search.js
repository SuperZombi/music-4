main()

window.onresize = function(){ overflowed() }
window.orientationchange = function(){ overflowed() }
window.onscroll = function(){showScrollTop()}

function empty(){
	return `
		<h2 class="empty">
			${LANG.nothing_found} <br>
			¯\\_(ツ)_/¯
		</h2>`
}

function check_enter(e) {
	if (e.key === 'Enter' || e.keyCode === 13) {
		start_search()
	}
	else{
		let text = document.getElementById("search_label").value;
		if (text == ""){
			search_current = '';
			update_url()
			document.getElementById('search_results').innerHTML = "";
		}
	}
}

function update_url(){
	let temp_url = new URL(window.location.href);
	if (search_current == ""){ temp_url.search = "" }
	else{
		temp_url.searchParams.set('find', search_current)
	}
	temp_url.searchParams.set('type', type_current)
	window.history.pushState({path:temp_url.href},'',temp_url.href);
}

function changeType(){
	let type = document.querySelector("input[name=search_type]:checked").value;
	type_current = type;
	update_url()
}

var search_current = '';
var type_current = '';
var type_old = '';
function start_search(){
	let text = document.getElementById("search_label").value.trim();
	let type = document.querySelector("input[name=search_type]:checked").value
	if (text != ""){
		if (search_current != text || type_old != type){
			document.getElementById('search_results').innerHTML = "";
			let xhr = new XMLHttpRequest();
			xhr.open("POST", 'api/search')
			xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			xhr.onload = async function() {
				if (xhr.status == 200){
					search_current = text;
					type_current = type;
					type_old = type;
					update_url();
					let answer = JSON.parse(xhr.response);
					if (answer.length > 0){
						if (type == "genre"){
							let genres = sortByGenre(answer);
							Object.keys(genres).forEach(async function(e){
								await addNewCategory(genres[e], type, e)
								overflowed()
							})
						}
						else{
							await addNewCategory(answer, type)
							overflowed()
						}
					}
					else{
						document.getElementById('search_results').innerHTML = empty();
					}
				}
			}
			xhr.send(JSON.stringify({'text': text, 'type': type}))
		}
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
function showScrollTop(){
	if (window.scrollY > 200){
		document.getElementById("toTop").style.bottom = "10px"
	}
	else{
		document.getElementById("toTop").style.bottom = "-50%"
	}
}

async function addNewCategory(tracks, type, category_title){
	await new Promise((resolve, reject) => {
		var html = ""
		if (type == "track" || type == "genre"){
			tracks.forEach(function(e){
				let img = document.createElement('img');
				img.className = "loader"
				img.src = `${e.path.join("/")}/${e.image}?size=small`
				img.alt = "";
				img.onload = ()=>img.classList.remove("loader");
				html += `
					<a href="${e.path.join("/")}" class="about_box">
						${img.outerHTML}
						<div class="track_name"><span>${e.track}</span></div>
						<div class="artist">${e.artist}</div>
					</a>
				`
			})
		}
		else if (type == "user"){
			tracks.forEach(function(e){
				let img = document.createElement('img');
				img.className = "loader"
				img.src = `${e.image}?size=small`
				img.alt = "";
				img.onload = ()=>img.classList.remove("loader");
				html += `
					<a href="${e.path}" class="about_box">
						${img.outerHTML}
						<div class="track_name"><span>${e.user}</span></div>
					</a>
				`
			})
		}

		if (type == "genre"){
			document.getElementById("search_results").innerHTML += `
				<div class="category flexable">
					<div class="category_title">${category_title}</div>
					<div class="category_body">
						${html}
					</div>
				</div>
			`;
		}
		else {
			document.getElementById("search_results").innerHTML += `
				<div class="category flexable">
					<div class="category_body">
						${html}
					</div>
				</div>
			`;
		}
		resolve()
	});
}

function sortByGenre(tracks){
	var genres = {};
	Object.keys(tracks).forEach(function(e){
		let temp_genr = toTitleCase(tracks[e].genre);
		if (!genres.hasOwnProperty(temp_genr)){
			genres[temp_genr] = [];
		}
		genres[temp_genr].push(tracks[e]);
	})
	return genres
}
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}


function main(){
	document.title = `Zombi Music - ${LANG.search_title}`
	const urlSearchParams = new URLSearchParams(window.location.search);
	searchParams = Object.fromEntries(urlSearchParams.entries());
	if (searchParams.find){
		document.getElementById("search_label").value = searchParams.find
	}
	if (searchParams.type){
		let inputs = document.querySelectorAll("input[name=search_type]")
		let input = Array.from(inputs).filter(i=>i.value==searchParams.type)[0]
		try{input.checked = true;}catch{}
	}

	if (searchParams.find && searchParams.type){ start_search() }
}