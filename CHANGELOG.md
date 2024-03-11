0.29.0
------
- feat: Add default sort value

0.28.4
------
- chore: version

0.28.3
------
- chore: export inputs

0.28.2
------
- chore: export guillotina types

0.28.1
------
- Fix: Layout menu mobile

0.28.0
------
- Feat: Update to typescript

0.27.0
------
- Feat: Add label to input list

0.26.0
------
- Feat: Add possibility to translate the workflow texts

0.25.2
------
- feat: use label property to render info in search inputs and to sort elements

0.25.1
------
- chore: export generic Messages

0.25.0
------
- feat: Add inputs search to editComponent

0.24.1
------
- fix: Render vocabulary field

0.24.0
------
 - feat: Implement and update some guillotina behaviors
 - feat: add select vocabulary field
 - feat: Allow to sort columns in items tab
 - fix: auth, expired token
 - feat: allow to use multiples attributes to do a generic search
 - feat: Add search input to user and group items tab
 - chore: add vitest
 - Add select multiple
 - Add filter schema to registry to create dynamic filters in items tab
 - Render text value instead of key value in vocabulary select
 - Create scale images in IImageAttachment behavior
 - Add i18n ( english, catalan, spanish)

 
0.23.1
------
 - chore: update use-reactportal
 
0.23.0
------
 - chore: update dependences
 - chore: update react peerDependences
 - chore: delete unused code

0.22.4
------
 - chore: update dependences

0.22.3
------
 - fix: remove items path #167
 - feat: select principals show id if fullname not exist
 - chore: update dependences
 
0.22.2
------
 - chore: update dependences
 
0.22.1
------
 - Fix export

0.22.0
------
 - Refactor get current context in client and rest utilities. #118
 - Fixed default values in copy action
 - Added some tests of copy and move elements in panel of items.

0.21.0
------
 - Allow override RenderFieldComponent. #146

0.20.1
------
 - Fix principal select options in permissions tab #147

0.20.0
------
 - Add users in principals to modify their permissions and handle errors when change permission in some object. #145

0.19.0
------
 - Add date type input in edit component #144

0.18.0
------
 - Add itemsColumn in registry to allow configure columns in items panel by type #142

0.17.0
------
 - Search: use always search function and allow to configure depth param #133

0.16.0
------
 - Add GMI project #97
 - Add search engine configuration #97

0.15.1
------
 - Normalize upload file name #129

0.15.0
------
 - Make more generic the search input field #125

0.14.1
------
- Allow open new tab navigation #116
- Fix microbundle bundle bug #115


0.14.0
------
 - Add key as fallback to value.title + hide table if all properties are ignored + update docs (#109)
 - e2e cypress retry failed tests (#110)
 - Implement refresh without spinner (transparent=true) (#111)
 - Add data-test property in createBtn context tool bar (#113)
 - Add datatest search input (#114)

0.13.1
------
 - Add classNameInput prop in checkbox and modify placeholder input_list (#106)
 - Add error message in search_input (#106)
 - Add loading in add item action (#106)

0.13.0
------
 - Add filter type in items panel. (#105)

0.12.2
------
 - Fix open new tab downloadFile, firefox (#104)

0.12.1
------
 - Fix attachment and multiattachment behaviors (#103)

0.12.0
------
 - Add querycondition prop in search_input (#100)
 - Fix - Export actions panel (#101)
 - Edit properties fields (#96)


0.11.0
------
 - add actions panel in container folder and item types (#99)

0.10.0
------
 - Improve build (#95)


0.9.0
------
 - Isolate client (#91)
 - Improvement fields (#90)


0.8.0
------

- Replace react-use to own hooks (#82)
- Add prettier (#83)
- Add LICENSE and CONTRIBUTING.md (#86)
- e2e test own project (#84)
- Some fixes (#88)
- CI run workflows (#89)

0.7.1
------
- e2e test own project
- fix github actions

0.7.0
------
- Package upgrades
- More resource personalized from registry

0.6.4
------
- Allow to add a custom flash function on config

0.4.11
----
- Fix issue with React and microbundle

0.4.10
----
- Fix open breadcrumb links in a new browser tab [aralroca]

0.4.9
----
- Add pagination also in the bottom of the page [aralroca]

0.4.8
----
- Allow modify id copying items [aralroca]
- Fill current path as default path when copying items [aralroca]

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


