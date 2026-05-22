from async_asgi_testclient import TestClient
from guillotina import testing
from guillotina.component import globalregistry
from guillotina.factory import make_app
from guillotina.tests.fixtures import _clear_dbs
from guillotina.tests.fixtures import clear_task_vars
from guillotina.tests.fixtures import get_db_settings
from guillotina.tests.fixtures import GuillotinaDBAsgiRequester

import json
import pytest
import os


NOT_POSTGRES = os.environ.get("DATABASE", "DUMMY") in (
    "cockroachdb",
    "DUMMY",
)


def base_settings_configurator(settings):
    settings["applications"].append("guillotina_react_app")
    settings["load_catalog"] = True
    settings["debug"] = True
    settings["load_utilities"] = {
        "catalog": {
            "provides": "guillotina.interfaces.ICatalogUtility",
            "factory": "guillotina.contrib.catalog.pg.utility.PGSearchUtility",
        },
    }


testing.configure_with(base_settings_configurator)


@pytest.fixture(scope="function")
async def app_client(event_loop, db, request):
    globalregistry.reset()
    app = make_app(settings=get_db_settings(request.node), loop=event_loop)
    async with TestClient(app, timeout=90) as client:
        await _clear_dbs(app.app.root)
        yield app, client
    clear_task_vars()


@pytest.fixture(scope="function")
async def guillotina_react_app_requester(app_client):
    _, client = app_client
    yield GuillotinaDBAsgiRequester(client)


@pytest.fixture(scope="function")
async def app_react_app(guillotina_react_app_requester):
    guillotina = guillotina_react_app_requester
    resp, status = await guillotina_react_app_requester(
        "POST",
        "/db",
        data=json.dumps(
            {
                "@type": "Container",
                "title": "Title Foo App",
                "id": "container",
            }
        ),
    )
    assert status == 200
    resp, status = await guillotina(
        "POST",
        "/db/container/@addons",
        data=json.dumps({"id": "dbusers"}),
    )
    assert status == 200
    yield guillotina


@pytest.fixture(scope="function")
async def app_react_app_with_test_data(app_react_app):
    """
    Fixture that initializes test data matching init-test-data.js:
    - Installs image addon
    - Creates group_view_content group
    - Creates default user with password 'default'
    - Creates gmi_folder
    - Creates 50 GMI items with various field values
    """
    guillotina = app_react_app
    choice_fields = ["date", "integer", "text", "float", "keyword", "boolean"]

    # 1. Install image addon
    _, status = await guillotina(
        "POST",
        "/db/container/@addons",
        data=json.dumps({"id": "image"}),
    )
    assert status == 200

    # 2. Create group
    _, status = await guillotina(
        "POST",
        "/db/container/groups",
        data=json.dumps(
            {
                "@type": "Group",
                "id": "group_view_content",
                "title": "group_view_content",
            }
        ),
    )
    assert status == 201

    # 3. Create user
    _, status = await guillotina(
        "POST",
        "/db/container/users",
        data=json.dumps(
            {
                "@type": "User",
                "username": "default",
                "id": "default",
                "password": "default",
                "email": "default@test.com",
                "user_groups": ["group_view_content"],
            }
        ),
    )
    assert status == 201

    # 4. Create folder
    _, status = await guillotina(
        "POST",
        "/db/container",
        data=json.dumps(
            {
                "@type": "Folder",
                "id": "gmi_folder",
                "title": "GMI Folder",
            }
        ),
    )
    assert status == 201

    # 5. Create 50 GMI items
    for i in range(50):
        _, status = await guillotina(
            "POST",
            "/db/container/gmi_folder",
            data=json.dumps(
                {
                    "@type": "GMI",
                    "title": f"Test GMI item {i}",
                    "number_field": i,
                    "boolean_field": i % 2 == 0,
                    "choice_field_vocabulary": ["plone", "guillotina"][i % 2],
                    "choice_field": choice_fields[i % 6],
                }
            ),
        )
        assert status == 201

    yield guillotina
