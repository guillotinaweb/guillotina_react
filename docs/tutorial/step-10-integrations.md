
## 10. Integrations

### Use with Nextjs and ESM

In examples folder you can see both examples.

### How to use guillotina client

If you want, you can use Guillotina client without `Guillotina` component from outside the traversal path. It allows you to comunicate with Guillotina and create new pages that render whatever you want. For example,if you need a more complicated list, you can use Guillotina client and create this isolated list. 


### Integrate GMI to guillotina

Guillotina can serve JS apps. We can integrate GMI directly in to Guillotina. To do this we will create the react application in Guillotina project. 

Modify package.json

```diff
+ "homepage": "/+manage/",
```


Then build react app

```
npm run build
```

Copy builded files in some folder in guillotina project. Then in config.yaml we can define the base directory to find index.html. 

For example, if we create an application in `guillotina_demo/guillotina_demo/static` then the config file should be:

```yaml
jsapps:
  +manage: guillotina_demo:static/build
```

We can see the application in `localhost:8000/+manage` 


[Previous step](step-9-behaviors.md)
