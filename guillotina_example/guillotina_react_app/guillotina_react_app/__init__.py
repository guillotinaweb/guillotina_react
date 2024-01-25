from guillotina import configure
from guillotina_react_app.workflow import guillotina_basic_with_translations

app_settings = {
    "commands": {
        "populate": "guillotina_react_app.commands.populate.PopulateData",
    },
     "workflows": {"guillotina_basic_with_translations": guillotina_basic_with_translations},
    "workflows_content": {
        "guillotina_react_app.gmi.interface.IGMI": "guillotina_basic_with_translations",
        "guillotina_react_app.gmi.interface.IGMIBehaviors": "guillotina_simple",
    },
}


def includeme(root):
    """
    custom application initialization here
    """
    configure.scan('guillotina_react_app.api')
    configure.scan('guillotina_react_app.install')
    configure.scan("guillotina_react_app.vocabularies")
    configure.scan("guillotina_react_app.gmi")
    configure.scan("guillotina_react_app.gmi_behaviors")
    configure.scan("guillotina_react_app.workflow")
