main()

function darking_images(){
	var tmp_ = document.getElementById("support")
	if (tmp_){
		tmp_2 = tmp_.getElementsByTagName("img")
		Object.keys(tmp_2).forEach(function(e){
			try_dark(tmp_2[e])
		})
	}
}

function main(){
	document.title = `Zombi Music - ${LANG.support_title}`
	darking_images()
	if (document.getElementById('myAccount').getElementsByTagName('img')[0].src.split('.').pop() == "svg"){
		try_dark(document.getElementById('myAccount').getElementsByTagName('img')[0])
	}
}