create-database:
	docker run -e POSTGRES_DB=guillotina -e POSTGRES_USER=guillotina -e POSTGRES_PASSWORD=postgres -p 127.0.0.1:5532:5432 --name pg_guillotina_react -d postgres:12.17

remove-database:
	docker stop pg_guillotina_react && docker rm pg_guillotina_react
	
start-database:
	docker start pg_guillotina_react

stop-database:
	docker stop pg_guillotina_react

start-guillotina:
	guillotina -c config.yaml

populate-guillotina:
	guillotina -c config.yaml populate --container_id=container