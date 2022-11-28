from enum import Enum
class htmlTemplatesLangs(Enum):
	reset_password = {
		'en': {
			'your_link': 'Your password reset link:',
			'email_ending': 'If you received this email but did not request a password reset, just ignore this email.'
		},
		'ru': {
			'your_link': 'Ваша ссылка для сброса пароля:',
			'email_ending': 'Если вы получили это письмо, но не подавали заявку о сбросе пароля, то просто проигнорируйте данное письмо.'
		}
	}

def track_index(artist, track, image):
	return f'''<!DOCTYPE html><html><head>
	<title>Zombi Music</title>
	<meta name="viewport" content="width=device-width"><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="shortcut icon" href="../../root_/images/logo2.png" type="image/png">
	<!-- og:zone -->
	<meta property="og:image" content="{image}">
	<meta property="og:title" content="{artist} - {track}">
	<meta property="og:description" content="Zombi Music">
	<meta property="og:site_name" content="zombi.music">
	<meta property='og:type' content="music.song">
	<script src="../../root_/scripts/App.js" defer onload='loadApp(`
		<script src="config.json"></script>
		<link rel="stylesheet" href="../../root_/styles/aqua.min.css">
		<link rel="stylesheet" href="../../root_/styles/main.css">
		<link rel="stylesheet" href="../../root_/styles/track.css">
		<link rel="stylesheet" href="../../root_/styles/ripple.css">
		<link href="https://superzombi.github.io/Notification_JS/notifications.css" rel="stylesheet">
		<link href="https://superzombi.github.io/Notification_JS/plugins/simplity.css" rel="stylesheet">
		<script src="https://superzombi.github.io/Notification_JS/notifications.js"></script>
		<link rel="stylesheet" href="../../root_/styles/fontawesome/css/all.min.css">
	`, `
		<script src="../../root_/htmls/header.html"></script>
		<script src="../../root_/htmls/body.html"></script>
		<script src="../../root_/htmls/footer.html"></script>
	`, `
		<script src="../../root_/scripts/theme.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/2.0.4/wavesurfer.min.js" required></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/2.0.4/plugin/wavesurfer.regions.min.js" required></script>
		<script src="../../root_/scripts/ripple.js"></script>
		<script src="../../root_/scripts/main.js"></script>
	`)'></script>
	</head><body></body></html>'''

def track_embed():
	return f'''<!DOCTYPE html><html><head>
	<title>Zombi Music</title>
	<meta name="viewport" content="width=device-width">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<script src="../../root_/scripts/App.js" defer onload='loadApp(`
		<script src="config.json"></script>
		<link rel="stylesheet" href="../../root_/styles/main.css">
		<link rel="stylesheet" href="../../root_/styles/track.css">
		<link rel="stylesheet" href="../../root_/styles/embed.css">
		<link rel="stylesheet" href="../../root_/styles/fontawesome/css/all.min.css">
	`, `
		<script src="../../root_/htmls/embed.html"></script>
	`, `
		<script src="https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/2.0.4/wavesurfer.min.js" required></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/2.0.4/plugin/wavesurfer.regions.min.js" required></script>
		<script src="../../root_/scripts/embed.js"></script>
	`, theme_parser="params")'></script>
	</head><body></body></html>'''

def artist_index(name, image="../root_/images/people.svg"):
	return f'''<!DOCTYPE html><html><head>
	<title>Zombi Music</title>
	<meta name="viewport" content="width=device-width"><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="shortcut icon" href="../root_/images/logo2.png" type="image/png">
	<!-- og:zone -->
	<meta property="og:image" content="{image}">
	<meta property="og:title" content="{name}">
	<meta property="og:description" content="Artist">
	<meta property="og:site_name" content="zombi.music">
	<script src="../root_/scripts/App.js" defer onload='loadApp(`
		<link rel="stylesheet" href="../root_/styles/fontawesome/css/all.min.css">
		<link rel="stylesheet" href="../root_/styles/main.css">
		<link rel="stylesheet" href="../root_/styles/artist.css">
	`, `
		<script src="../root_/htmls/header.html"></script>
		<script src="../root_/htmls/body_artist.html"></script>
		<script src="../root_/htmls/footer.html"></script>
	`, `
		<script src="../root_/scripts/theme.js"></script>
		<script src="../root_/scripts/artist.js"></script>
	`)'></script>
	</head><body></body></html>'''


def reset_password(link, lang='en'):
	def break_by_char(text, n):
		return [text[i:i+n] for i in range(0, len(text), n)]

	new = '/<wbr>'.join(link.split("/"))
	new = '?<wbr>'.join(new.split("?"))
	new = '&<wbr>'.join(new.split("&"))
	new = '#<wbr>'.join(new.split("#"))
	arr = new.split("<wbr>")
	new_arr = []
	for i in arr:
		if len(i) > 10:
			x = break_by_char(i, 10)
			new_arr.extend(x)
		else:
			new_arr.append(i)

	final = "<wbr>".join(new_arr)

	if lang in htmlTemplatesLangs.reset_password.value.keys():
		LANG = htmlTemplatesLangs.reset_password.value[lang]
	else:
		LANG = htmlTemplatesLangs.reset_password.value['en']

	html = f'''
		<div style="font-family:sans-serif;text-align:center;">
			<div style="background:#46b2f0;padding-top:20px;">
				<img height="100px" style="background:white;display:block;margin:auto;border-radius:50%;padding:5px;" src="https://raw.githubusercontent.com/SuperZombi/music/main/root_/images/logo.png">
				<h1 style="display:inline-block;color:white;">Zombi Music</h1>
			</div>
			<div>
				<h2>{LANG['your_link']}</h2>
				<div>
					<a href="{link}" style="font-family:monospace;text-decoration:none;display:inline-block;font-size:14pt;background:#00A263;color:white;padding:20px;border-radius:15px;margin:0 2px 0 2px;" target="_blank">{final}</a>
				</div>
				<div style="height:25px;"></div>
			</div>
			<hr>
			<div>
				<h4>{LANG['email_ending']}</h4>
			</div>	
		</div>
	'''
	return html

def ads(img, text, link, description="", button=""):
	return f'''
	<!DOCTYPE html><html><head>
	<title>Zombi Music - ADS</title>
	<meta name="viewport" content="width=device-width"><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="shortcut icon" href="../root_/images/logo2.png" type="image/png">
	<!-- og:zone -->
	<meta property="og:title" content="Ads">
	<meta property="og:site_name" content="zombi.music">
	<script src="../root_/scripts/App.js" defer onload='loadApp(`
		<link rel="stylesheet" href="../root_/styles/fontawesome/css/all.min.css">
		<link rel="stylesheet" href="../root_/styles/main.css">
		<link rel="stylesheet" href="../root_/styles/not_ad_s.css">
	`, ``, ``)'></script>
	</head><body>
	<a id="mainBlock" href="{link}" target="_blank">
		<div id="mainImg" style="background-image: url('ad_s/{img}')"></div>
		<div id="mainText">
			<div>
				<div>{text}</div>
				{f"<div id='description'>{description}</div>" if description else ""}
				{f"<button>{button}</button>" if button else ""}
			</div>
		</div>
	</a>
	</body></html>
	'''