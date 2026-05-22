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


class PopulateData(Command):
    def get_parser(self):
        parser = super(PopulateData, self).get_parser()
        parser.add_argument("--container_id", help="container_id", required=True)
        return parser

    async def run(self, arguments, _settings, _app):
        container_id = arguments.container_id
        async with transaction(db=await get_database("db")) as txn:
            root = await txn.manager.get_root()
            container = await create_container(root, container_id)

            request = get_mocked_request()
            task_vars.request.set(request)
            set_authenticated_user(RootUser("root"))
            await addons.install(container, "dbusers")
            await addons.install(container, "image")

            # Get groups and users folders (created by dbusers addon)
            groups_folder = await container.async_get("groups")
            users_folder = await container.async_get("users")

            # Create group in groups folder
            group = await create_content_in_container(
                groups_folder,
                "Group",
                "group_view_content",
                id="group_view_content",
                creators=("root",),
                contributors=("root",),
                title="group_view_content",
                check_constraints=False,
            )

            # Create user in users folder
            await create_content_in_container(
                users_folder,
                "User",
                "default",
                id="default",
                username="default",
                password="default",
                email="default@test.com",
                user_groups=["group_view_content"],
                creators=("root",),
                contributors=("root",),
                check_constraints=False,
            )

            # Add user to group (update group's users property)
            # Get the group again to ensure we have the latest version
            group = await groups_folder.async_get("group_view_content")
            if not hasattr(group, "users") or group.users is None:
                group.users = []
            if "default" not in group.users:
                group.users.append("default")
            group.register()

            # Create folder
            folder = await create_content_in_container(
                container,
                "Folder",
                "gmi_folder",
                id="gmi_folder",
                creators=("root",),
                contributors=("root",),
                title="GMI Folder",
                check_constraints=False,
            )

            # Create 50 GMI items
            choice_fields = ["date", "integer", "text", "float", "keyword", "boolean"]
            vocabulary_choices = ["plone", "guillotina"]

            for i in range(50):
                item_data = {
                    "title": f"Test GMI item {i}",
                    "number_field": i,
                    "boolean_field": i % 2 == 0,
                    "choice_field_vocabulary": vocabulary_choices[i % 2],
                    "choice_field": choice_fields[i % 6],
                }
                obj = await create_content_in_container(
                    parent=folder,
                    type_="GMI",
                    creators=("root",),
                    contributors=("root",),
                    check_security=False,
                    id_=f"test_gmi_item_{i}",
                    **item_data,
                )
                await notify(ObjectAddedEvent(obj, folder, obj.id, payload=item_data))
