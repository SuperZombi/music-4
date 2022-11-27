main()

function passwordToggle(what){
	var input = what.parentNode.getElementsByTagName("input")[0]
	if (input.type === "password") {
		input.type = "text";
		what.classList.add("fa-eye-slash");
		what.title = LANG.hide;
	}
	else {
		input.type = "password";
		what.classList.remove("fa-eye-slash");
		what.title = LANG.show;
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

function validName(input){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", '../api/name_available', false)
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({'name': input.value}))
	if (xhr.status != 200){ return false }
	else{
		answer = JSON.parse(xhr.response)
		if (!answer.available){
			input.setCustomValidity(get_decode_error(answer.reason));
			input.reportValidity();
			input.onkeydown = _=> input.setCustomValidity('');
			return false;
		}
		else{ return true }
	}
}

function confirmPassword(main, child){
	if(main.value != child.value) {
		child.setCustomValidity(LANG.pwds_dont_match);
		child.reportValidity();
		main.onchange = _=> child.setCustomValidity('');
		child.onkeydown = _=> child.setCustomValidity('');
		return false;
	}
	else if (main.value.trim().length < 4){
		main.setCustomValidity(LANG.pwd_short);
		main.reportValidity();
		main.onkeydown = _=> main.setCustomValidity('');
		return false;
	}
	else {
		child.setCustomValidity('');
		return true;
	}
}

function action_(){
	var type = document.querySelector('input[name="form_action"]:checked').value;
	var form = document.querySelector(`form[name="${type}"]`);

	if (form.querySelector('input[name="confirm_password"]')){
		if (
			confirmPassword(
				form.querySelector('input[name="password"]'),
				form.querySelector('input[name="confirm_password"]')
			)
		)
		{
			parseForm(type, form)
		}
	}
	else{
		parseForm(type, form)
	}
}
function reset_(){
	var form = document.querySelector("form[name=reset]");
	if (
		confirmPassword(
			form.querySelector('input[name="new_password"]'),
			form.querySelector('input[name="confirm_new_password"]')
		)
	)
	{
		var elements = Array.from(form.elements).filter(e => e.tagName.toLowerCase() != "button");
		elements = elements.filter(e => e.value);
		var final = {}
		elements.map(e => {
			if (e.name != "user" && e.name != "confirm_new_password"){
				final[e.name] = e.value;
			}
		})
		if (searchParams.user){
			final["user"] = searchParams.user;
		}
		else{
			if (local_storage.userName){
				final["user"] = local_storage.userName;
			}
			else{
				return;
			}
		}

		if (!searchParams.old){
			final.old_password = CryptoJS.MD5(final.old_password).toString();
		}
		final.new_password = CryptoJS.MD5(final.new_password).toString();
		
		let xhr = new XMLHttpRequest();
		xhr.open("POST", '../api/reset', false)
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(final))
		if (xhr.status == 200){
			answer = JSON.parse(xhr.response)
			if (!answer.successfully){
				if (answer.wait){
					notice.Warning(LANG.too_many_tries.replace("%", answer.sleep))
				}
				else{
					notice.Error(get_decode_error(answer.reason))
				}
			}
			else{
				notice.Success("OK")
				window.localStorage.setItem("userName", final.user)
				window.localStorage.setItem("userPassword", final.new_password)
				afterLogin()
			}
		}
	}
}

function parseForm(type, form){
	var elements = Array.from(form.elements).filter(e => e.tagName.toLowerCase() != "button");
	elements = elements.filter(e => e.value);
	var final = {}
	elements.map(e => {
		if (e.name != "confirm_password"){
			if (e.value.trim().length != 0){
				final[e.name] = e.value.trim();
			}
		}
		if (e.name == "phone"){
			let number = phoneMask.unmaskedValue
			if (number.length != 0){
				final[e.name] = "+" + number;
			}
		}
	})

	if (type == "signup"){
		if ( validName(form.querySelector('input[name="name"]')) ){
			final.password = CryptoJS.MD5(final.password).toString();

			let xhr = new XMLHttpRequest();
			xhr.open("POST", '../api/register', false)
			xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			xhr.send(JSON.stringify(final))
			if (xhr.status == 200){
				answer = JSON.parse(xhr.response)
				if (!answer.successfully){
					notice.Error(get_decode_error(answer.reason))
				}
				else{
					notice.Success("OK")
					window.localStorage.setItem("userName", final.name)
					window.localStorage.setItem("userPassword", final.password)
					afterLogin()
				}
			}
		}
	}
	if (type == "login"){
		final.password = CryptoJS.MD5(final.password).toString();

		let xhr = new XMLHttpRequest();
		xhr.open("POST", '../api/login', false)
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(final))
		if (xhr.status == 200){
			answer = JSON.parse(xhr.response)
			if (!answer.successfully){
				if (answer.wait){
					notice.Warning(LANG.too_many_tries.replace("%", answer.sleep))
				}
				else{
					notice.Error(get_decode_error(answer.reason))
				}
			}
			else{
				notice.Success("OK")
				window.localStorage.setItem("userName", final.name)
				window.localStorage.setItem("userPassword", final.password)
				afterLogin()
			}
		}
	}	
}

function validatePhoneNumber(input_str) {
	var re = /^[+]\d[\d\(\)\ -]{6,14}\d$/;
	return re.test(input_str);
}

function afterLogin(delay=1000){
	setTimeout(function(){
		if (searchParams.redirect){
			let arr = searchParams.redirect.split(">")
			let url = new URL(arr[0], window.location.href);
			if (arr.length > 1){
				url.hash = arr[1]
			}
			window.location = url.href;
		}
		else {
			window.location = "./"
		}
	}, delay)
}


var phoneMask;
function main(){
	document.title = `${LANG.login_title} - Zombi Music`
	notice = Notification('#notifications');

	const urlSearchParams = new URLSearchParams(window.location.search);
	searchParams = Object.fromEntries(urlSearchParams.entries());

	var phone_input = document.querySelector("input[type=tel]");
	phoneMask = IMask(
	phone_input, {
		mask: '+(000) 00-00-00-00000'
	});
	phone_input.addEventListener('input', () => {
		if (phoneMask.unmaskedValue != "" || phone_input.value){
			if (!validatePhoneNumber("+" + phoneMask.unmaskedValue)){
				phone_input.setCustomValidity(LANG.invalid_phone);
			}
			else{
				phone_input.setCustomValidity('');
			}
		}
		else{
			phone_input.setCustomValidity('');
		}
	});

	local_storage = { ...localStorage };

	var rad = document.querySelectorAll('input[name="form_action"]');
	for (var i = 0; i < rad.length; i++) {
		rad[i].addEventListener('change', function() {
			if (this.value == "signup"){
				document.querySelector(".flip-card").style.transform = "rotateY(180deg)"
				document.querySelector(".flip-card-front").style.display = "none"
				document.querySelector(".flip-card-back").style.display = "block"
				document.querySelector("#notifications").classList.add("notifications_top")
				location.hash = "signup"
			}
			else if(this.value == "login"){
				document.querySelector(".flip-card").style.transform = "rotateY(0deg)"
				document.querySelector(".flip-card-front").style.display = "block"
				document.querySelector(".flip-card-back").style.display = "none"
				document.querySelector("#notifications").classList.remove("notifications_top")
				location.hash = ""
				history.replaceState("", "", location.pathname)
			}
		});
	}
	
	if (window.location.hash.split('#')[1] == "signup"){
		document.querySelector(".flip-card").style.transform = "rotateY(180deg)"
		document.querySelector(".flip-card-front").style.display = "none"
		document.querySelector(".flip-card-back").style.display = "block"
		document.querySelectorAll('input[name="form_action"]')[1].checked = true
	}
	else if (window.location.hash.split('#')[1] == "reset"){
		Array.from(document.getElementsByTagName("form")).forEach(function(e){
			if(e.name != "reset"){
				e.style.display = "none"
			}
			else{
				e.style.display = "block"
			}
		})
		if (searchParams.old){
			let input = document.querySelector("form[name=reset] input[name=old_password]")
			input.value = searchParams.old;
			input.setAttribute("readonly", true);
			input.style.pointerEvents = 'none';
			input.parentNode.querySelector("i").onclick = null;
			input.parentNode.querySelector("i").style.display = "none";
		}
		if (searchParams.user){
			document.querySelector("form[name=reset] input[name=user]").value = searchParams.user
		}
		else{
			if (local_storage.userName){
				document.querySelector("form[name=reset] input[name=user]").value = local_storage.userName;
			}
			else{
				document.querySelector("form[name=reset] input[name=user]").value = LANG.user_name_not_defined;
				document.querySelector("form[name=reset] input[name=user]").style.color = "red";
				document.querySelector("form[name=reset] button").style.display = "none";
			}
		}
	}
	else{
		if (local_storage.userName && local_storage.userPassword){
			afterLogin(0)
		}
	}
}
