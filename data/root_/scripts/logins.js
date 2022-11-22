var icons = {
	"pc": `<svg viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg"><path d="m553.59 198.41h-355.18c-7.8516 0-15.379 3.1172-20.93 8.668s-8.6719 13.078-8.6719 20.93v236.79c0 7.8516 3.1211 15.379 8.6719 20.93 5.5508 5.5508 13.078 8.6719 20.93 8.6719h126.09c-5.293 8.6602-13.059 15.531-22.297 19.73-9.0781 5.5234-17.758 10.656-19.734 19.734-0.47266 6.2109 2.0117 12.281 6.7109 16.375 1.9805 2.2656 4.8867 3.5 7.8906 3.3555h157.86c2.6055-0.035156 5.0859-1.1016 6.9102-2.9609 4.8867-4.1367 7.4609-10.391 6.9062-16.77-1.1836-9.4727-9.8672-14.602-19.734-19.734-9.2383-4.1992-17.008-11.07-22.297-19.73h126.88c7.8516 0 15.379-3.1211 20.93-8.6719 5.5508-5.5508 8.668-13.078 8.668-20.93v-236.79c0-7.8516-3.1172-15.379-8.668-20.93-5.5508-5.5508-13.078-8.668-20.93-8.668zm9.8672 236.79h-374.92v-207.19c0-5.4492 4.418-9.8672 9.8672-9.8672h355.18c2.6172 0 5.125 1.0391 6.9766 2.8906 1.8516 1.8516 2.8906 4.3594 2.8906 6.9766z"/></svg>`,
	"smartphone": `<svg viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg"><path d="m463.81 168.81h-175.62c-10.371 0.30078-20.238 4.5508-27.574 11.891-7.3398 7.3359-11.594 17.203-11.891 27.574v333.48c0.29688 10.375 4.5508 20.238 11.891 27.578 7.3359 7.3359 17.203 11.59 27.574 11.887h175.62c10.371-0.29688 20.238-4.5508 27.574-11.887 7.3398-7.3398 11.59-17.203 11.891-27.578v-332.49c-0.046875-10.543-4.1914-20.66-11.555-28.207-7.3633-7.5469-17.371-11.938-27.91-12.246zm-107.54 19.734h39.465c5.4492 0 9.8672 4.418 9.8672 9.8672 0 5.4492-4.418 9.8633-9.8672 9.8633h-39.465c-5.4492 0-9.8672-4.4141-9.8672-9.8633 0-5.4492 4.418-9.8672 9.8672-9.8672zm19.734 374.92h-0.003906c-5.2305 0-10.25-2.0781-13.953-5.7812-3.6992-3.6992-5.7773-8.7188-5.7773-13.953 0-5.2305 2.0781-10.25 5.7773-13.953 3.7031-3.6992 8.7227-5.7773 13.953-5.7773 5.2344 0 10.254 2.0781 13.953 5.7773 3.7031 3.7031 5.7812 8.7227 5.7812 13.953 0 5.2344-2.0781 10.254-5.7812 13.953-3.6992 3.7031-8.7188 5.7812-13.953 5.7812zm88.797-59.199h-177.59l-0.003906-276.25h177.59z"/></svg>`,
	"other": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38"><path d="M29.5 24.797C30.454 23.077 31 21.1 31 19s-.546-4.077-1.5-5.797v-.216h-.132C27.288 9.413 23.425 7 19 7 12.383 7 7 12.383 7 19s5.383 12 12 12c4.425 0 8.288-2.413 10.368-5.987h.132v-.216zm-20.557-4.85h3.571c.072 1.087.267 2.149.581 3.172H9.781a10.05 10.05 0 0 1-.838-3.172zm16.543-1.894a13.993 13.993 0 0 0-.581-3.172h3.314c.442.986.733 2.052.838 3.172h-3.571zm-1.902 0h-3.637V14.88h2.957c.367 1.014.595 2.078.68 3.172zm-3.637-5.066v-2.702a12.57 12.57 0 0 1 2.08 2.702h-2.08zm-1.894-2.702v2.702h-2.08a12.583 12.583 0 0 1 2.08-2.702zm0 4.596v3.172h-3.637c.085-1.094.313-2.158.68-3.172h2.957zm-5.539 3.172h-3.57c.104-1.12.395-2.186.837-3.172h3.314a14.028 14.028 0 0 0-.581 3.172zm1.902 1.894h3.637v3.172h-2.957a12.063 12.063 0 0 1-.68-3.172zm3.637 5.066v2.702a12.581 12.581 0 0 1-2.08-2.701h2.08zm1.894 2.702v-2.701h2.08a12.612 12.612 0 0 1-2.08 2.701zm0-4.596v-3.172h3.637a12.063 12.063 0 0 1-.68 3.172h-2.957zm5.539-3.172h3.57a10.05 10.05 0 0 1-.837 3.172h-3.313a13.99 13.99 0 0 0 .58-3.172zm1.616-6.96h-2.939a14.31 14.31 0 0 0-2.583-3.746 10.116 10.116 0 0 1 5.522 3.746zM16.42 9.241a14.326 14.326 0 0 0-2.583 3.746h-2.939a10.116 10.116 0 0 1 5.522-3.746zm-5.522 15.772h2.939a14.353 14.353 0 0 0 2.583 3.746 10.113 10.113 0 0 1-5.522-3.746zm10.682 3.746a14.326 14.326 0 0 0 2.583-3.746h2.939a10.113 10.113 0 0 1-5.522 3.746z"/></svg>`
}

function main(){
	init()

	let xhr = new XMLHttpRequest();
	xhr.open("POST", '/api/logins')
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.onload = function() {
		if (xhr.status == 200){ 
			let answer = JSON.parse(xhr.response);
			if (answer.successfully){
				answer["logins"].forEach(function(key){
					let temp = {}
					if (key[1]["time"]){
						temp["time"] = formatTime(key[1]["time"] * 1000)
					}
					let location = [key[1]["city"], key[1]["region"], key[1]["country"]]
					location = [...new Set(location.filter(x=>x))]
					if (location.length > 0){
						temp["location"] = location
					}
					temp["location"] = [...location, key[0]]
					temp['device'] = [key[1]["os"], key[1]["device"]]

					temp['icon'] = icons[key[1]["type"]] ? icons[key[1]["type"]] : icons["other"]
					if (key[1]["current"]){
						temp["current"] = true;
					}
					addDevice(temp, key[0])
				})
				document.getElementById("preloader").style.display = "none"
			}
		}
	}
	xhr.send(JSON.stringify({'name': localStorage.getItem("userName"), "password": localStorage.getItem("userPassword")}))
}
main();

function formatTime(unix_time){
	function pad(input, length) {
		return (Array(length + 1).join('0') + input).slice(-length);
	}
	let date = new Date(unix_time)
	return [`${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}`,
			`${pad(date.getDate(), 2)}.${pad(date.getMonth() + 1, 2)}.${date.getFullYear()}`]
}



function init(){
	document.getElementById("preloader").style.display = "block"
	let h1 = document.createElement("h1")
	h1.innerHTML = LANG.account_logins
	document.body.appendChild(h1)
	let div = document.createElement("div")
	div.id = "mainDiv"
	let table = document.createElement("table")
	table.id = "mainTable"
	div.appendChild(table)
	document.body.appendChild(div)
}

function addDevice(info, ip){
	function addSub(arr){
		let string = ""
		arr.forEach(function(e){
			if (Array.isArray(e)){
				e = e.join(", ")
			}
			string += `<div>${e}</div>`
		})
		return string
	}
	let div = document.createElement("div")
	div.className = "device"
	let tr = document.createElement("tr")
	tr.innerHTML = `
		<td>${info["icon"]}</td>
		<td>${addSub(info["device"])}</td>
		<td>${info["location"] ? `${addSub(info["location"])}` : ''}</td>
		<td>${addSub(info["time"])}</td>
	`
	if (info["current"]){
		div.classList.add("current")
	}
	tr.onclick=_=>{
		if (div.querySelector(".options")){
			div.querySelector(".options").remove()
		}
		else{
			document.getElementById("mainTable").querySelectorAll(".options").forEach(function(e){e.remove()})
			window.navigator.vibrate(50);

			let tr_opt = document.createElement("tr")
			tr_opt.className = "options"
			td = document.createElement("td")
			td.colSpan = 4;
			let button = document.createElement("button")
			button.innerHTML = LANG["delete"]
			button.onclick=_=>{
				fetch('/api/delete_login', {
					method: 'POST',
					body: JSON.stringify({
						'name': localStorage.getItem("userName"), "password": localStorage.getItem("userPassword"),
						'ip': ip }),
					headers: {'Content-type': 'application/json; charset=UTF-8'}
				})
				.then(res => res.json()).then(data => {
					if (data["successfully"]){
						div.remove()
					}
				});
			}
			td.appendChild(button)
			tr_opt.appendChild(td)
			div.appendChild(tr_opt)
		}
	}
	div.appendChild(tr)
	document.getElementById("mainTable").appendChild(div)
}
