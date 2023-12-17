from guillotina import testing
from guillotina.tests.fixtures import ContainerRequesterAsyncContextManager

import json
import pytest


def base_settings_configurator(settings):
    if 'applications' in settings:
        settings['applications'].append('guillotina_react_app')
    else:
        settings['applications'] = ['guillotina_react_app']


testing.configure_with(base_settings_configurator)


class guillotina_react_app_Requester(ContainerRequesterAsyncContextManager):  # noqa

    async def __aenter__(self):
        await super().__aenter__()
        resp = await self.requester(
            'POST', '/db/guillotina/@addons',
            data=json.dumps({
                'id': 'guillotina_react_app'
            })
        )
        return self.requester


@pytest.fixture(scope='function')
async def guillotina_react_app_requester(guillotina):
    return guillotina_react_app_Requester(guillotina)
