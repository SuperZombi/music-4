from enum import Enum

class Errors(Enum):
	incorrect_name_or_password = {
		'en': "The username or password you entered is incorrect!",
		'ru': "Неверное имя пользователя или пароль!",
		"uk": "Неправильне ім'я користувача або пароль!"
	}
	forbidden_character = {
		'en': "Forbidden character in nickname!",
		'ru': "Запрещённый символ в нике!",
		"uk": "Заборонений символ в імені!"
	}
	track_forbidden_character = {
		'en': "Forbidden character in track name!",
		'ru': "Запрещённый символ в названии трека!",
		"uk": "Заборонений символ у назві треку!"
	}
	user_dont_exist = {
		'en': "This user does not exist!",
		'ru': "Такого пользователя не существует!",
		"uk": "Такого користувача не існує!"
	}
	name_already_taken = {
		'en': "This nickname is already taken!",
		'ru': "Этот ник уже занят!",
		"uk": "Це ім'я вже зайняте!"
	}
	track_already_exists = {
		'en': "Track already exists!",
		'ru': "Трек уже существует!",
		"uk": "Трек вже існує!"
	}
	track_dont_exists = {
		'en': "This track does not exist!",
		'ru': "Этого трека не существует!",
		"uk": "Цього треку не існує!"
	}	
	creating_folder_error = {
		'en': "Error creating folder on server! A similar name with a different case is already taken.",
		'ru': "Ошибка создания папки на сервере! Аналогичное имя с другим регистром уже занято.",
		"uk": "Помилка створення папки на сервері! Аналогічне ім'я з іншим регістром вже зайняте."
	}
	invalid_parameters = {
		'en': "Invalid parameters!",
		'ru': "Неверные параметры!",
		"uk": "Неправильні параметри!"
	}
	error_working_files = {
		'en': "Error while working with files. Please contact the administrator.",
		'ru': "Ошибка при работе с файлами. Пожалуйста, обратитесь к администратору.",
		"uk": "Помилка під час роботи з файлами. Будь ласка, зверніться до адміністратора."
	}
	file_is_too_big = {
		'en': "The file is too big!",
		'ru': "Файл слишком большой!",
		"uk": "Файл завеликий!"
	}
	wrong_file_format = {
		'en': "Wrong file format.",
		'ru': "Неправильный формат файла.",
		'uk': "Неправильний формат файлу."
	}
	you_are_banned = {
		'en': "You are banned!",
		'ru': "Вы забанены!",
		'uk': "Ви забанені!"
	}
	too_many_wrong_attempts = {
		'en': "Too many wrong attempts.",
		'ru': "Слишком много неправильных попыток.",
		'uk': "Забагато неправильних спроб."
	}
	bonus_code_expired = {
		'en': "Bonus code has expired.",
		'ru': "Срок действия бонус-кода истек.",
		'uk': "Термін дії бонус-коду закінчився"
	}
	bonus_code_already_used = {
		'en': "Bonus code already used.",
		'ru': "Бонус-код уже использован.",
		'uk': "Бонус-код вже використано."
	}
