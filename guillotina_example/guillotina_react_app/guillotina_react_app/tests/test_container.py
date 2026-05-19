import datetime
import pytest


pytestmark = pytest.mark.asyncio
today = datetime.date.today()
year = today.year


async def test_container_init(app_react_app):
    guillotina = app_react_app
    _, status = await guillotina("GET", "/db/container")
    assert status == 200
