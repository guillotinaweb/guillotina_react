import pytest


pytestmark = [pytest.mark.asyncio]


async def test_install(app_react_app):
    guillotina = app_react_app
    resp, status = await guillotina("GET", "/db/container/@addons")
    assert status == 200
    assert "dbusers" in resp["installed"]
