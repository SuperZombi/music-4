main()

var file_limits = {
    'image': {'size': 2097152, 'resolution': 1280},
    'audio': {'size': 10485760, 'bitrate': 192}
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}

function checkPhoto(target, compress=true) {
    document.getElementById("photoLabel").innerHTML = "";

    if (file && file['type'].split('/')[0] != 'image'){
        document.getElementById("photoLabel").innerHTML += `${LANG.wrong_file_format} <br>`;
        target.value = '';
        return
    }

    var _URL = window.URL || window.webkitURL;
    var file = target.files[0];
    var img = new Image();
    var objectUrl = _URL.createObjectURL(file);
    img.onload = function () {
        if (this.width > file_limits.image.resolution || this.height > file_limits.image.resolution){
            if (local_storage["resize-images"] != undefined && JSON.parse(local_storage["resize-images"])){
                var onSuccessResize = (image)=>{
                    let container = new DataTransfer(); 
                    container.items.add(image);
                    target.files = container.files;
                    notice.Success(LANG.file_resized)
                    checkPhoto(target)
                }
                document.getElementById("photoLabel").innerHTML = LANG.start_resize
                ResizeRequest(file, onSuccessResize, ...resizeWithRatio(this.width, this.height, file_limits.image.resolution, file_limits.image.resolution));
            }
            else{
                document.getElementById("photoLabel").innerHTML += `${LANG.max_res} <i style='color:red'>${file_limits.image.resolution}x${file_limits.image.resolution}</i>! <br>`;
                target.value = '';
            }
        }
        else{
            if(file.size > file_limits.image.size) {
                if (local_storage["resize-images"] != undefined && JSON.parse(local_storage["resize-images"]) && compress){
                    var onSuccessCompress = (image)=>{
                        let container = new DataTransfer(); 
                        container.items.add(image);
                        target.files = container.files;
                        notice.Success(LANG.file_resized)
                        checkPhoto(target, false)
                    }
                    document.getElementById("photoLabel").innerHTML = LANG.start_resize
                    ResizeRequest(file, onSuccessCompress, this.width, this.height);
                }
                else{
                    document.getElementById("photoLabel").innerHTML += `${LANG.max_img_s} <i style='color:red'>${formatBytes(file_limits.image.size)}</i>! <br>`;
                    target.value = '';
                }
            }
        }
        _URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
}

function checkAudio(target) {
    document.getElementById("audioLabel").innerHTML = "";
    var _URL = window.URL || window.webkitURL;
    var file = target.files[0];
    var audio = new Audio();
    var objectUrl = _URL.createObjectURL(file);
    var all_bitrates = [128, 192, 320]
    audio.addEventListener("loadedmetadata", function(){
        var kbit=file.size/128;
        var kbps= Math.ceil(Math.round(kbit/audio.duration)/16)*16;

        var differences = all_bitrates.map(e=>Math.abs(e-kbps));
        let min_index = differences.indexOf(Math.min(...differences));
        var bitrate_average = all_bitrates[min_index];

        if (bitrate_average > file_limits.audio.bitrate){
            document.getElementById("audioLabel").innerHTML += `${LANG.max_bitrate} <i style='color:red'>${file_limits.audio.bitrate}kbps</i>! <br>`;
            target.value = '';
        }
        _URL.revokeObjectURL(objectUrl);
    })
    audio.src = objectUrl;

    if(file.size > file_limits.audio.size) {
        document.getElementById("audioLabel").innerHTML += `${LANG.max_audio_s} <i style='color:red'>${formatBytes(file_limits.audio.size)}</i>! <br>`;
        target.value = '';
    }

    if (file && file['type'].split('/')[0] != 'audio'){
        document.getElementById("audioLabel").innerHTML += `${LANG.wrong_file_format} <br>`;
        target.value = '';
    }
    if (file && file.name.split('.').at(-1) != 'mp3'){
        document.getElementById("audioLabel").innerHTML += `${LANG.wrong_file_format} <br>`;
        target.value = '';
    }
}


function ResizeRequest(file, callback, desired_W=1280, desired_H=1280){
    if (file.type.split('/')[0] != 'image'){
        console.error('File to resize is not image.')
    }
    var new_name = file.name.split('.').slice(0, -1).join() + ".jpg"
    var onSuccess = function (newImage){
        fetch(newImage)
        .then(res => res.blob())
        .then(resizedImage => {
            var file = new File([resizedImage], new_name, {type: 'image/jpeg'});
            callback(file)
        })
    };
    var onError = (e)=>{ console.error(e) }

    var reader = new FileReader();
    reader.onload = function (readerEvent) {
        let image_src = readerEvent.target.result;
        resizeImage(image_src, desired_W, desired_H, 0.9, onSuccess, onError)
    }
    reader.readAsDataURL(file);
}

function resizeImage(imageUrl, newWidth, newHeight, quality, onReady, onError) {
    var image = document.createElement('img');
    image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, newWidth, newHeight);
        try {
            // quality (from 0 to 1.0)
            var dataUrl = canvas.toDataURL('image/jpeg', quality);
            onReady(dataUrl);
        } catch (e) {
            if (onError) {
                onError('Image saving error.');
            }
        }
    };
    image.onerror = function() {
        if (onError) {
            onError('Image loading error.');
        }
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


function openLink(target){
    var link = target.parentElement.querySelector("input").value;
    if (link){
        window.open(link, '_blank');
    }
}

var hosts = {
    'spotify': ["https://open.spotify.com"],
    'youtube_music': ["https://music.youtube.com"],
    'youtube': ["https://youtu.be", "https://www.youtube.com"],
    'apple_music': ["https://music.apple.com"],
    'deezer': ["https://deezer.page.link"],
    'soundcloud': ["https://soundcloud.com"],
    'newgrounds': ["https://www.newgrounds.com"]
}
async function checkLink(target){
    if (target.value){
        try{
            const domain = (new URL(target.value)).origin;
            if (hosts[  target.id.split("form_")[1]  ].includes(domain)){
                target.style.border = "3px solid lightgreen";
                target.style.boxShadow = "0 0 10px lightgreen";
            }
            else{
                target.style.border = "3px solid red";
                target.style.boxShadow = "0 0 10px red";
            }
        }
        catch{
            target.style.border = "3px solid red";
            target.style.boxShadow = "0 0 10px red";
        }
    }
    else{
        target.style.border = "";
        target.style.boxShadow = "";
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

function sendForm(form){
    document.getElementById('loading_waveform').parentNode.style.display = "table-cell";

    var arr = form.querySelectorAll("input");
    var formData = new FormData();

    var final = {};
    arr.forEach(function(e){
        if (e.id && e.value){
            if (e.files){
                formData.append(e.id.split("form_")[1], e.files.item(0));
                Object.assign(final, {
                    [e.id.split("form_")[1]] : e.files.item(0).name
                });
            }
            else if (e.type == "checkbox"){
                formData.append(e.id.split("form_")[1], e.checked)
                Object.assign(final, {
                    [e.id.split("form_")[1]] : e.checked
                });
            }
            else{
                formData.append(e.id.split("form_")[1], e.value.trim())
                Object.assign(final, {
                    [e.id.split("form_")[1]] : e.value.trim()
                });
            }
        }
    });

    formData.append('password', local_storage.userPassword)

    let req = new XMLHttpRequest();                          
    req.open("POST", '../api/uploader');
    req.onload = function() {
        if (req.status != 200){notice.Error(LANG.error)}
        else{
            answer = JSON.parse(req.response)
            if (!answer.successfully){
                if (answer.reason == "incorrect_name_or_password"){
                    notice.clearAll()
                    notice.Error(get_decode_error(answer.reason), false, [[LANG.log_out, logout]])
                }
                else{
                    notice.Error(get_decode_error(answer.reason))
                }
            }
            else{
                notice.clearAll()
                notice.Success(LANG.files_uploaded, false, [[LANG.go_to, _=>{
                    window.location.href = "../" + answer.url
                }]])
            }
        }
        document.getElementById('loading_waveform').parentNode.style.display = "none"
    }
    req.onerror = _=> notice.Error(LANG.error);
    req.send(formData);
}

function logout(){
    window.localStorage.removeItem("userName")
    window.localStorage.removeItem("userPassword")
    goToLogin()
}


function goToLogin(){
    let url = window.location.pathname;
    let filename = url.substring(url.lastIndexOf('/')+1);

    let login = new URL("login", window.location.href);
    login.searchParams.append('redirect', filename);

    window.location.href = login.href
}

function main(){
    document.title = `${LANG.new_release} - Zombi Music`
    notice = Notification('#notifications');
    local_storage = { ...localStorage };
    if (local_storage.userName && local_storage.userPassword){
        document.getElementById("form_artist").value = local_storage.userName
    }
    else{
        goToLogin()
    }
    
    document.querySelector(".logout > span > svg").onclick = logout

    if (document.getElementById('myAccount').getElementsByTagName('img')[0].src.split('.').pop() == "svg"){
        try_dark(document.getElementById('myAccount').getElementsByTagName('img')[0])
    }

    if (location.hash == "#limits"){
        document.getElementById("limitations").open = true;
    }

    editInit()
    get_limits()
}

function get_limits(){
    let req = new XMLHttpRequest();                          
    req.open("POST", '/api/get_file_limits');
    req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    req.onload = function() {
        if (req.status == 200){
            answer = JSON.parse(req.response)
            file_limits = answer.limits;
            update_limits();
        }
    }
    req.send(JSON.stringify({'user': local_storage.userName}));
}
function update_limits(){
    let arr = document.getElementById("limits").querySelectorAll("td[data]")
    Object.keys(arr).forEach(function(e){
        let el = arr[e]
        let data = el.getAttribute("data")
        let obj = data.split(":")

        let value = file_limits[obj[0]][obj[1]];
        if (obj[1] == "size"){
            value = "⩽" + formatBytes(value)
        }
        else if (obj[1] == "extensions"){
            value = value.map(e=>e.replace(".", "")).join("/")
        }
        else if (obj[0] == "image"){
            value = "⩽" + value + "×" + value
        }
        else if (obj[1] == "bitrate"){
            value = "⩽" + value + "kbps"
        }
        el.innerHTML = value
    })
    let image_input = document.getElementById("form_image")
    image_input.accept = file_limits.image.extensions
}

function editInit(){
    const urlSearchParams = new URLSearchParams(window.location.search);
    searchParams = Object.fromEntries(urlSearchParams.entries());
    if (searchParams.edit){
        document.getElementById("formTitle").innerHTML = LANG.edit_track
        document.title = `${LANG.edit} - ${searchParams.edit}`

        let xhr = new XMLHttpRequest();
        xhr.open("POST", `../api/get_track_info`, false)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify({
            'artist': local_storage.userName,
            'track': searchParams.edit
        }))
        if (xhr.status != 200){ notice.Error(LANG.error) }
        else{
            let answer = JSON.parse(xhr.response);
            if (!answer.successfully){ notice.Error(get_decode_error(answer.reason)) }
            else {
                document.getElementById("form_track_name").setAttribute('readonly', true);
                document.getElementById("form_track_name").value = answer.config.track_name;
                document.getElementById("form_genre").value = answer.config.genre;
                document.getElementById("form_image").parentNode.parentNode.style.display = "none"
                document.getElementById("form_image").required = false;
                document.getElementById("form_audio").parentNode.parentNode.style.display = "none"
                document.getElementById("form_audio").required = false;

                document.getElementById("form_preview_z").parentNode.parentNode.style.display = "table-row"
                document.getElementById("form_preview_z").checked = answer.config.preview_z
                document.getElementById("player").parentNode.parentNode.style.display = "table-row"
                document.getElementById("hr_for_preview_zone").style.display = "table-row"
                
                function convertDate(date_str){
                    var tmp = date_str.split(".")
                    var now = new Date(tmp[2], tmp[1]-1, tmp[0])

                    var day = ("0" + now.getDate()).slice(-2);
                    var month = ("0" + (now.getMonth() + 1)).slice(-2);
                    var today = now.getFullYear()+"-"+(month)+"-"+(day);
                    return today;
                }

                document.getElementById("form_release_date").value = convertDate(answer.config.date)
                document.getElementById("form_allow_download").checked = answer.config.allow_download

                if (answer.config.links){
                    Object.keys(answer.config.links).forEach(e=>{
                        document.getElementById("form_" + e).value = answer.config.links[e];
                    })
                }

                var audio_path = "/" + local_storage.userName.toLowerCase().replaceAll(" ", "-") + "/" + searchParams.edit.toLowerCase().replaceAll(" ", "-") + "/" + answer.config.audio_preview;
                var script = document.createElement("script")
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/2.0.4/wavesurfer.min.js"
                script.onload = ()=>{
                    var script2 = document.createElement("script")
                    script2.src = "https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/2.0.4/plugin/wavesurfer.regions.min.js"
                    script2.onload = ()=>{ initPlayer(audio_path, answer.config.preview_zone) }
                    document.head.appendChild(script2);
                }
                document.head.appendChild(script);

                document.getElementById("mainForm").onsubmit = ()=> sendEditedForm(document.getElementById("mainForm"));
            }
        }
    }
}

function initPlayer(audio_path, preview){
    if (document.documentElement.getAttribute("theme")=="dark"){
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
    plugin = [WaveSurfer.regions.create({
        regions: [
            {   
                id: "preview",
                loop: false,
                drag: true,
                resize: true,
                color: region_color
            }
        ]
    })]



    wavesurfer = WaveSurfer.create(Object.assign({
        container: '#waveform',
        height: 80,
        barWidth: 1,
        hideScrollbar: true,
        plugins: plugin
    }, theme_params));
    wavesurfer.load(audio_path);

    window.onresize = function(){setTimeout(function(){wavesurfer.drawBuffer();}, 1000) }
    wavesurfer.on('ready', function (){
        wavesurfer_isReady = true;
        document.getElementById("loading_waveform").style.display = "none";
        document.getElementById("time-current").style.display = "block"
        document.getElementById("time-total").style.display = "block"

        document.getElementById("max-time-total").value = Math.round(wavesurfer.backend.getDuration() * 10)/10
        document.getElementById("time-total").value = Math.min(wavesurfer.backend.getDuration() - 1, 10)
        wavesurfer.regions.list["preview"].end = Math.min(wavesurfer.backend.getDuration() - 1, 10)

        if (preview){
            wavesurfer.regions.list["preview"].start = preview[0]
            wavesurfer.regions.list["preview"].end = preview[1]
            document.getElementById("time-current").value = preview[0]
            document.getElementById("time-total").value = preview[1]
        }
        wavesurfer.drawBuffer();
    })
    wavesurfer.on('region-updated', function (e){
        if (wavesurfer.isPlaying()){
            wavesurfer.pause()
        }
        var start = Math.round(e.start * 10)/10
        var end = Math.round(e.end * 10)/10
        document.getElementById("time-current").value = start
        document.getElementById("time-total").value = end
        wavesurfer.regions.list["preview"].start = start
        wavesurfer.regions.list["preview"].end = end
        wavesurfer.drawBuffer();
        if (region_resizing){
            clearTimeout(region_resizing)
        }
        region_resizing = setTimeout(function(){
            wavesurfer.regions.list["preview"].start = start
            wavesurfer.regions.list["preview"].end = end
            wavesurfer.drawBuffer();
        }, 10)
    })
}
function change_region(){
    if (wavesurfer.isPlaying()){
        wavesurfer.pause()
    }
    if (!document.getElementById("time-current").value){
        document.getElementById("time-current").value = 0
    }
    if (!document.getElementById("time-total").value){
        document.getElementById("time-total").value = 0
    }
    wavesurfer.regions.list["preview"].start = parseFloat(document.getElementById("time-current").value)
    wavesurfer.regions.list["preview"].end = parseFloat(document.getElementById("time-total").value)
    wavesurfer.drawBuffer();
}
var region_resizing;
wavesurfer_isReady = false;
play_clicked = false;
function play(e){
    if (!play_clicked){
        play_clicked = true;
        if (wavesurfer_isReady){
            if (wavesurfer.isPlaying()){
                e.target.className = "far fa-play-circle"
                e.target.title = LANG.player_play
                wavesurfer.pause()
            }
            else{
                wavesurfer.regions.list["preview"].play()
                setTimeout(function(){
                    wavesurfer.on('region-out', function() {
                        e.target.className = "far fa-play-circle"
                        e.target.title = LANG.player_play
                        wavesurfer.pause()
                    });
                    wavesurfer.on('pause', function() {
                        e.target.className = "far fa-play-circle"
                        e.target.title = LANG.player_play
                    });
                }, 10)
                e.target.className = "far fa-pause-circle"
                e.target.title = LANG.player_stop
                wavesurfer.on('finish', function (){
                    e.target.className = "far fa-play-circle"
                    e.target.title = LANG.player_play
                })
            }
        }
        setTimeout(function(){play_clicked=false}, 10)
    }
}

function setMax(){
    document.getElementById("time-total").value = document.getElementById("max-time-total").value
    change_region()
}
function setMin(){
    document.getElementById("time-current").value = document.getElementById("min-time-total").value
    change_region()
}


function sendEditedForm(form){
    document.getElementById('loading_waveform').parentNode.style.display = "table-cell";
    document.getElementById("player").parentNode.parentNode.style.display = "none"

    var arr = form.querySelectorAll("input");
    var formData = new FormData();

    var final = {};
    arr.forEach(function(e){
        if (e.id && e.value){
            if (e.type == "checkbox"){
                formData.append(e.id.split("form_")[1], e.checked)
                Object.assign(final, {
                    [e.id.split("form_")[1]] : e.checked
                });
            }
            else if (e.id == "time-current" || e.id == "time-total" || e.id == "max-time-total" || e.id == "min-time-total"){}
            else{
                formData.append(e.id.split("form_")[1], e.value.trim())
                Object.assign(final, {
                    [e.id.split("form_")[1]] : e.value.trim()
                });
            }
        }
    });

    formData.append('password', local_storage.userPassword)
    if (final.preview_z){
        Object.assign(final, {
            preview_zone : [parseFloat(document.getElementById("time-current").value),
                            parseFloat(document.getElementById("time-total").value)]
        });
        formData.set("preview_zone", [parseFloat(document.getElementById("time-current").value),
                                      parseFloat(document.getElementById("time-total").value)])
    }

    let req = new XMLHttpRequest();                          
    req.open("POST", '../api/edit_track');
    req.onload = function() {
        if (req.status != 200){notice.Error(LANG.error)}
        else{
            answer = JSON.parse(req.response)
            if (!answer.successfully){
                if (answer.reason == "incorrect_name_or_password"){
                    notice.clearAll()
                    notice.Error(get_decode_error(answer.reason), false, [[LANG.log_out, logout]])
                }
                else{
                    notice.Error(get_decode_error(answer.reason))
                }
            }
            else{
                notice.clearAll()
                notice.Success("OK", false, [[LANG.go_to, _=>{
                    window.location.href = "../" + answer.url
                }]])
            }
        }
        document.getElementById('loading_waveform').parentNode.style.display = "none"
    }
    req.onerror = _=> notice.Error(LANG.error);
    req.send(formData);

    return false;
}