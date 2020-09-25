0.4.7
----
- Move column definition to GuillotinaClient to overwrite in an easier way [aralroca]

0.4.6
----
- Fix duplicate items in same folder (add a suffix to the id) [aralroca]

0.4.5
----
- Fix TabsPanel crash when 'current' tab doesn't exist in 'tabs'
  [masipcat]

0.4.4
----
- Fix return value of rest.getHeaders() and auth.getHeadres() when not authenticated
  [masipcat]

0.4.3
----
- Scroll to top after call to Ctx.flash

0.4.2
----
- fix bug on behaviors change

0.4.1
----
- Add ErrorBoundary as view in registry that can be overwritten
  [masipcat]
- Remove panel requester (too much bundle size for what it provides)

0.4.0
----
- e2e first test
- e2e github action
- e2e test content
  [psanlorenzo]

- Fix issue when selecting multiple items on different depths with same id
- Return back the delete button (it's more ergonomic)
- Fix compatibility with braking changes on Guillotina 6
- Correctly report failed delete actions, showing a stringify version of the error
- Add a preload spinner on delete.
- Add a new config setting to be able to set a delay after delete
  (That's mostly to workaround elastic delay index)
  [jordic]

0.3.4
----
- Be able to setup default properties showing on panel properties
- Fix auth header on client

0.3.3
----
- If there is no @addable-type hide the button
- Swap columns modified/created (are wrong)
- Be able to customize properties view

0.3.2
----
- If there is only one @addable-type just show it (without dropdown)

0.3.1
----
- Small UI improvements
- Fix bug when search pagination it's not reset

0.3.0
----
 - Move/copy/delete multiple items
   [aralroca]
 - Some fixes
   [jordic]

0.2.2 alpha
---
- Fix issue on container creation
- Be able to personalize icons for custom content types
- Fix bug when providing custom config
- Compat layer on serializer for G5

0.1.0alpha
---
- Don't let registry fail when looking up new from content-types
- Added initial view for editing group properties
- Added microbundle to package the library as npm package
- Added an integration example (still rude) of guillotina with
  next.js
- Fix some issues with ciruclar dependencies when exporting the npm package.
- Never use the registry directly, The registry should be obtained throught the Context.


