from guillotina import configure


app_settings = {
    "commands": {
        "populate": "guillotina_react_app.commands.populate.PopulateData",
    },
    "workflows_content": {
        "guillotina_react_app.gmi.interface.IGMI": "guillotina_basic",
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
