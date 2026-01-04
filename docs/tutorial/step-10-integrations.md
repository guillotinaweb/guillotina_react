
## 10. Integrations

### Use with Nextjs and ESM

In examples folder you can see both examples.

### How to use Guillotina client

If you want, you can use the Guillotina client without the `Guillotina` component from outside the traversal path. It allows you to communicate with Guillotina and create new pages that render whatever you want. For example, if you need a more complicated list, you can use the Guillotina client and create this isolated list. 


### Integrate GMI into Guillotina

Guillotina can serve JS apps. We can integrate GMI directly into Guillotina. To do this, we will create the React application in the Guillotina project. 

Modify package.json

```diff
+ "homepage": "/+manage/",
```


Then build the React app:

```bash
pnpm build
```

Copy the built files to some folder in the Guillotina project. Then in config.yaml, we can define the base directory to find index.html. 

For example, if we create an application in `guillotina_demo/guillotina_demo/static` then the config file should be:

```yaml
jsapps:
  +manage: guillotina_demo:static/build
```

We can see the application at `http://localhost:8080/+manage` 


[Previous step](step-9-behaviors.md)
