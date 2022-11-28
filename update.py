import os
import shutil
server_current = ""
server_updates = "music-4"

for dname, dirs, files in os.walk(server_updates):
	for fname in files:
		fpath = os.path.join(dname, fname)

		rel = os.path.relpath(fpath, server_updates)
		new = os.path.join(server_current, rel)
		
		if not os.path.exists(os.path.dirname(new)):
			os.mkdir(os.path.dirname(new))
		shutil.move(fpath, new)

shutil.rmtree(server_updates)
