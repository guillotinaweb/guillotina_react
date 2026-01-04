import datetime
import pytest
import json

pytestmark = pytest.mark.asyncio
today = datetime.date.today()
year = today.year


async def test_security(app_react_app_with_test_data):
    guillotina = app_react_app_with_test_data
    _, status = await guillotina(
        "POST",
        "/db/container/@sharing",
        data=json.dumps(
            {
                "prinperm": [
                    {"principal": "default", "permission": "guillotina.AccessContent", "setting": "Allow"},
                    {"principal": "default", "permission": "guillotina.SearchContent", "setting": "Allow"},
                    {"principal": "default", "permission": "guillotina.ViewContent", "setting": "Allow"},
                ]
            }
        ),
    )
    assert status == 200

    # login with default user
    resp, status = await guillotina(
        "POST", "/db/container/@login", data=json.dumps({"username": "default", "password": "default"})
    )
    assert status == 200
    token = resp["token"]

    # get container
    _, status = await guillotina(
        "GET",
        "/db/container",
        headers={"Authorization": f"Bearer {token}"},
        authenticated=False,
    )
    assert status == 200

    resp, status = await guillotina(
        "GET", "/db/container/@search?depth=1", headers={"Authorization": f"Bearer {token}"}, authenticated=False
    )
    assert status == 200
    import pdb

    pdb.set_trace()
    assert resp["items_total"] == 3

    _, status = await guillotina(
        "GET", "/db/container/gmi_folder", headers={"Authorization": f"Bearer {token}"}, authenticated=False
    )
    assert status == 200
