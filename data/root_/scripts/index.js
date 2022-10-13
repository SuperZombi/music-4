main()

window.onresize = function(){ overflowed() }
window.orientationchange = function(){ overflowed() }
window.onscroll = function(){showScrollTop(); footer_anim();}

async function main(){
	let args = {
		"sort_method": localStorage.getItem("sort_method")
	};
	let asArray = Object.entries(args);
	let filtered = asArray.filter(([key, value]) => value);
	let args_filtered = Object.fromEntries(filtered);

	fetch('/api/get_tracks', {
		method: 'POST',
		body: JSON.stringify({
			...args_filtered
		}), headers: {'Content-type': 'application/json; charset=UTF-8'}
	}).then(res => res.json()).then(async answer => {
		await addNewCategory(LANG.all, answer.tracks)
		overflowed()
	})

	ItcSlider.createInstances();


	// getAllGenres().forEach(async function(genre){
	// 	await addNewCategory(genre, sortByDate(getAllTracksByGenre(genre)))
	// })

	// getAllAuthors().forEach(async function(author){
	// 	await addNewCategory(author, sortByDate(getAllAuthorTracks(author)), bd[author].path)
	// })

	// await addNewCategory(LANG.all, sortByDate("all"))
	footer_anim()
}



function showScrollTop(){
	if (window.scrollY > 200){
		document.getElementById("toTop").style.bottom = "10px"
	}
	else{
		document.getElementById("toTop").style.bottom = "-50%"
	}
}
function footer_anim(){
	var timer;
	var footer_ = document.getElementById("footer");
	if (window.scrollY < 50){
		if (timer){
			clearTimeout(timer);
		}
		footer_.style.position = "fixed"
		footer_.style.bottom = "0"
		footer_.style.padding = "10px 0"
		footer_.style.opacity = "0.9"
		footer_.getElementsByTagName("div")[0].style.marginTop = "10px"
	}
	else{
		footer_.style.bottom = "-25%"
		footer_.style.padding = ""
		footer_.style.opacity = ""
		footer_.getElementsByTagName("div")[0].style.marginTop = ""
		timer = setTimeout(function(){footer_.style.position = "";}, 250)
	}
	setTimeout(function(){footer_anim()}, 250)
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
async function addNewCategory(category_title, tracks, href){
	await new Promise((resolve, reject) => {
		var html = ""
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

		let category_el = document.createElement('div');
		if (href){
			category_el.className = "category";
		}
		else{
			category_el.className = "category flexable";
		}

		let category_title_el = document.createElement('div');
		category_title_el.className = "category_title";
		if (href){
			category_title_el.innerHTML = `<a href="${href}">${category_title}</a>`;
		}
		else{
			category_title_el.innerHTML = category_title
		}

		let category_body_el = document.createElement('div');
		category_body_el.className = "category_body";
		category_body_el.innerHTML = html;


		category_el.appendChild(category_title_el);
		category_el.appendChild(category_body_el);
		document.getElementById("main_page").appendChild(category_el);

		// let last_element = category_body_el.lastElementChild
		// if (href){
		// 	category_body_el.onscroll = _=>{
		// 		if (Visible(last_element)){
		// 			on_visible(last_element)
		// 		}
		// 	}
		// }
		// else{
		// 	window.onscroll = _=>{
		// 		if (Visible(last_element)){
		// 			on_visible(last_element)
		// 		}
		// 	}
		// }
		resolve()
	});
}

function on_visible(element){
	console.log(element)
}


function Visible(target){
	var targetPosition = {
      top: window.pageYOffset + target.getBoundingClientRect().top,
      left: window.pageXOffset + target.getBoundingClientRect().left,
      right: window.pageXOffset + target.getBoundingClientRect().right,
      bottom: window.pageYOffset + target.getBoundingClientRect().bottom
    },
    // Получаем позиции окна
    windowPosition = {
      top: window.pageYOffset,
      left: window.pageXOffset,
      right: window.pageXOffset + document.documentElement.clientWidth,
      bottom: window.pageYOffset + document.documentElement.clientHeight
    };

	if (targetPosition.bottom > windowPosition.top && // Если позиция нижней части элемента больше позиции верхней чайти окна, то элемент виден сверху
		targetPosition.top < windowPosition.bottom && // Если позиция верхней части элемента меньше позиции нижней чайти окна, то элемент виден снизу
		targetPosition.right > windowPosition.left && // Если позиция правой стороны элемента больше позиции левой части окна, то элемент виден слева
		targetPosition.left < windowPosition.right) { // Если позиция левой стороны элемента меньше позиции правой чайти окна, то элемент виден справа
		// Если элемент полностью видно, то запускаем следующий код
		return true;
		console.log('Вы видите элемент :)');
	} else {
		// Если элемент не видно, то запускаем этот код
		return false;
	};
};


// function getAllAuthors(){
// 	return Object.keys(bd)
// }
// function getAllAuthorTracks(author, obj=true){
// 	if (obj){
// 		var tracks = bd[author].tracks
// 		var tracks_obj = []
// 		Object.keys(tracks).forEach(function(e){
// 			var _temp = Object.assign({"author":author,"track":e, "href":`${bd[author].path}/${tracks[e].path}`}, tracks[e])
// 			tracks_obj.push(_temp)
// 		})
// 		return tracks_obj
// 	}
// 	return Object.keys(bd[author].tracks)
// }
// function getAllGenres(){
// 	ganres = []
// 	Object.keys(bd).forEach(function(e){
// 		let tmp = bd[e].tracks
// 		Object.keys(tmp).forEach(function(el){
// 			if (!ganres.includes(tmp[el].genre)){
// 				ganres.push(tmp[el].genre);
// 			}
// 		})
// 	})
// 	return ganres
// }
// function getAllTracksByGenre(genr, full=true){
// 	/* returns array with tracks and them authors */
// 	var tracks = []
// 	Object.keys(bd).forEach(function(e){
// 		let tmp = bd[e].tracks
// 		Object.keys(tmp).forEach(function(el){
// 			if (tmp[el].genre == genr){
// 				let track = el
// 				let author = e
// 				if (full){
// 					tracks.push(Object.assign({"author":author,"track":track, "href":`${bd[author].path}/${tmp[el].path}`}, tmp[el]))
// 				}
// 				else{
// 					tracks.push({"author":author, "track":track})
// 				}
// 			}
// 		})
// 	})
// 	return tracks
// }
// function last_updates(days=7){
// 	var all_tracks = []
// 	var authors = getAllAuthors()
// 	var now = new Date()
// 	Object.keys(authors).forEach(function(e){
// 		var author = authors[e]
// 		var info = getAllAuthorTracks(author)
// 		Object.keys(info).forEach(function(e){
// 			var tmp = info[e].date.split(".")
// 			var x = new Date(tmp[2], tmp[1]-1, tmp[0])
// 			var diff = Math.floor((now - x) / (1000 * 60 * 60 * 24))
// 			if (diff < days){
// 				var track_name = e
// 				var track_info = info[e]
// 				all_tracks.push( Object.assign({"author":author, "track":track_name}, track_info) )
// 			}
// 		})
// 	})
// 	return all_tracks
// }
// function sortByDate(what){
// 	if (what === "all")
// 	{
// 		var all_tracks = []
// 		var authors = getAllAuthors()
// 		Object.keys(authors).forEach(function(e){
// 			var author = authors[e]
// 			var info = getAllAuthorTracks(author)
// 			Object.keys(info).forEach(function(e){
// 				var track_name = e
// 				var track_info = info[e]
// 				all_tracks.push( Object.assign({"author":author, "track":track_name}, track_info) )
// 			})
// 		})
// 		return sortByDate(all_tracks)
// 	}
// 	else{
// 		what.forEach(function(e){
// 			var tmp = e.date.split(".")
// 			var x = new Date(tmp[2], tmp[1]-1, tmp[0])
// 			e.date = x
// 		})
// 		return what.sort((a, b) => b.date - a.date)
// 	}
// }
