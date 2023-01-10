main()

window.onresize = function(){ overflowed() }
window.orientationchange = function(){ overflowed() }
window.onscroll = function(){showScrollTop()}
function showScrollTop(){
	if (window.scrollY > 200){
		document.getElementById("toTop").style.bottom = "10px"
	}
	else{
		document.getElementById("toTop").style.bottom = "-50%"
	}
}

async function main(){
	document.title = `${LANG.favorites_title} - Zombi Music`
	local_storage = { ...localStorage };
	if (local_storage.userName && local_storage.userPassword){
		notice = Notification('#notifications');
		document.body.onclick = event => checkHideMenu(event)

		if (document.getElementById('myAccount').getElementsByTagName('img')[0].src.split('.').pop() == "svg"){
			try_dark(document.getElementById('myAccount').getElementsByTagName('img')[0])
		}

		let xhr = new XMLHttpRequest();
		xhr.open("POST", '../api/get_favorites', false)
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify({'user': local_storage.userName,
								 'password': local_storage.userPassword}))
		if (xhr.status != 200){ notice.Error(LANG.error) }
		else{
			let answer = JSON.parse(xhr.response);
			if (answer.successfully){
				if (Object.keys(answer.favorites).length == 0){
					document.getElementById("empty").innerHTML = empty();
				}
				else{
					await addNewCategory(answer.favorites.reverse())
					overflowed()
				}
			}
		}
	}
	else{
		goToLogin()
	}
}

function get_decode_error(code){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", '../api/decode_error', false)
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({'code': code, 'lang': localStorage.getItem('lang')}))
	if (xhr.status != 200){ return code }
	else{
		let answer = JSON.parse(xhr.response)
		if (!answer.successfully){ return code }
		else{ return answer.value }			
	}
}

function empty(){
	return `
		<h2 class="empty">
			${LANG.nothing_here} <br>
			¯\\_(ツ)_/¯
		</h2>`
}
function goToLogin(){
	let url = window.location.pathname;
	let filename = url.substring(url.lastIndexOf('/')+1);
	if (filename == ""){
		filename = url.split("/").filter(x => x).at(-1)
	}

	let login = new URL("login", window.location.href);
	login.searchParams.append('redirect', filename);

	window.location.href = decodeURIComponent(login.href)
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
		var div = document.createElement('div')
		div.className = "category flexable"
		var subdiv = document.createElement('div')
		subdiv.className = "category_body"
		tracks.forEach(function(e){
			if (e.path[0] == "/" || e.path[0] == "\\"){
				e.path = e.path.slice(1)
			}
			if (e.status == "deleted"){
				e.artist = ""
				e.img = "/root_/images/dead.svg"
			}
			var a = document.createElement('a');
			a.className = "about_box";
			a.onclick = ()=>show(e.track, e.artist, e.path.join("/"), a);
			a.onmousedown = (event) => {if (event.button === 1) {
				window.open("/" + e.path.join("/"),'_blank');
			}}

			let img = document.createElement('img');
			img.className = "loader"
			img.alt = ""
			if (e.status == "deleted"){
				img.classList.add("deleted")
				img.src = e.img
			}
			else{
				img.src = `/${e.path.join("/")}/${e.image}?size=small`
				img.onload = ()=>img.classList.remove("loader");				
			}

			a.innerHTML = `
				${img.outerHTML}
				<div class="track_name"><span>${e.track}</span></div>
				<div class="artist">${e.artist}</div>
			`
			subdiv.appendChild(a)
		})
		div.appendChild(subdiv)
		document.getElementById("main_page").appendChild(div)
		resolve()
	});
}


current_show_track = ""
current_show_user = ""
current_show_path = ""
current_show_obj = ""
var timout_menu;
function show(track, user, path, obj){
	if (timout_menu) {
		clearTimeout(timout_menu);
	}
	notice.clearAll()
	current_show_track = track
	current_show_user = user
	current_show_path = path
	current_show_obj = obj
	document.getElementById("card_previewer_name_txt").innerHTML = track;
	document.getElementById("card_previewer_user_txt").innerHTML = user;
	pr = document.getElementById("card_previewer").style
	pr.display = "flex"
	pr_name = document.getElementById("card_previewer_name")
	pr_name.style.display = "block"
	document.getElementById("extra_space").style.height = "100px"
	timout_menu = setTimeout(function(){
		pr.transform = "translateY(0)"
		pr_name.style.transform = "translateY(0)"
	}, 0)
}
function hide(){
	if (timout_menu) {
		clearTimeout(timout_menu);
	}
	pr = document.getElementById("card_previewer").style
	pr_name = document.getElementById("card_previewer_name")
	
	pr_name.style.transform = ""
	document.getElementById("extra_space").style.height = "0px"
	setTimeout(function(){pr.transform = ""}, 100)
	timout_menu = setTimeout(function(){
		pr.display = "none"
		pr_name.style.display = "none"
	}, 400)
}

function checkHideMenu(event){
	let path = event.path || (event.composedPath && event.composedPath());
	for (let i=0; i<path.length;i++){
		if (path[i] == document.getElementById("card_previewer")){
			return
		}
		if (path[i] == document.getElementById("card_previewer_name")){
			return
		}
		if (path[i].className == "about_box"){
			return
		}
		if (path[i] == document.getElementById("header")){
			return
		}
		if (path[i] == document.getElementById("notifications")){
			return
		}
	}
	hide()
}


function open_(){
	window.open("/" + current_show_path,'_blank'); }
function copyToClipboard(text) {
	const elem = document.createElement('textarea');
	elem.value = text;
	document.body.appendChild(elem);
	elem.select();
	document.execCommand('copy');
	document.body.removeChild(elem);
}
function share(){
	let url = new URL("/" + current_show_path, window.location.href)
	copyToClipboard(decodeURI(url.href))
	notice.Success(LANG.copied, 3000)
}

function confirm_delete(){
	notice.clearAll()
	let delete_text = LANG.delete_from_favorites.replace("%", 
		`<a style="color:red">${current_show_track}</a>`
		)
	notice.Error(delete_text, false, [[LANG.yes, delete_], LANG.no])
}
function delete_(){
	if (local_storage.userName && local_storage.userPassword){
		let xhr = new XMLHttpRequest();
		xhr.open("POST", `../api/like`, false)
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify({
			'user': local_storage.userName,
			'password': local_storage.userPassword,
			"url": current_show_path + "/"
		}))
		if (xhr.status != 200){ notice.Error(LANG.error) }
		else{
			let answer = JSON.parse(xhr.response);
			if (!answer.successfully){ notice.Error(LANG.error) }
			else {
				if (answer.event == "unliked"){
					notice.Success("OK")
					hide()
					if (current_show_obj.getElementsByTagName("img")[0].classList.contains("deleted")){
						current_show_obj.remove()
					}
					else{
						current_show_obj.setAttribute('data-href', "/" + current_show_path)
						current_show_obj.onclick = (e)=>{
							for (let i=0; i<e.path.length;i++){
								if (e.path[i].classList.contains("about_box")){
									window.open(e.path[i].getAttribute('data-href'),'_blank');
									return
								}
							}
						}
						current_show_obj.classList.add("noHover")					
					}
				}
				else{
					notice.Error(LANG.error)
				}
			}
		}
	}
}