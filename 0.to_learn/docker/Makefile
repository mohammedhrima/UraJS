all:
	docker-compose up -d

down:
	@docker-compose down

exec:
	@for container_id in $$(docker ps -q); do \
	    gnome-terminal --tab -- bash -c "docker exec -it $$container_id /bin/bash"; \
	done

ps:
	@docker ps --format "{{.Names}} {{.ID}}"

clean: down
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
	sudo rm -rf /home/$(USER)/data

re: clean all