function Notification (argument) {
	return new Notifications(argument)
}

function hide_notification(el, ms){
	setTimeout(function() {
		el.classList.add("is-hidden")
		setTimeout(function(){el.classList.add("hide")}, 1000)
	}, ms);
}

class Notifications {
	constructor(element) {
	  	if (element == null){
	  		this.element = document.body
	  	}
	  	else{
	  		try{
		  		var tmp_not = document.querySelector(element)
		  		if(!tmp_not){
		  			this.element = document.body
		  			console.warn(`Element "${element}" was not found`)
		  		}
		  		else{
		  			this.element = tmp_not;
		  		}
		  	}
		  	catch{
		  		this.element = document.body
				console.warn(`Element "${element}" was not found`)
			}
	  	}
	  	this.animation_in = ["scale", "opacity"]
	}

	animationIN(anim_name){
		var animations = ["opacity", "scale", "scale-right", "scale-left"]
		if (anim_name){
			if (anim_name == "none"){
				this.animation_in = null
			}
			if (arguments.length > 1){
				this.animation_in = Object.values(arguments)
			}
			else if (typeof(anim_name) == "object"){
				this.animation_in = anim_name
			}
			else{
				if (animations.includes(anim_name)){
					this.animation_in = [anim_name]
				}
			}
		}
	}

	clearAll(){
		if (this.element != document.body){
			this.element.innerHTML = '';
		}
	}
	clear(){
		if (this.element != document.body){
			this.element.childNodes.forEach(function(e){
				try{
					if (e.classList.contains("is-hidden")){
						e.remove()
					}
				}
				catch{}
			})
		}
	}


	async Warning(text, arg1, arg2, arg3, arg4){
		let arr = this._parse([text, arg1, arg2, arg3, arg4])
		await this.NewNotification("warning", arr.text, this.element, arr.autohide, arr.ms, arr.buttons)
	}
	async Error(text, arg1, arg2, arg3, arg4){
		let arr = this._parse([text, arg1, arg2, arg3, arg4])
		await this.NewNotification("error", arr.text, this.element, arr.autohide, arr.ms, arr.buttons)
	}
	async Success(text, arg1, arg2, arg3, arg4){
		let arr = this._parse([text, arg1, arg2, arg3, arg4])
		await this.NewNotification("success", arr.text, this.element, arr.autohide, arr.ms, arr.buttons)
	}
	async Info(text, arg1, arg2, arg3, arg4){
		let arr = this._parse([text, arg1, arg2, arg3, arg4])
		await this.NewNotification("info", arr.text, this.element, arr.autohide, arr.ms, arr.buttons)
	}


	_parse(args){
		let text=""; let autohide=true; let ms=5000; let buttons=null;
		if ((!args[0]) || (typeof(args[0]) != "string")){
			throw "The variable 'text' is not defined";
		}
		else{
			text = args[0]
		}
		args.forEach(function(e){
			if (typeof(e) == "object"){
				if (Array.isArray(e)){
					buttons=e;
				}
			}
			if (typeof(e) == "boolean"){
				autohide=e;
			}
			if (typeof(e) == "number"){
				ms=e;
			}
		})

		return {text: text, autohide: autohide, ms: ms, buttons: buttons}
	}

	async NewNotification(type, text, elem, autohide=true, ms=5000, buttons=null){
		let div_el = await this.NewNotice(type, text, buttons)
		this.addAnimate(div_el)
		elem.appendChild(div_el);
		await new Promise(resolve => setTimeout(resolve, 20));
		div_el.removeAttribute("style");

		if (autohide){
			hide_notification(div_el, ms)
		}
		await new Promise(resolve => setTimeout(resolve, 400));
	}

	addAnimate(element){
		if (this.animation_in.includes("scale")){
			element.style.transform = "scale(0)"
		}
		if (this.animation_in.includes("scale-right")){
			element.style.transformOrigin = "right bottom"
		}
		if (this.animation_in.includes("scale-left")){
			element.style.transformOrigin = "left bottom"
		}
		if (this.animation_in.includes("opacity")){
			element.style.opacity = 0
		}
	}

	async NewNotice(what, text, buttons=null){
		let div = document.createElement('div');
		if (what == "warning") div.className = 'Message Message--orange';
		if (what == "error") div.className = 'Message Message--red';
		if (what == "success") div.className = 'Message Message--green';
		if (what == "info") div.className = 'Message';

		let icon = document.createElement('div');
		icon.className = 'Message-icon';
		let i = document.createElement('i');
		if (what == "warning") i.className = 'fa fa-exclamation';
		if (what == "error") i.className = 'fa fa-times';
		if (what == "success") i.className = 'fa fa-check';
		if (what == "info") i.className = 'fa fa-info';
		icon.appendChild(i);
		div.appendChild(icon);

		let msg_body = document.createElement('div');
		msg_body.className = 'Message-body';
		let p = document.createElement('p');
		p.innerHTML = text;
		msg_body.appendChild(p);
		if (buttons){
			for (let j=0;j<buttons.length;j++){
				let button = document.createElement('button');
				button.className = 'Message-button';
				if (typeof(buttons[j]) == "object"){
					button.innerHTML = buttons[j][0]
					button.onclick = buttons[j][1]
				}
				if (typeof(buttons[j]) == "string"){
					button.innerHTML = buttons[j]
				}
				button.addEventListener("click", function(){hide_notification(div, 0)}, false)
				msg_body.appendChild(button);
			}
		}
		div.appendChild(msg_body);

		let but = document.createElement('div');
		but.className = 'Message-close';
		let i2 = document.createElement('i');
		i2.className = "fa fa-times"
		i2.onclick = function() {
			hide_notification(div, 0);
		}
		but.appendChild(i2);

		div.appendChild(but);
		return div;
	}

}
