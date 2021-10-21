## 4. Our firsts objects

### Create

In container view we will create our first object. Click on plus button, and create an Item type object called, `first-object`.
In this point, you can see a form. This form can be overrided from GMI registry. 

> Note: GMI registry and guillotina registry are different things.

### Retrieve

After creating it, you can view the object in the items list. Go to the object detail, doing click in the row. 
In this object view, you can not see items tab, this is because this object is an Item content type. But now, there is a new tab called `Properties`, in this tab we can see all the infomation about the object.


> More info about content types in <a href="https://guillotina.readthedocs.io/en/latest/developer/contenttypes.html"> guillotina docs </a>


### Update

To update an object, you can modify their properties in `Properties` tab. For example, you can modify the description field, click on the edit button and save the changes. 
In all objects you can add or delete behaviors. These can be statics ( defined in content type ) or dynamics, defined by each object. Only dynamic behaviours can be modified. 

> More info about behaviors in <a href="https://guillotina.readthedocs.io/en/latest/developer/behavior.html"> guillotina docs </a> 

### Delete

We can delete objects from two places; from actions tab or from parent items list. 

### More actions ( Move - Copy )

We can move or copy our own objects, you only need to paste a new path to do it ( without database and container ). Like when deleting objects, these actions can be done from actions tab or from parent items list. 


### Folder object

To create a `Folder` type object, we do the same process as when creating an `Item` object. But, in this case, we see the items list view. You can create more folders, items or other content type inside this folder.


[Previous step](step-3-firsts-steps-gmi.md)

[Next step](step-5-manage-users.md)
