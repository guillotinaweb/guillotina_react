## 4. Our first objects

### Create

In the container view, we will create our first object. Click on the plus button and create an Item type object called `first-object`.
At this point, you can see a form. This form can be overridden from the GMI registry. 

> Note: GMI registry and guillotina registry are different things.

### Retrieve

After creating it, you can view the object in the items list. Go to the object detail by clicking on the row. 
In this object view, you cannot see the items tab because this object is an Item content type. However, there is a new tab called `Properties`, where we can see all the information about the object.


> More info about content types in <a href="https://guillotina.readthedocs.io/en/latest/developer/contenttypes.html"> guillotina docs </a>


### Update

To update an object, you can modify its properties in the `Properties` tab. For example, you can modify the description field by clicking on the edit button and saving the changes. 
In all objects, you can add or delete behaviors. These can be static (defined in the content type) or dynamic, defined by each object. Only dynamic behaviors can be modified. 

> More info about behaviors in <a href="https://guillotina.readthedocs.io/en/latest/developer/behavior.html"> guillotina docs </a> 

### Delete

We can delete objects from two places; from actions tab or from parent items list. 

### More actions (Move - Copy)

We can move or copy our own objects. You only need to paste a new path to do it (without the database and container). Like when deleting objects, these actions can be done from the actions tab or from the parent items list. 


### Folder object

To create a `Folder` type object, we do the same process as when creating an `Item` object. But, in this case, we see the items list view. You can create more folders, items or other content type inside this folder.


[Previous step](step-3-firsts-steps-gmi.md)

[Next step](step-5-manage-users.md)
