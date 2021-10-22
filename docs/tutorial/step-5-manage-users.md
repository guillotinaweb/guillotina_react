## 5. Manage users ( addon example )

First, we need to add application in guillotina

Modify config.yaml

```diff

applications:
  - guillotina.contrib.catalog.pg
  - guillotina.contrib.swagger
+ - guillotina.contrib.dbusers
```

After modifying config, we always have to restart guillotina service to apply the changes. 

Go back to GMI and refresh the page. Now, if you go to addons tab you can see an addon to install.

Install Guillotina DB Users addon. 

After installing it, there will be Groups and Users folders in items tab. You can create new users in Users' folder and some grups in Grups' folder. 

Create your first user and your first group.

In boths details views, you can set some guillotina roles.

If you logout you can not login with the user that you have created. 

This is because you are trying to login to guillotina root context `/` and only the root user can login here. All users that we have created in `/db/container` can only login in it. 

For example, root can login in:

`http://localhost:8080/@login` and `http://localhost:8080/db/container/@login`

But users that we have creted in `/db/container` can only login in:

`http://localhost:8080/db/container/@login`


[Previous step](step-4-our-firsts-objects.md)

[Next step](step-6-configure-main-app-login.md)
