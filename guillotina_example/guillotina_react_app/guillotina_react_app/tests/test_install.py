import pytest


pytestmark = [pytest.mark.asyncio]


async def test_install(guillotina_react_app_requester):  # noqa
    async with guillotina_react_app_requester as requester:
        response, _ = await requester('GET', '/db/guillotina/@addons')
        assert 'guillotina_react_app' in response['installed']
