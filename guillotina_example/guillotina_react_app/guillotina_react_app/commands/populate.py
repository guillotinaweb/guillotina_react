from guillotina import addons
from guillotina.api.container import create_container
from guillotina.commands import Command
from guillotina.transactions import transaction
from guillotina.utils import get_database
from guillotina.tests.utils import get_mocked_request
from guillotina import task_vars
from guillotina.auth.users import RootUser
from guillotina.auth.utils import set_authenticated_user
from guillotina.content import create_content_in_container
from guillotina.events import ObjectAddedEvent
from guillotina.event import notify

items = [
    {
        "id":"first_item",
        "title":"First item",
        "@type": "GMI",
        "text_richtext_field":"<p>Item</p>",
        "text_field": "Text field",
        "number_field": 4,
        "boolean_field":True,
        "list_field":["item"],
        "choice_field":"plone"
    },
    {
        "id":"second_item",
        "title":"Second item",
        "@type": "GMI",
        "text_richtext_field":"<p>Item</p>",
        "text_field": "Second item text field",
        "number_field": 2,
        "boolean_field":True,
        "choice_field":"guillotina"
    },
    {
        "id":"third_item",
        "title":"Third item",
        "@type": "GMI",
        "text_richtext_field":"<p>Item</p>",
        "text_field": "Third item text field",
        "number_field": 2,
        "boolean_field":False,
        "choice_field":"guillotina"
    }
]

class PopulateData(Command):
    def get_parser(self):
        parser = super(PopulateData, self).get_parser()
        parser.add_argument("--container_id", help="container_id", required=True)
        return parser

    async def run(self, arguments, settings, app):
        container_id = arguments.container_id
        async with transaction(db=await get_database("db")) as txn:
            root = await txn.manager.get_root()
            container = await create_container(root, container_id)

            request = get_mocked_request()
            task_vars.request.set(request)
            set_authenticated_user(RootUser("root"))
            await addons.install(container, "dbusers")
            await addons.install(container, "image")

            folder = await create_content_in_container(
                container,
                "Folder",
                "folder_with_gmi",
                id="folder_with_gmi",
                creators=("root",),
                contributors=("root",),
                title="Folder with gmi",
                check_constraints=False,
            )

            for item in items:
                obj = await create_content_in_container(
                    parent=folder, 
                    type_="GMI", 
                    creators=("root",),
                    contributors=("root",),
                    check_security=False, 
                    id_=item['id'], 
                    **item
                )
                await notify(ObjectAddedEvent(obj, folder, obj.id, payload=item))
                
                



