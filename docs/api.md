
# Design and develop considerations

- guillotina_rect mostly uses react.Context and hooks to manage state


## Architecture

- The main component is guillotina, it's the base context that uses,
  on traversal, and it exposes an API for managening and sharing
  actions on screens.

  ```javascript
  Ctx = useContext(TraversalContext)
  Ctx.setPath('/db/guillotina/')  // will navigate tracersal to the container
  Ctx.doAction // show an action
  Ctx.cancelAction // hide (terminate) the latest action. Used, when the process completes
  Ctx.flash  // Show a flash message on the main screen
  Ctx.refresh // Force a refresh from the server for the current traversal context
  // Properties
  Ctx.path // exposes the current context path (without service url)
  Ctx.auth // Exposes the auth service provided throught guillotina main component insta
  Ctx.client // Exposes the guillotina client throught the main component
  Ctx.context // Current fetched context data for the path
  ```


- There is a "component registry" to be able to override components, on
   installations. Actually it's just some maps where you can register,
   component overrides

   - registry/
     Acts as a base context screen registry,
    `getCompoment() and registerComponent() as API exposed

   - actions/
     - Actions are mostly UI interactions you trigger from buttons (remove item)
     and when adding types (Context menu +)
     - They mostly are based on a "modal" that proposes you something
     - Actions can be dispatched, using the main Context

     ```
     Ctx = useContext(TraversalContext)
     Ctx.doAction("addItem" , "Folder")
     ```

     will show a modal to add an item for a folder

   - forms/
     - Used throught actions to provide forms for <Forms>


views/
  - Stores views for contexts

