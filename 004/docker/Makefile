
all: # start container
	docker-compose up -d

down: # stop container
	docker-compose down

list: # list container
	docker ps --format "{{.Names}} {{.ID}}"

clean: down # clear
	@docker system prune -a -f
	@docker volume prune -f
	@docker image prune -f
	@docker network prune -f
	@dangling_volumes=$$(docker volume ls -q --filter dangling=true); \
    if [ $$? -eq 0 ]; then \
        for volume in $$dangling_volumes; do \
            docker volume rm $$volume; \
        done; \
    fi

re: clean all
