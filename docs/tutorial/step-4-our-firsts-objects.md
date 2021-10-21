## 4. Our firsts objects

### Create

In container view we will create our first object. Click on plus button, and creates an Item type object called, `first-object`.
In this point, you can see a form. This form can be overrided from GMI registry. 

> Note: GMI registry and guillotina registry are different things.

### Retrieve

After created it, you can view object in items list. Go to object detail, doing click in the row. 
In this object view, you can not view items tab, this is because this object is an Item content type, but now, there are a new tab called `Properties` in this tab we can view all info about object.


> More info about content types in <a href="https://guillotina.readthedocs.io/en/latest/developer/contenttypes.html"> guillotina docs </a>


### Update

To update object, you can modify their properties in `Properties` tab. For example you can modify description field, click on edit button in description field, and save changes. 
In all objects you can add or delete a behaviors. These can be statics ( defined in content type ) or dynamic, defined by each object. Only dynamic behaviours can be modified. 

> More info about behaviors in <a href="https://guillotina.readthedocs.io/en/latest/developer/behavior.html"> guillotina docs </a> 

### Delete

We can delete objects in two places, in actions tab or in parent items list. 

### More actions ( Move - Copy )

We can move or copy own objects, only you need to paste a new path to do it ( without database and container ). Like delete action, these actions are in actions tab or in parent items list. 


### Folder object

For `Folder` type objects, is the same than `Item` object, but in this case there are items list view. An you can create more folders, items or other content type inside it.


[Previous step](step-3-firsts-steps-gmi.md)

[Next step](step-5-manage-users.md)
