## 3. Firsts steps with GMI UI

### Login as root  

Go to http://locahost:3000 and do login with root credentials:

```
username: root
password: root
```

### Create first container

After login you are in data base view.
In this view there are a list of all contaniers, and you can create a new contanier. 
Do click in `db` and then create first container called `container`. Then go to `container` view.

### Container view

![](screenshots/container-view.png)

We can see some tabs, this is default view for content type `Container`. 


- Items: List of items
- Addons: In this tab you can install or uninstall guillotina addons in container
- Registry: This tab is not implemented but the idea is get guillotina registry info. 
- Behaviors: Here you can get object behaviors and add or delete it. 
- Permissions: Manage object permissions
- Actions: Delete, copy and move object

### Traversal


Through the traversal context we have access to the Guillotina content and to some UI actions / helpers.
We defined this in `path` query param. For example, container view woulde be:

`http://localhost:3000?path=/db/container`



[Previous step](step-2-create-gmi-app.md)

[Next step](step-4-our-firsts-objects.md)
