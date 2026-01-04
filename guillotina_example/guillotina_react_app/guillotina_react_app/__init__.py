from guillotina import configure
from guillotina_react_app.workflow import guillotina_basic_with_translations, guillotina_simple

app_settings = {
    "applications": [
        "guillotina.contrib.catalog.pg",
        "guillotina.contrib.workflows",
        "guillotina.contrib.image",
        "guillotina.contrib.swagger",
        "guillotina.contrib.vocabularies",
        "guillotina.contrib.dbusers",
    ],
    "commands": {
        "populate": "guillotina_react_app.commands.populate.PopulateData",
    },
    "workflows": {
        "guillotina_basic_with_translations": guillotina_basic_with_translations,
        "guillotina_simple": guillotina_simple,
    },
    "workflows_content": {
        "guillotina_react_app.gmi.interface.IGMI": "guillotina_basic_with_translations",
        "guillotina_react_app.gmi_behaviors.interface.IGMIBehaviors": "guillotina_simple",
    },
}


def includeme(root):
    """
    custom application initialization here
    """
    configure.scan("guillotina_react_app.api")
    configure.scan("guillotina_react_app.install")
    configure.scan("guillotina_react_app.vocabularies")
    configure.scan("guillotina_react_app.gmi")
    configure.scan("guillotina_react_app.gmi_behaviors")
    configure.scan("guillotina_react_app.gmi_required")
    configure.scan("guillotina_react_app.workflow")
    configure.scan("guillotina_react_app.permissions")
