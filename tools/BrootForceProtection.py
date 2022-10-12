import time

class BrootForceProtection():
	database = {}
	@classmethod
	def data(cls):
		return cls.database

	def __init__(self, username, password, ip, func, max_attempts=5, sleep_time=30):
		self.username = username
		self.password = password
		self.ip = ip
		self.func = func
		self.max_attempts = max_attempts
		self.sleep_time = sleep_time

	def __call__(self):
		db = self.data()
		username = self.username
		password = self.password
		ip = self.ip
		func = self.func
		max_attempts = self.max_attempts
		sleep_time = self.sleep_time
		final = {}
		final['successfully'] = False
		final['wait'] = False

		if username in db.keys():
			if ip in db[username].keys():
				if db[username][ip]["amount"] >= max_attempts:
					diff = int( time.time() - db[username][ip]['time'] )
					if diff > sleep_time:
						if func(username, password):
							final['successfully'] = True

							del db[username][ip]
							if len(db[username]) == 0:
								del db[username]

							return final
						db[username][ip]["amount"] = 0
					else:
						final['wait'] = True
						final['sleep'] = sleep_time - diff
						return final
				if func(username, password):
					final['successfully'] = True

					del db[username][ip]
					if len(db[username]) == 0:
						del db[username]

					return final
				db[username][ip]['time'] = int(time.time())
				db[username][ip]["amount"] += 1
			else:
				if func(username, password):
					final['successfully'] = True
					if len(db[username]) == 0:
						del db[username]
					return final
				db[username][ip] = {"time": int(time.time()), "amount": 1}

		else:
			if func(username, password):
				final['successfully'] = True
				return final
			
			db[username] = {}
			db[username][ip] = {"time": int(time.time()), "amount": 1}

		return final