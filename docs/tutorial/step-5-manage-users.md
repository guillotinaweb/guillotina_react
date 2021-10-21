## 5. Manage users ( addon example )

First we need add application in guillotina

Modify config.yaml

```diff

applications:
  - guillotina.contrib.catalog.pg
  - guillotina.contrib.swagger
+ - guillotina.contrib.dbuser
```

After modify config, always we have to restart guillotina service to apply the changes. 

Come back to GMI and refresh the page. Now if you go to addons tab you can view an addon to install.

Install Guillotina DB Users addon. 

After installed, in items tab there will are Groups and Users folders. You can create new users in Users folder and some grups in Grups folders. 

Create your first user and your first group.

In boths details views, you can set some guillotina roles.

If you logout you can not login with the user that you have created. 

This is because you are trying do login to guillotina root context `/` and here only root user can do login. All users that we have created in `/db/container` only can do login in it. 

For example root can do login in:

`http://localhost:8080/@login` and `http://localhost:8080/db/container/@login`

But users that we have creted in `/db/container` only can do login in:

`http://localhost:8080/db/container/@login`


[Previous step](step-4-our-firsts-objects.md)

[Next step](step-6-configure-main-app-login.md)
