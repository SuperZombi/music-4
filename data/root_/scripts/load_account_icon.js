let userName = localStorage.getItem('userName')
if (userName){
	loadProfileImage(userName)
	let menu = document.querySelector('#main_menu .menu')
	if (menu){
		let li = menu.querySelector('li[name="account"]')
		li.setAttribute("href", "account")
		li.innerHTML += `: <span class='helper'>${userName}</span>`

		let logout = document.createElement("li")
		logout.style.color = "red"
		logout.style.display = "block"
		logout.innerHTML = `
			<i class="fa-solid fa-right-from-bracket" style="float: right;"></i>
			${LANG.log_out}
		`
		logout.onclick = _=>{
			window.localStorage.removeItem('userName')
			window.localStorage.removeItem('userPassword')
			window.location.reload()
		}
		menu.appendChild(logout)		
	}
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

document.querySelectorAll(".menu-area").forEach(menuArea =>{
	let back_button = menuArea.querySelector(".back_button")
	menuArea.querySelectorAll(".submenu").forEach(el=>{
		let back = document.createElement("li")
		back.classList.add("back_button")
		back.onclick = _=>{
			el.style.left = ""
			el.dispatchEvent(new Event('submenu_close'));
		}
		back.innerHTML = back_button.innerHTML;
		if (el.querySelector(".menu_title")){
			el.querySelector(".menu_title").after(back);
		}
		else{
			el.prepend(back)
		}
	})
	menuArea.querySelectorAll(".menu, .submenu").forEach(menu=>{
		menu.querySelectorAll("li[submenu]").forEach(sub=>{
			let target = menuArea.querySelector(`.submenu[name=${sub.getAttribute("submenu")}]`)
			sub.onclick = _=>{
				menu.style.filter = "brightness(0.25)"
				target.style.left = 0
				menuArea.style.minHeight = target.scrollHeight + "px"
			}
			target.addEventListener('submenu_close', _=> {
				menu.style.filter = ""
				target.style.left = ""
				menuArea.style.minHeight = ""
			});
		})
		menu.querySelectorAll("li[href]").forEach(li=>{
			if (li.getAttribute("target")){
				li.onclick = _=> window.open(li.getAttribute("href"), li.getAttribute("target"))
			} else{
				li.onclick = _=> window.open(li.getAttribute("href"),"_self")
			}
			li.addEventListener("mousedown", e=>{
				if (e.which == 2) {
					window.open(li.getAttribute("href"), "_blank")
				}
			})
		})
	})
})
function exitAllSubMenus(){
	document.querySelector("#main_menu").querySelectorAll(".menu, .submenu").forEach(menu=>{
		menu.dispatchEvent(new Event('submenu_close'));
	})
}
function initSelectedMenuElement(li_name, html_atribute, change_handler){
	function update_changes(element, selected_){
		element.querySelector(".helper").innerHTML = selected_.textContent
	}
	let main_el = document.querySelector(`#main_menu .menu li[submenu='${li_name}']`)
	let submenu = document.querySelector(`#main_menu .submenu[name='${li_name}']`)
	let selected = submenu.querySelector(`li[value="${html_atribute}"]`)
	main_el.innerHTML += `: <span class='helper'>${selected.textContent}</span>`
	selected.classList.add("selected")
	submenu.addEventListener("click", e=>{
		if (e.target.tagName.toLowerCase() == "li" &&
			!e.target.classList.contains('selected') && 
			!e.target.classList.contains('back_button')
		){
			let old_selected = submenu.querySelector("li.selected")
			old_selected.classList.remove("selected")
			e.target.classList.add("selected")
			update_changes(main_el, e.target)
			change_handler(e.target, old_selected)
		}
	})
}
function updateMenuElement(li_name, html_atribute){
	let main_el = document.querySelector(`#main_menu .menu li[submenu='${li_name}']`)
	let submenu = document.querySelector(`#main_menu .submenu[name='${li_name}']`)
	let selected_old = submenu.querySelector('li.selected')
	selected_old.classList.remove('selected')
	let selected = submenu.querySelector(`li[value="${html_atribute}"]`)
	main_el.querySelector(".helper").innerHTML = selected.textContent
	selected.classList.add("selected")
}

if (document.querySelector('#main_menu')){
	document.getElementById("myAccount").onclick = _=> {
		document.getElementById("account_popup").classList.toggle("show")
		setTimeout(()=>exitAllSubMenus(), 500)
	}
	document.body.addEventListener("click", e=>{
		if (!e.path.includes(document.querySelector(".myAccountElement"))){
			document.getElementById("account_popup").classList.remove("show")
			setTimeout(()=>exitAllSubMenus(), 500)
		}
	})
	initSelectedMenuElement('language', document.documentElement.getAttribute("lang"), target=>{
		window.localStorage.setItem('lang', target.getAttribute("value"))
		window.location.reload()
	});
	initSelectedMenuElement('hard_anim', window.localStorage.getItem('hard-anim') || true, target=>{
		window.localStorage.setItem('hard-anim', target.getAttribute("value"))
		window.location.reload()
	});
	initSelectedMenuElement('theme', document.documentElement.getAttribute("theme"), (target, old_element)=>{
		window.localStorage.setItem('theme', target.getAttribute("value"))
		document.documentElement.setAttribute("theme", target.getAttribute("value"))
		document.documentElement.classList.remove(old_element.getAttribute("value"))
		document.documentElement.classList.add(target.getAttribute("value"))
		initMenuIcons()
		try{ change_switcher_title() }catch{}
		setTimeout(function(){try{ darking_images() }catch{}}, 300)
	});
}

function initMenuIcons(){
	document.querySelectorAll(".menu-area ul li > i[darkClass]").forEach(icon=>{
		if (document.documentElement.getAttribute("theme") == "light"){
			icon.classList.remove(icon.getAttribute("darkClass"))
			icon.classList.add(icon.getAttribute("lightClass"))
		}
		else{
			icon.classList.remove(icon.getAttribute("lightClass"))
			icon.classList.add(icon.getAttribute("darkClass"))
		}
	})
}
initMenuIcons()
