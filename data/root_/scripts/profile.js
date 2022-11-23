var tabController = new tabSwitherController();
function tabSwitherController(){
	this.alreadyWasOpened = [];
	this.eventHandler = {};
	this.onFirstTimeOpen = function(tab, func){
		this.eventHandler[tab] = func
	}
	this.openedTab = function(tab){
		let element = (tab == "settings") ? "#settings_area" : ".tab-content.active";
		main_content = document.querySelector(element)
		main_content.onscroll = function(){showScrollTop()}
		showScrollTop()

		if (!this.alreadyWasOpened.includes(tab)){
			this.alreadyWasOpened.push(tab)
			if (tab in this.eventHandler){
				this.eventHandler[tab]()
			}
		}
	}
}

main()

window.onresize = function(){ overflowed() }
window.orientationchange = function(){ overflowed() }

function darking_images(){
	if (document.getElementById('artist_image').src.split('.').pop() == "svg"){
		try_dark(document.getElementById('artist_image'))
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
function loader(){
	return `
	<svg xmlns="http://www.w3.org/2000/svg" style="display:block;margin:auto;" width="80px" height="80px" viewBox="0 0 100 100">
		<circle cx="50" cy="50" fill="none" stroke="#007EFF" stroke-width="10" r="35" stroke-dasharray="165 57">
			<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
		</circle>
	</svg>`
}

function logout(){
	window.localStorage.removeItem("userName")
	window.localStorage.removeItem("userPassword")
	goToLogin()
}
function goToLogin(){
	let url = window.location.pathname;
	let filename = url.substring(url.lastIndexOf('/')+1);
	if (filename == ""){
		filename = "../" + url.split("/").filter(x => x).at(-1)
	}

	let login = new URL("login", window.location.href);
	login.searchParams.append('redirect', filename);

	window.location.href = decodeURIComponent(login.href)
}

function scrollToTop(){
	main_content.scrollTo(0,0);
}

var main_content;
function main(){
	document.title = `${LANG.profile_title} - Zombi Music`
	document.getElementById('header').innerHTML += `
		<div id="menu_but" title="${LANG.menu}" class="menu_but_wraper hide_on_desktop" onclick="open_menu()"><div class="menu_but"><div></div></div></div>
	`
	
	local_storage = { ...localStorage };
	if (local_storage.userName && local_storage.userPassword){
		let a = document.createElement('a')
		a.title = LANG.open_profile;
		a.innerHTML = local_storage.userName;
		document.getElementById("user-name").appendChild(a);

		notice = Notification('#notifications');
		document.querySelector("#notifications").classList.add("notifications_top")
		document.querySelector(".logout > #logout-icon").style.display = "block"
		document.querySelector(".logout > #logout-icon").onclick = logout

		main_content = document.getElementById("page-content")
		main_content.onscroll = function(){showScrollTop()}

		submain()
	}
	else{
		document.getElementById("dont-redirected").style.display = "block"
		goToLogin()
	}

	document.querySelectorAll('details').forEach((el) => {
		new Accordion(el);
	});

	document.body.onclick = event => checkHideMenu(event)

	if (document.getElementById('artist_image').src.split('.').pop() == "svg"){
		try_dark(document.getElementById('artist_image'))
	}
	var tmp_ = document.getElementById("new-release")
	if (tmp_){
		tmp_2 = tmp_.getElementsByTagName("img")
		Object.keys(tmp_2).forEach(function(e){
			try_dark(tmp_2[e])
		})
	}
}

function loadProfileImage(){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", '../api/get_profile_photo')
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
	xhr.send(JSON.stringify({'artist': local_storage.userName}))
}

async function submain() {
	getProfileInfo();
	loadProfileImage();
	initSelect();
	
	tabController.onFirstTimeOpen("settings", _=>{
		loadSettings();
	})
	tabController.onFirstTimeOpen("statistics", _=>{
		if (local_storage["sort_method"]){
			let input = document.querySelector('input[name=stat_sort_method]')
			input.value = local_storage["sort_method"];
			input.dispatchEvent(new Event('initialized'));
		}
		loadStatistics();
		load_graph();
	})
	tabController.onFirstTimeOpen("tracks", _=>{
		if (local_storage["sort_method"]){
			let input = document.querySelector('input[name=my_tracks_sort_method]')
			input.value = local_storage["sort_method"];
			input.dispatchEvent(new Event('initialized'));
		}
		loadTracks();
	})

	initTabs();
	get_limits();
}

function getProfileInfo(){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", '/api/get_profile_info', false)
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({'user': local_storage.userName}))
	if (xhr.status != 200){ notice.Error(LANG.error) }
	else{
		let answer = JSON.parse(xhr.response);
		if (answer.successfully){
			document.getElementById("user-name").getElementsByTagName('a')[0].href = answer.path
			if (answer["is_admin"]){
				document.getElementById("console-icon").style.display = ""
			}
			if (answer["premium"]){
				document.getElementById("premium_timer").style.display = ""
				document.getElementById("premium_timer").innerHTML = "👑" + LANG.premium_until
				if (answer['premium'] == -1){
					document.getElementById("premium_timer").innerHTML += ` <code>${LANG.unlimited}</code>`
				}
				else{
					document.getElementById("premium_timer").innerHTML += ` <code>${answer['premium']}</code>`
				}
			}
			if (answer["role"] == "banned"){
				document.getElementById("premium_timer").style.display = ""
				if (answer["banned"]){
					document.getElementById("premium_timer").innerHTML = "🚫" + LANG.banned_until;
					var date = new Date(answer["banned"] * 1000);
					var cur_date = new Date();
					var diff = (date - cur_date) / 1000;
					let info_string = "";
					if (diff < 86_400){
						info_string += Math.ceil(diff / 3600) + LANG.banned_until_hours;
					}
					else{
						info_string += Math.ceil(diff / 86_400) + LANG.banned_until_days;
					}
					document.getElementById("premium_timer").innerHTML += ` <code>${info_string}</code>`
				}
				else{
					document.getElementById("premium_timer").innerHTML = "🚫" + LANG.banned;
				}
			}
		}
	}
}

var file_limits = {
    'image': {'size': 2097152, 'resolution': 1280, 'extensions': ["image/png, image/jpeg"]}
}
function get_limits(){
    let req = new XMLHttpRequest();                          
    req.open("POST", '/api/get_file_limits');
    req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    req.onload = function() {
        if (req.status == 200){
            answer = JSON.parse(req.response)
            file_limits = answer.limits;
        }
    }
    req.send(JSON.stringify({'user': local_storage.userName}));
}


async function get_tracks(sort_method='default'){
	return new Promise((resolve, reject) => {
		let data = { 'user': local_storage.userName }
		let sort = sort_method == 'default' ? local_storage["sort_method"] : sort_method;
		if (sort != undefined){
			data = {...data, "sort_method": sort};
		}
		let xhr = new XMLHttpRequest();
		xhr.open("POST", '/api/get_tracks')
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onload = ()=>{
			if (xhr.status != 200){ notice.Error(LANG.error) }
			else{
				let answer = JSON.parse(xhr.response);
				if (answer.successfully){
					resolve(answer.tracks);
				}
			}
			resolve([]);
		}
		xhr.send(JSON.stringify(data))
	})
}

var tracksLoaded = false;
async function loadTracks(){
	document.getElementById("main_page").innerHTML = loader();
	let sort_method = document.querySelector("input[name=my_tracks_sort_method]").value
	let tracks = await get_tracks(sort_method);
	if (tracks){
		if (tracks.length == 0){
			document.getElementById("main_page").innerHTML = empty();
		}
		else{
			await addNewCategory(tracks)
			overflowed()
		}
	}
}

function showScrollTop(){
	if (main_content.scrollTop > 200){
		document.getElementById("toTop").style.bottom = "5px"
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
		var div = document.createElement('div')
		div.className = "category flexable"
		var subdiv = document.createElement('div')
		subdiv.className = "category_body"
		tracks.forEach(function(e){
			var a = document.createElement('a');
			a.className = "about_box";
			a.setAttribute('data-href', e.path.join("/"))
			a.onclick = ()=>show(e.track, a);
			a.onmousedown = (event) => {if (event.button === 1) {
				window.open("/" + e.path.join("/"), '_blank');
			}}

			let img = document.createElement('img');
			img.className = "loader"
			img.alt = ""
			img.src = `/${e.path.join("/")}/${e.image}?size=small`
			img.onload = ()=>img.classList.remove("loader");

			a.innerHTML = `
					${img.outerHTML}
					<div class="track_name"><span>${e.track}</span></div>
			`
			subdiv.appendChild(a)
		})
		div.appendChild(subdiv)
		document.getElementById("main_page").innerHTML = ""
		document.getElementById("main_page").appendChild(div)
		resolve()
	});
}

function validateImage(file, compress=true){
	return new Promise((resolve, reject) => {
		if (file && file['type'].split('/')[0] === 'image'){
			var _URL = window.URL || window.webkitURL;
			var img = new Image();
			var objectUrl = _URL.createObjectURL(file);
			img.onload = function () {
				if (img.width <= file_limits.image.resolution && img.height <= file_limits.image.resolution){
					_URL.revokeObjectURL(objectUrl);
					if (file.size > file_limits.image.size) {
						if (local_storage["resize-images"] != undefined && JSON.parse(local_storage["resize-images"]) && compress){
							notice.Warning(LANG.start_resize)
							var onSuccessCompress = (image)=>{
								notice.Success(LANG.file_resized)
								resolve([false, image, "compress"])
							}
							ResizeRequest(file, onSuccessCompress, this.width, this.height);
						}
						else{
							resolve([false, LANG.file_too_big])
						}
					}
					else{ resolve([true]) }
				}
				else{
					_URL.revokeObjectURL(objectUrl);
					if (local_storage["resize-images"] != undefined && JSON.parse(local_storage["resize-images"])){
						notice.Warning(LANG.start_resize)
						var onSuccessResize = (image)=>{
							notice.Success(LANG.file_resized)
							resolve([false, image])
						}
						ResizeRequest(file, onSuccessResize, ...resizeWithRatio(this.width, this.height, file_limits.image.resolution, file_limits.image.resolution));
					}
					else{ resolve([false, LANG.file_too_big]) }
				}
			};
			img.src = objectUrl;
		}
		else{ resolve([false, LANG.wrong_file_format]) }
	})
}

function ResizeRequest(file, callback, desired_W=1280, desired_H=1280){
	if (file.type.split('/')[0] == 'image'){
		var new_name = file.name.split('.').slice(0, -1).join() + ".jpg"
		var onSuccess = function (newImage){
			fetch(newImage).then(res => res.blob()).then(resizedImage => {
				var file = new File([resizedImage], new_name, {type: 'image/jpeg'});
				callback(file)
			})
		};

		var reader = new FileReader();
		reader.onload = function (readerEvent) {
			let image_src = readerEvent.target.result;
			resizeImage(image_src, desired_W, desired_H, 0.9, onSuccess)
		}
		reader.readAsDataURL(file);
	}
}
function resizeImage(imageUrl, newWidth, newHeight, quality, onReady) {
	var image = document.createElement('img');
	image.onload = function() {
		var canvas = document.createElement('canvas');
		canvas.width = newWidth;
		canvas.height = newHeight;
		var context = canvas.getContext('2d');
		context.drawImage(image, 0, 0, newWidth, newHeight);
		try {
			var dataUrl = canvas.toDataURL('image/jpeg', quality);
			onReady(dataUrl);
		} catch {}
	};
	image.src = imageUrl;
};
function resizeWithRatio(width, height, max_W, max_H){
	if (width > height) {
		if (width > max_W) {
			height *= max_W / width;
			width = max_W;
		}
	} else {
		if (height > max_H) {
			width *= max_H / height;
			height = max_H;
		}
	}
	return [parseInt(width), parseInt(height)];
}


function sendFile(file){
	var formData = new FormData();
	formData.append('artist', local_storage.userName);
	formData.append('password', local_storage.userPassword);
	formData.append('image', file);

	let req = new XMLHttpRequest();
	req.open("POST", '../api/change_profile_photo');
	req.onload = function() {
		if (req.status != 200){notice.Error(LANG.error)}
		else{
			answer = JSON.parse(req.response)
			if (!answer.successfully){ notice.Error(get_decode_error(answer.reason)) }
			else{
				notice.clearAll()
				notice.Success(LANG.files_uploaded)
				loadProfileImage()
			}
		}
	}
	req.onerror = _=> notice.Error(LANG.error);
	req.send(formData);
}
function selectFile(){
	var input = document.createElement('input');
	input.type = 'file';
	input.accept = file_limits.image.extensions;
	input.onchange = async e => { 
		var file = e.target.files[0];
		var valide = await validateImage(file);
		if (valide[0]){
			sendFile(file)
		}
		else{
			if (local_storage["resize-images"] != undefined && JSON.parse(local_storage["resize-images"])){
				let resized_file = valide[1];
				var new_valide;
				if (valide[2] == "compress"){
					new_valide = await validateImage(resized_file, false);
				}
				else{
					new_valide = await validateImage(resized_file);
				}
				if (new_valide[0]){
					sendFile(resized_file)
				}
			}
			else{ notice.Error(valide[1]) }
		}
	}
	input.click();
}


current_show = ""
current_show_obj = ""
var timout_menu;
function show(what, obj){
	if (timout_menu) {
		clearTimeout(timout_menu);
	}
	notice.clearAll()
	current_show = what
	current_show_obj = obj
	document.getElementById("card_previewer_name_txt").innerHTML = what;
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

function checkHideMenu(e){
	for (let i=0; i<e.path.length;i++){
		if (e.path[i] == document.getElementById("card_previewer")){
			return
		}
		if (e.path[i] == document.getElementById("card_previewer_name")){
			return
		}
		if (e.path[i].className == "about_box"){
			return
		}
		if (e.path[i] == document.getElementById("header")){
			return
		}
		if (e.path[i] == document.getElementById("notifications")){
			return
		}
	}
	hide()
}


function open_(){
	window.open("/" + current_show_obj.getAttribute("data-href"), '_blank');
}
function edit(){
	let url = new URL("new-release", window.location.href);
	url.searchParams.append('edit', current_show);
	window.location.href = url.href;
}

function copyToClipboard(text) {
	const elem = document.createElement('textarea');
	elem.value = text;
	document.body.appendChild(elem);
	elem.select();
	document.execCommand('copy');
	document.body.removeChild(elem);
}
function share(){
	let url = new URL("/" + current_show_obj.getAttribute("data-href"), window.location.href)
	copyToClipboard(decodeURI(url.href))
	notice.Success(LANG.copied, 3000)
}

function confirm_delete(){
	notice.clearAll()
	notice.Error(`${LANG.delete} <a style="color:red">${current_show}</a>?`, false, [[LANG.yes, delete_], LANG.no])
}
function delete_(){
	if (local_storage.userName && local_storage.userPassword){
		let xhr = new XMLHttpRequest();
		xhr.open("POST", `../api/delete_track`, false)
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify({
			'artist': local_storage.userName,
			'password': local_storage.userPassword,
			'track_name': current_show
		}))
		if (xhr.status != 200){ notice.Error(LANG.error) }
		else{
			let answer = JSON.parse(xhr.response);
			if (!answer.successfully){ notice.Error(get_decode_error(answer.reason)) }
			else {
				notice.Success("OK")
				let parent = current_show_obj.parentNode;
				current_show_obj.remove()
				hide()
				if (parent.childElementCount == 0){
					document.getElementById("empty").innerHTML = empty();
				}
			}
		}
	}
}
function confrim_delete_avatar(){
	window.navigator.vibrate(50);
	notice.clearAll()
	notice.Error(`${LANG.delete_avatar_confirm}`, false, [[LANG.yes, delete_avatar], LANG.no])
}
function delete_avatar(){
	if (local_storage.userName && local_storage.userPassword){
		var formData = new FormData();
		formData.append('artist', local_storage.userName);
		formData.append('password', local_storage.userPassword);
		formData.append('delete', true);
		let xhr = new XMLHttpRequest();
		xhr.open("POST", `../api/change_profile_photo`, false)
		xhr.send(formData)
		if (xhr.status != 200){ notice.Error(LANG.error) }
		else{
			let answer = JSON.parse(xhr.response);
			if (!answer.successfully){ notice.Error(get_decode_error(answer.reason)) }
			else {
				notice.clearAll()
				notice.Success(LANG.avatar_deleted)
				loadProfileImage()
			}
		}
	}
}

function validatePhoneNumber(input_str) {
	var re = /^[+]\d[\d\(\)\ -]{6,14}\d$/;
	return re.test(input_str);
}
function validateEmail(input_str) {
	var re = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
	return re.test(input_str);
}

var global_profile_data = {};
function loadSettings() {
	let available_settings = ["lang", "theme", "hard-anim", "resize-images", "sort_method", "secure-links"]
	Object.keys(local_storage).forEach(function(e){
		if (available_settings.includes(e)){
			let inputs = document.querySelectorAll(`.settings_element input[name=${e}]`)
			if (inputs.length > 1){
				let input = Array.from(inputs).filter(i=>i.value==local_storage[e])[0]
				try{input.checked = true;}catch{}
			}
			else{
				if (inputs[0].classList.contains("select__input")){
					inputs[0].value = local_storage[e];
					inputs[0].dispatchEvent(new Event('initialized'));
				}
				try{
					inputs[0].checked = JSON.parse(local_storage[e]);
				}catch{}
			}
		}
	})

	function loadProfileValues(data){
		var phone_input = document.querySelector(".settings_element input[type=tel]");
		phoneMask = IMask(
		phone_input, {
			mask: '+(000) 00-00-00-00000'
		});

		init_Social();

		global_profile_data = data;
		Object.keys(data).forEach(function(i){
			if (i == "social"){
				for (j in data[i]){
					add_social(data[i][j])
				}
			}
			else if (i != "public_fields"){
				if (i == "gender"){
					let select = document.querySelector(`.settings_element select[name=${i}]`)
					select.value = data[i]
					select.dataset.chosen = data[i]
				}
				else if (i == "public_favorites"){
					if (data[i]){
						let toggle_input = Array.from(
												document.querySelectorAll(`.settings_element input[name=toggle_favorites]`)
												).filter(e=>e.value=="true")[0]
						toggle_input.checked = true;
					}
				}
				else if (i == "official"){
					delete global_profile_data["official"]
				}
				else if (i == "phone"){
					phoneMask.unmaskedValue = data[i];
				}
				else{
					try{
						let input = document.querySelector(`.settings_element input[name=${i}]`)
						input.value = data[i];
					}catch{}
				}
				if ("public_fields" in data){
					if (data.public_fields.includes(i)){
						let toggle_input = Array.from(
												document.querySelectorAll(`.settings_element input[name=toggle_${i}]`)
												).filter(e=>e.value=="true")[0]
						toggle_input.checked = true;
					}
				}
			}
		})
	}

	let xhr = new XMLHttpRequest();
	xhr.open("POST", `../api/get_user_profile`)
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.onload = function() {
		if (xhr.status == 200){
			let answer = JSON.parse(xhr.response);
			if (answer.successfully){
				document.getElementById("profile-settings").style.display = "block";
				loadProfileValues(answer.data)
			}
			else{
				console.error("/api/get_user_profile \n", get_decode_error(answer.reason))
			}
		}
		else{
			console.error("/api/get_user_profile")
		}
	}
	xhr.send(JSON.stringify({
		'name': local_storage.userName,
		'password': local_storage.userPassword
	}))
}
function changeSettings(e){
	if (e.type == "checkbox"){
		localStorage.setItem(e.name, e.checked);
	}
	else{
		if (e.value == "auto"){
			localStorage.removeItem(e.name);
		}
		else{
			localStorage.setItem(e.name, e.value);
		}
	}
}
function saveSettings(){
	let inputs = document.querySelectorAll("#profile-settings > .settings_element input, select");
	var final = {}
	var final_all = {}
	var canSaveSettings = true;
	inputs.forEach(function(e){
		if (e.type == "radio"){
			if (e.checked){
				if (!("public_fields" in final)){
					final["public_fields"] = []
				}
				if (!("public_fields" in final_all)){
					final_all["public_fields"] = []
				}
				if (e.name.replace("toggle_", "") == "favorites"){
					final_all["public_favorites"] = (e.value == "true")
					final["public_favorites"] = (e.value == "true")
				}
				else if (e.value == "true"){
					final_all.public_fields.push(e.name.replace("toggle_", ""));
					final.public_fields.push(e.name.replace("toggle_", ""));
				}
			}
			return;
		}
		else if (e.type == "email"){
			if (e.value.trim() != ""){
				if (!validateEmail(e.value.trim())){
					e.setCustomValidity(LANG.invalid_email);
					e.reportValidity();
					e.onkeydown = _=> e.setCustomValidity('');
					canSaveSettings = false;
				}
				else{
					final_all[e.name] = e.value.trim();
					final[e.name] = e.value.trim();
					return
				}
			}
		}
		else if (e.type == "tel"){
			if (phoneMask.unmaskedValue != "" || e.value){
				if (!validatePhoneNumber("+" + phoneMask.unmaskedValue)){
					e.setCustomValidity(LANG.invalid_phone);
					e.reportValidity();
					e.onkeydown = _=> e.setCustomValidity('');
					canSaveSettings = false;
				}
				else{
					final_all[e.name] = "+" + phoneMask.unmaskedValue;
					final[e.name] = "+" + phoneMask.unmaskedValue;
					return
				}
			}	
		}
		final_all[e.name] = e.value;
		if (e.value){
			final[e.name] = e.value;
		}
	})
	
	if (!canSaveSettings){return}

	let arr = document.querySelectorAll("#social .item:not(.deleted)")
	arr = Array.from(arr).map(e=>{ return e.querySelector('input').value.trim(); }).filter(x=>x)
	final_all["social"] = arr;
	if (arr.length > 0){
		final["social"] = arr;
	}

	if (!isEqual(global_profile_data, final)){
		let xhr = new XMLHttpRequest();
		xhr.open("POST", `../api/edit_user_profile`, false)
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify({
			'name': local_storage.userName,
			'password': local_storage.userPassword,
			...final_all
		}))
		if (xhr.status != 200){ notice.Error(LANG.error) }
		else{
			let answer = JSON.parse(xhr.response);
			if (!answer.successfully){ notice.Error(get_decode_error(answer.reason)) }
			else {
				notice.Success("OK")
				setTimeout(()=>window.location.reload(), 500)
			}
		}
	}
	else{
		window.location.reload();
	}
}

function isEqual(object1, object2) {
	const props1 = Object.getOwnPropertyNames(object1);
	const props2 = Object.getOwnPropertyNames(object2);
	if (props1.length !== props2.length) { return false; }
	for (let i = 0; i < props1.length; i += 1) {
		const prop = props1[i];
		const bothAreObjects = typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object';
		if ((!bothAreObjects && (object1[prop] !== object2[prop]))
		|| (bothAreObjects && !isEqual(object1[prop], object2[prop]))) {
			return false;
		}
	}
	return true;
}

function reset_password(){
	let url = window.location.pathname;
	let filename = url.substring(url.lastIndexOf('/')+1);
	if (filename == ""){
		filename = "../" + url.split("/").filter(x => x).at(-1)
	}

	let login = new URL("login", window.location.href);
	login.searchParams.append('redirect', filename);
	login.hash = "reset";

	window.location.href = decodeURIComponent(login.href)
}

// function sortByDate(what){
// 	what.forEach(function(e){
// 		var tmp = e.date.split(".")
// 		var x = new Date(tmp[2], tmp[1]-1, tmp[0])
// 		e.date = x
// 	})
// 	return what.sort((a, b) => b.date - a.date)
// }
// function sortByStat(what){
// 	what.forEach(function(e){
// 		e.popular = e.statistics.likes + e.statistics.views;
// 	})
// 	return what.sort((a, b) => b.popular - a.popular)
// }


function format_spaces(num){
	let counter = 0;
	let new_string = "";
	const chars = String(num).split('').reverse();
	chars.forEach(e=>{
		if (counter == 3){
			new_string += " "
			counter = 0
		}
		new_string += e
		counter++
	})
	new_string = [...new_string].reverse().join("")
	return new_string;
}
function format_number(num){
	let new_num = num;
	if (num >= 1000){
		new_num = Math.round(num/1000 * 10)/10;
	}
	let new_string = format_spaces(parseInt(new_num))
	const other = String(new_num).split('.')[1]
	if (other){
		new_string += "." + other
	}
	if (num >= 1000){
		new_string += "K"
	}
	return new_string;
}

function changeSortMethod(what){
	if (what == "statistics"){
		loadStatistics()
		load_graph(false)
	}
	else if (what == "my_tracks"){
		loadTracks()
	}
}
async function loadStatistics(){
	let sort_method = document.querySelector("input[name=stat_sort_method]").value
	document.getElementById("statistics_area").innerHTML = loader();
	let tracks = await get_tracks(sort_method);
	if (tracks){
		if (tracks.length == 0){
			document.getElementById("statistics_area").innerHTML = empty();
			return
		}
		let div = document.getElementById("statistics_area");
		div.innerHTML = 
		`
			<div class='track' style="font-weight: bold; padding-top: 12px; padding-bottom: 12px;">
				<span class="track_info" style="justify-content:center;">${LANG.content}</span>
				<span class="likes_and_views">
					<span>${LANG.views}</span>
					<span>${LANG.likes}</span>
				</span>
			</div>
		`
		tracks.forEach(function(e){
			let track = document.createElement("div")
			track.className = "track"
			track.innerHTML += `
				<span class="track_info">
					<a class="image" href="/${e.path.join("/")}" target="_blank"
						style="background-image:url('/${e.path.join("/")}/${e.image}?size=small')">
						<span>${LANG.open}</span>
					</a>
					<span class="track_name_and_date">
						<a href="/${e.path.join("/")}" class="name" target="_blank">${e.track}</a>
						<span class="date">${e.date}</span>
					</span>
				</span>
				<span class="likes_and_views">
					<span title="${format_spaces(e.statistics.views)}">${format_number(e.statistics.views)}</span>
					<span title="${format_spaces(e.statistics.likes)}">${format_number(e.statistics.likes)}</span>
				</span>
			`
			div.appendChild(track)
		})	
	}
}


var tracks = [];
async function load_graph(first_load=true){
	let graph;
	if (first_load){
		tracks = await get_tracks("date");
		if (tracks){
			graph = document.createElement("div");
			graph.className = "graph";
			graph.id = "statistic_graph";
			document.querySelector("#statistic_graph_parrent").appendChild(graph)
		}
	} else { graph = document.querySelector("#statistic_graph") }
	
	if (!tracks || tracks.length == 0){
		document.querySelector("#statistic_graph_parrent").style.display = "none";
		return
	}

	function get_relative_position(parrent, relative_el, event, difference_y=0, important=false){
		let clientX = event.clientX || event.touches[0].clientX;
		let clientY = (event.clientY) || (event.touches[0].clientY);

		let parrent_rect = relative_el.getBoundingClientRect()
		let horizontal_include = parrent_rect.x < clientX && clientX < parrent_rect.x + relative_el.offsetWidth;
		let vertical_include = parrent_rect.y < clientY && clientY < parrent_rect.y + relative_el.offsetHeight;
		if (!horizontal_include || !vertical_include){if (!important){return}}

		let rect = parrent.getBoundingClientRect();
		let child = relative_el.querySelector(".popup");
		let x = clientX - rect.left + parrent.scrollLeft - child.offsetWidth/2;
		x = Math.max(parrent.scrollLeft, x);
		x = Math.min(x, parrent.scrollLeft + parrent.offsetWidth - child.offsetWidth);
		x = Math.round(x);

		let y = clientY - rect.top - child.offsetHeight;
		y = Math.max(y, difference_y);
		y = Math.round(y);

		return {x, y};
	}
	var device_type_global = false;
	function setPosition(graph, el, e){
		let device_type = e.type.includes("touch") ? "touch" : "mouse";
		if (!device_type_global){device_type_global = device_type;}
		if (device_type_global != device_type){
			setTimeout(_=>{device_type_global=false}, 500)
			return
		}
		let diff = 10;
		if (device_type == "touch"){
			diff = 35;
		}
		let target_ = el.querySelector(".popup");
		if (target_){
			let important = (target_.style.top == 0 && target_.style.left == 0);
			let answer = get_relative_position(graph, el, e, diff, important);
			if (answer){
				target_.style.top = answer.y - diff + "px";
				target_.style.left = answer.x + "px";
			}
		}
	}
	function get_key(el, key){
		const keys = {
			"views": el.statistics.views,
			"likes": el.statistics.likes
		}
		return keys[key]
	}
	function get_key_lang(el, key){
		const keys = {
			"views": LANG.views,
			"likes": LANG.likes
		}
		return keys[key]
	}
	let sort_method = document.querySelector("input[name=stat_sort_method]").value;
	let max_value = Math.max(...tracks.map(e => {
		let temp = get_key(e, sort_method) ? get_key(e, sort_method) : e.popular;
		return temp;
	}));
	graph.innerHTML = ""
	tracks.reduceRight((_, e)=>{
		let div = document.createElement("div");
		div.className = "element";
		let displaying = get_key(e, sort_method) ? get_key(e, sort_method) : e.popular;
		let height = Math.round(displaying * 100 / max_value);
		div.innerHTML = `
			<a class="info" href="/${e.path.join("/")}" target="_blank"><img src="/${e.path.join("/")}/${e.image}?size=small"></a>
			<dev class="rectangle_area">
				<div class="rectangle ${first_load ? "" : "normal"}" style="max-height: ${Math.max(0.5, height)}%">
					<div class="popup">
						${e.track}</br>
						<code>${e.date}</code>
						${get_key(e, sort_method) ?
							"</br>" + get_key_lang(e, sort_method) + ": <code>" + get_key(e, sort_method) + "</code>"
						: ""}
					</div>
				</div>
			</div>
		`
		graph.appendChild(div)
	}, null)
	graph.scrollLeft = graph.scrollWidth;
	setTimeout(_=>{
		graph.querySelectorAll(".element .rectangle_area").forEach(el=>{
			if (first_load){
				el.querySelector(".rectangle").classList.add("normal")
			}
			el.onmouseover = e=>{
				setPosition(graph, el, e)
				el.onmousemove = e=>{setPosition(graph, el, e)}
			}
			el.ontouch = e=>{setPosition(graph, el, e)}
			el.ontouchstart = e=>{setPosition(graph, el, e)}
			el.ontouchmove = e=>{setPosition(graph, el, e)}
		})
	}, 100)
}

function open_menu(){
	let button = document.getElementById("menu_but").children[0];
	button.classList.toggle("menu_active")
	if (button.classList.contains("menu_active")){
		document.getElementById('menu').classList.add("menu_active")
	}
	else{
		document.getElementById('menu').classList.remove("menu_active")
	}
}

function collapse(){
	let menu = document.getElementById("menu");
	let button = document.getElementById('collapse_but')
	let button_title = menu.querySelector('.collapse_but_wraper')
	menu.classList.toggle("collapsed")
	if (menu.classList.contains("collapsed")){
		button.style.transform = "rotateY(180deg)"
		button_title.title = LANG.expand
		menu.classList.remove("widthing")
	}
	else{
		button.style.transform = ""
		button_title.title = LANG.collapse
	}
	menu.addEventListener("transitionend", _=>{
		setTimeout(_=>{
		if (menu.classList.contains("collapsed")){
			menu.classList.remove("widthing")
		}
		else{
			menu.classList.add("widthing")
		}
		}, 100)
	})
}

function changeTab(target){
	let currentTab = document.querySelector("#menu .menu-element.active");
	let targetTab = document.querySelector(`#menu .menu-element[data=${target}]`);
	if (currentTab != targetTab){
		document.title = `${LANG.profile_title} - ${targetTab.title}`
		currentTab.classList.remove("active")
		targetTab.classList.add("active")
		window.location.hash = target;
		let currentTabContent = document.querySelector("#page-content > .tab-content.active");
		let targetTabContent = document.querySelector(`#page-content > .tab-content[data=${target}]`);
		currentTabContent.classList.remove("active")
		targetTabContent.classList.add("active")
		if (document.getElementById('menu').classList.contains("menu_active")){
			open_menu()
		}

		tabController.openedTab(target)
	}
}

function initTabs(){
	let tabs = document.querySelectorAll("#menu .menu-element[data]");
	tabs.forEach(tab=>{
		tab.onclick = e => {
			changeTab(tab.getAttribute("data"))
		}
	})
	if (window.location.hash){
		changeTab(window.location.hash.split("#")[1])
	}
}


/*   */

function init_Social(){
	var sortable = new Sortable(document.querySelector('#social'), {
		animation: 150,
		handle: ".handle",
		onStart: _=>{window.navigator.vibrate(50);}
	});
}

function add_social(domain="https://example.com/"){
	let el = document.createElement('div')
	let value = domain == "https://example.com/" ? "" : domain;
	el.className = "item"
	el.innerHTML = 
	`
		<div class="main">
			<i class="fa fa-bars handle" title="${LANG.move}"></i>
			<img src="https://www.google.com/s2/favicons?domain=${domain}">
			<input type="text" onkeyup="checkSocialIcon(event)" value="${value}">
		</div>
		<i class="fas fa-close close" onclick="delete_social(event)" title="${LANG.remove}"></i>		
	`
	document.querySelector('#social').appendChild(el)
	Sortable.create(el, {
			group: 'social',
			animation: 150,
			draggable: ".item",
			handle: ".handle",
			chosenClass: "sortable-chosen",
			dragClass: "sortable-drag"
		});
}

function getSocialElement(arr){
	for (i in arr){
		let element = arr[i];
		if (element.classList.contains("item")){
			return element;
		}
	}
}

function delete_social(event){
	let el = getSocialElement(event.path)
	if (el.querySelector('input').value.trim() == ""){
		el.remove();
		return
	}
	el.classList.add('deleted')
	let close = el.querySelector(".close")
	close.classList.remove("fa-close")
	close.classList.add("fa-add")
	close.onclick = (e) => { return_social(e) }
	close.title = LANG.return_back
	window.navigator.vibrate(50);
}

function return_social(event){
	let el = getSocialElement(event.path)
	el.classList.remove('deleted')
	let close = el.querySelector(".close")
	close.classList.remove("fa-add")
	close.classList.add("fa-close")
	close.onclick = (e) => { delete_social(e) }
	close.title = LANG.remove
}

function checkSocialIcon(event){
	function isUrl(href){
		try {
			let url = new URL(href);
			return true;
		} catch (_) {
			return false;
		}
	}
	let el = getSocialElement(event.path);
	let input = el.querySelector('input').value
	let image = el.querySelector('img')
	if (isUrl(input)){
		image.src = `https://www.google.com/s2/favicons?domain=${input}&sz=256`
	}
	else{
		image.src = "https://www.google.com/s2/favicons?domain=https://example.com/"
	}
}


function initSelect(){
	document.querySelectorAll(".select").forEach(e=>{
		let input = e.querySelector(".select__input");
		e.onclick = _=>{
			e.classList.toggle("open")
			e.querySelectorAll(".select__list li").forEach(li=>{
				li.onclick = _=>{
					e.querySelectorAll(".select__list li").forEach(li_other=>li_other.classList.remove("selected"))
					input.value = li.getAttribute('value')
					input.dispatchEvent(new Event('change'));
				}
			})
		}
		function changeInput(){
			let target = e.querySelector(`.select__list li[value=${input.value}]`)
			target.classList.add("selected")
			e.querySelector(".select__head").innerHTML = target.innerHTML
		}
		input.addEventListener("initialized", changeInput)
		input.addEventListener("change", changeInput)
	})
	document.body.addEventListener("click", event=>{
		document.querySelectorAll(".select.open").forEach(element=>{
			if (!event.path.includes(element)){
				element.classList.remove("open")
			}
		})
	})
}


function open_logins(){
	function close_modal(element){
		let child = element.children[0];
		child.style.transform = "scale(0)"
		element.style.backdropFilter = ""
		setTimeout(_=>{
			element.remove()
		}, 500)
	}
	let modal = document.createElement("div")
	modal.className = "modal"
	modal.style.backdropFilter = ""
	modal.onclick = e=>{
		if (e.target == modal){
			close_modal(modal)
		}
	}

	let popup_element = document.createElement("div")
	popup_element.id = "popup_element"
	popup_element.style.transform = "scale(0)"
	let img = document.createElement("img")
	img.src = "/root_/images/close.svg"
	img.id = "close_share_menu"
	img.title = LANG.close
	img.onclick = _=>{close_modal(modal)}
	popup_element.appendChild(img)
	let iframe = document.createElement("iframe")
	iframe.src = "/account/logins"
	popup_element.appendChild(iframe)
	modal.appendChild(popup_element)
	document.body.appendChild(modal)
	setTimeout(_=>{
		popup_element.style.transform = "scale(1)"
		modal.style.backdropFilter = "blur(8px)"
	}, 1)
}
