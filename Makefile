deploy:
	rsync -r . root@206.189.197.112:dog-things-api
.PHONY: deploy
