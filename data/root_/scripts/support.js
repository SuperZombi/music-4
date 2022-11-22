main()

function darking_images(){
	var tmp_ = document.getElementById("support")
	if (tmp_){
		tmp_2 = tmp_.getElementsByTagName("img")
		Object.keys(tmp_2).forEach(function(e){
			try_dark(tmp_2[e])
		})
	}
	let mcnt = document.querySelector("#myAccount img")
	if (mcnt){
		let filename = mcnt.src.replace(/^.*[\\\/]/, '')
		if (filename == "people.svg" || filename == "people_dark.svg"){
			try_dark(mcnt)
		}
	}
}

function main(){
	document.title = `Zombi Music - ${LANG.support_title}`
	darking_images()
}
