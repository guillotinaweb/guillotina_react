0.3.3 unreleased
----
- If there is no @addable-type hide the button
- Swap columns modified/created (are wrong)

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


