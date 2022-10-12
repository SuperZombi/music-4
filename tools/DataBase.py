import os
import json

class DataBase():
	__version__ = "0.2.0"
	def __init__(self, file, unique=False):
		self.file = file
		self.unique = unique
		if unique:
			self.data = {}
		else:
			self.data = []

		if os.path.exists(file):
			self.load()
		else:
			if os.path.dirname(file) and not os.path.exists(os.path.dirname(file)):
				os.mkdir(os.path.dirname(file))
			self.save()

	def load(self):
		with open(self.file, 'r', encoding='utf-8') as file:
			self.data = json.loads(file.read())
	def save(self):
		with open(self.file, 'w', encoding='utf-8') as file:
			file.write(json.dumps(self.data, indent=4, ensure_ascii=False))

	def add(self, **args):
		if self.unique:
			unique_key = args[self.unique]
			if unique_key in self.data.keys():
				raise KeyError(f"duplicate key '{unique_key}' found")
			args.pop(self.unique)
			self.data[unique_key] = args
		else:
			self.data.append(args)
		self.save()

	def delete(self, index):
		del self.data[index]
		self.save()

	def find(self, **args):
		keys = list(args.keys())

		if self.unique:
			array = self.data.items()
		else:
			array = enumerate(self.data)

		for id, item in array:
			return_this = False
			for key in keys:
				if key in item.keys() and item[key] == args[key]:
					return_this = True
				else:
					return_this = False
					break
			if return_this:
				return id

	def find_all(self, **args):
		keys = list(args.keys())
		arr = []

		if self.unique:
			array = self.data.items()
		else:
			array = enumerate(self.data)

		for id, item in array:
			return_this = False
			for key in keys:
				if key in item.keys() and item[key] == args[key]:
					return_this = True
				else:
					return_this = False
					break
			if return_this:
				arr.append(id)
		return arr

	def get(self, id):
		if self.unique:
			if id in self.data.keys():
				return self.data[id]
		elif id < len(self.data):
			return self.data[id]

	def get_all(self):
		return self.data