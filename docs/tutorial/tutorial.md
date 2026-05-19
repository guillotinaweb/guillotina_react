# Step by step tutorial 🔌 Guillotina Management Interface

A **framework-first React UI layer** for [Guillotina](https://guillotina.io/), enabling developers to build custom content management interfaces. It provides an interface to access all Guillotina content depending on user permissions and allowing you to apply actions like create/modify/remove content, UI interactions like displaying flash messages, etc.

All this with the flexibility to build it your way, adding your own content with your forms, your icons, etc. It's built around the idea to act as a framework layer that could be extended from outside via the **registry pattern**.

### Prerequisites
- **Python**: 3.11 or higher
- **Node.js**: 22.13 or higher
- **pnpm**: 9.x (`npm install -g pnpm`)
- **Docker**: For running PostgreSQL

First of all, we need a Guillotina server. In this tutorial we will not explain all the Guillotina features, if you want to know more about Guillotina, go to its [documentation](https://guillotina.readthedocs.io/en/latest/index.html).

It is recommended that you install it along with a [virtual environment](https://docs.python.org/3/library/venv.html).

[Next step](step-1-install-guillotina.md)

## All steps:

1. [Install Guillotina](step-1-install-guillotina.md)
2. [Create GMI application with Vite and TypeScript](step-2-create-gmi-app.md)
3. [First steps with GMI UI](step-3-firsts-steps-gmi.md)
4. [Our first objects](step-4-our-firsts-objects.md)
5. [Manage users ( addon example )](step-5-manage-users.md)
6. [Configure main app to log in to root or any container](step-6-configure-main-app-login.md)
7. [Create your own content type](step-7-create-own-content-type.md)
8. [Content type view](step-8-content-type-view.md)
9. [Behaviors](step-9-behaviors.md)
10. [Integrations](step-10-integrations.md)