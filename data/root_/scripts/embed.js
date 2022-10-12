main()

function checkRoundPage(){
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	if (params.round){
		if (params.round === 'true'){
			document.getElementById("page").style.borderRadius = "30px"
		}
	}
}

function main(){
	checkRoundPage()
	document.title = `${config.artist} - ${config.track_name}`

	if (document.documentElement.getAttribute("theme") == "dark"){
		theme_params = {
			cursorColor: 'green',
			waveColor: 'lightgreen',
			progressColor: 'darkgreen'
		}
		region_color = 'rgb(255, 255, 255, 0.15)'
	}
	else{
		theme_params = {
			cursorColor: '#00B600',
			waveColor: 'darkgreen',
			progressColor: '#00D000'
		}
		region_color = 'rgb(0, 0, 0, 0.15)'
	}

	plugin = []
	if (config.preview_z){
		plugin = [WaveSurfer.regions.create({
			regions: [
				{	
					id: "preview",
					start: config.preview_zone[0],
					end: config.preview_zone[1],
					loop: false,
					drag: false,
					resize: false,
					color: region_color
				}
			]
		})]
	}

	wavesurfer = WaveSurfer.create(Object.assign({
		container: '#waveform',
		height: 30,
		barWidth: 1,
		barHeight: 0.5,
		hideScrollbar: true,
		plugins: plugin
	}, theme_params));

	window.onresize = function(){wavesurfer.drawBuffer();}

	if(!config.audio_preview){
		document.getElementById("player").style.display = "none";
	}
	else{
		try{
			wavesurfer.load(config.audio_preview);
			wavesurfer.on('ready',_=>{
				document.getElementById("play_pause").style.display = "block"
				setTimeout(function(){
				document.getElementById("play_pause").style.opacity = 1
				document.getElementById("player").style.opacity = 1
			  }, 1)
			})
		}catch{
			document.getElementById("player").style.display = "none";
		}
	}
	

	/* Hide time stamps */
	hide_time = (typeof config.show_time === 'undefined') ? true : !config.show_time;
	config.animate_time = false;
	if (config.animate_time && config.show_time){
		hide_time = true;
		tracking()
	}
	if (!hide_time){
		document.getElementById("time-current").style.display = "block"
		document.getElementById("time-total").style.display = "block"
		tracking()
	}
}

function tracking(){
	function setCurrent(init=false){
		if (init){
			totalSeconds = Math.round(wavesurfer.getDuration());
			minutes = Math.floor(totalSeconds / 60);
			seconds = (totalSeconds % 60).toString().padStart(2, 0);
			string = minutes + ":" + seconds
			document.getElementById('time-total').innerText = string
		}
		else{
			totalSeconds = Math.round(wavesurfer.getCurrentTime());
			minutes = Math.floor(totalSeconds / 60);
			seconds = (totalSeconds % 60).toString().padStart(2, 0);
			string = minutes + ":" + seconds
			document.getElementById('time-current').innerText = string
		}
	}

	wavesurfer.on('ready', function (){
		setCurrent(true)
		document.getElementById('time-current').innerText = "0:00";
		wavesurfer_isReady = true;
	})

	wavesurfer.on('seek', function() {
		setCurrent()
	})
	wavesurfer.on('audioprocess', function() {
		if(wavesurfer.isPlaying()) {
			setCurrent()
		}
	});
}

region_play = false;
function play(e){
	if (wavesurfer_isReady){
		if (wavesurfer.isPlaying()){
			e.target.className = "far fa-play-circle"
			e.target.title = LANG.player_play
			wavesurfer.pause()
		}
		else{
			if (config.preview_z && !region_play){
				region_play = true;
				wavesurfer.regions.list["preview"].play()
				wavesurfer.on('pause', function() {
					if (config.preview_z){
						if (Math.round(wavesurfer.getCurrentTime()*100)/100 == config.preview_zone[1]){
							region_play = false;
							e.target.className = "far fa-play-circle"
							e.target.title = LANG.player_play
							wavesurfer.pause()
						}
					}
				});
				wavesurfer.on('region-out', function() {
					region_play = false;
					e.target.className = "far fa-play-circle"
					e.target.title = LANG.player_play
					wavesurfer.pause()
				});
			}
			else{
				wavesurfer.play()
			}
			e.target.className = "far fa-pause-circle"
			e.target.title = LANG.player_stop
			wavesurfer.on('finish', function (){
				e.target.className = "far fa-play-circle"
				e.target.title = LANG.player_play
			})
		}
	}
}