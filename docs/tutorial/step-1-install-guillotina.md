
## 1. Install guillotina

```bash
mkdir tutorial-gmi
cd tutorial-gmi
python3.7 -m venv genv
cd genv
source ./genv/bin/activate
pip install guillotina
pip install cookiecutter
```


### Up database

- Run postgres

```
docker run -d \
    -e POSTGRES_DB=guillotina \
    -e POSTGRES_USER=guillotina \
    -e POSTGRES_PASSWORD=guillotina \
    -p 127.0.0.1:5444:5432 \
    --name postgres_gmi \
    postgres:13.4
```

### Create and run guillotina application

- Create guillotina application called `guillotina_demo`

```
guillotina create --template=application
cd guillotina_demo
pip install -e .
```

- Modify config file guillotina

  Open your editor and modify config.yaml

 ```diff
-dsn: postgresql://postgres@localhost:5432/guillotina
+dsn: postgresql://guillotina:guillotina@localhost:5444/guillotina
```

 ```diff
allow_origin:
  - http://localhost:8080
+ - http://localhost:3000
  - "chrome-extension://*"
```

- Run guillotina server

```
guillotina
```

The server should now be running on http://0.0.0.0:8080


<div style="display:flex; justify-content:space-between;">
  <div>
    <a name="/tutorial.md"> Previous step </a>
  </div>
  <div>
    <a name="/step-2-create-gmi-app.md"> Next step </a>
  </div>
</div>

