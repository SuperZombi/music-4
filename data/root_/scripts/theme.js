if (JSON.parse(localStorage.getItem('hard-anim')) == false){}
else{
	let currentMonth = new Date().getMonth() + 1;

	if (currentMonth >= 9 && currentMonth <= 11){
		/* Leaves */
		(function leaves_(){
			if (typeof leaves_area !== 'undefined'){
				var lea = document.createElement("link")
				lea.rel = "stylesheet"
				lea.setAttribute("href", "/root_/styles/leaves.css");
				document.head.appendChild(lea)
				var scr = document.createElement("script")
				scr.setAttribute("src", "/root_/scripts/leaves.js");
				document.head.appendChild(scr)   
			}
			else{
				setTimeout(function(){leaves_()}, 500)
			}
		})()
		/**/
	}
	else if (currentMonth >= 12 || currentMonth <= 2){
		/* Snowflakes */
		(function snowflakes(){
			if (typeof leaves_area !== 'undefined'){
				var lea = document.createElement("link")
				lea.rel = "stylesheet"
				lea.setAttribute("href", "/root_/styles/snowfall.css");
				document.head.appendChild(lea)
				document.getElementById("leaves_area").innerHTML = `
					<snowfall style="height:inherit;position:absolute;color:#43c7fa;">
						${'<snowflake><span>❄</span></snowflake>'.repeat(20)}
						${'<snowflake><span>•</span></snowflake>'.repeat(20)}
						${'<snowflake><span>.</span></snowflake>'.repeat(10)}
					</snowfall>
				`
				// lights()
			}
			else{
				setTimeout(function(){snowflakes()}, 500)
			}
		})()
		/**/

		let currentDate = new Date().getDate();
		if ((currentMonth == 12 && currentDate >= 24) || (currentMonth == 1 && currentDate <= 7)){
			/* Lights */
			(function lights(){
					var lea = document.createElement("link")
					lea.rel = "stylesheet"
					lea.setAttribute("href", "/root_/styles/lights.css");
					document.head.appendChild(lea)
					document.getElementById("leaves_area").innerHTML += `
			        <ul class="line">
			            <li class="red"></li>
			            <li class="yellow"></li>
			            <li class="blue"></li>
			            <li class="pink"></li>
			            <li class="red"></li>
			            <li class="green"></li>
			            <li class="blue"></li>
			            <li class="yellow"></li>
			            <li class="red"></li>
			            <li class="pink"></li>
			            <li class="blue"></li>
			            <li class="yellow"></li>
			            <li class="red"></li>
			            <li class="green"></li>
			            <li class="blue"></li>
			            <li class="yellow"></li>
			            <li class="red"></li>
			            <li class="pink"></li>
			            <li class="green"></li>
			            <li class="blue"></li>
			            <li class="pink"></li>
			            <li class="red"></li>
			            <li class="green"></li>
			            <li class="blue"></li>
			        </ul>
					`
			})()
			/**/
		}
	}
	else{
		/* Water */
		(function water(){
			if (typeof leaves_area !== 'undefined'){
				var lea = document.createElement("link")
				lea.rel = "stylesheet"
				lea.setAttribute("href", "/root_/styles/water.css");
				document.head.appendChild(lea)
				document.getElementById("leaves_area").innerHTML = `
					<div class="Ocean">
						<svg class="Wave" viewBox="0 0 12960 1120">
							<defs>
								<linearGradient id="gradient"> 
									<stop offset="0%" stop-color="#4FC3F7">
										<animate attributeName="stop-color" values="#008DCC; #4FC3F7; #008DCC" dur="8s" repeatCount="indefinite"></animate>
									</stop>
									<stop offset="100%" stop-color="#008DCC">
										<animate attributeName="stop-color" values="#008DCC; #4FC3F7; #008DCC" dur="8s" repeatCount="indefinite"></animate>
									</stop>
								</linearGradient>
							</defs>
							<path fill="url(#gradient)" d="M9720,160C8100,160,8100,0,6480,0S4860,160,3240,160,1620,0,0,0V1120H12960V0C11340,0,11340,160,9720,160Z">
								<animate dur="6s" repeatCount="indefinite" attributeName="d" values="
									M9720,160C8100,160,8100,0,6480,0S4860,160,3240,160,1620,0,0,0V1120H12960V0C11340,0,11340,160,9720,160Z;
									M9720,0C8100,0,8100,160,6480,160S4860,0,3240,0,1620,160,0,160v800H12960V160C11340,160,11340,0,9720,0Z;
									M9720,160C8100,160,8100,0,6480,0S4860,160,3240,160,1620,0,0,0V1120H12960V0C11340,0,11340,160,9720,160Z"/>
							</path>
						</svg> 
					</div>
				`
			}
			else{
				setTimeout(function(){water()}, 500)
			}
		})()
		/**/
	}
}

change_switcher_title()

function change_switcher_title(){
	if (document.documentElement.getAttribute("theme") == "dark"){
		try{ document.getElementById("swicher").title = LANG.light }catch{}
	}
	else{
		try{ document.getElementById("swicher").title = LANG.dark }catch{}
	}
}

function change_switcher(){
	document.documentElement.classList.remove(document.documentElement.getAttribute("theme"))
	if (document.documentElement.getAttribute("theme") == "dark"){
		document.documentElement.classList.add("light")
		document.documentElement.setAttribute("theme", "light")
		window.localStorage.setItem('theme', 'light')
		change_switcher_title()
	}
	else{
		document.documentElement.classList.add("dark")
		document.documentElement.setAttribute("theme", "dark")
		window.localStorage.setItem('theme', 'dark')
		change_switcher_title()
		themeEngine()
	}
	setTimeout(function(){try{
		darking_images()
	}catch{}
	}, 300)
}
