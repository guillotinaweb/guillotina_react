## 5. Manage users (addon example)

First, we need to add an application to Guillotina.

Modify config.yaml

```diff

applications:
  - guillotina.contrib.catalog.pg
  - guillotina.contrib.swagger
+ - guillotina.contrib.dbusers
```

After modifying the config, you always need to restart the Guillotina service to apply the changes. 

Go back to GMI and refresh the page. Now, if you go to addons tab you can see an addon to install.

Install Guillotina DB Users addon. 

After installing it, there will be Groups and Users folders in the items tab. You can create new users in the Users folder and some groups in the Groups folder. 

Create your first user and your first group.

In both detail views, you can set some Guillotina roles.

If you log out, you cannot log in with the user that you have created. 

This is because you are trying to log in to the Guillotina root context `/`, and only the root user can log in here. All users that we have created in `/db/container` can only log in to it. 

For example, root can log in at:

`http://localhost:8080/@login` and `http://localhost:8080/db/container/@login`

But users that we have created in `/db/container` can only log in at:

`http://localhost:8080/db/container/@login`


[Previous step](step-4-our-firsts-objects.md)

[Next step](step-6-configure-main-app-login.md)
