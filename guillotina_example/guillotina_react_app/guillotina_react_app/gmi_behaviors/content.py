from guillotina import configure
from guillotina import content
from guillotina_react_app.gmi_behaviors.interface import IGMIBehaviors

@configure.contenttype(
    type_name="GMIBehaviors",
    schema=IGMIBehaviors,
    behaviors=[
        "guillotina.behaviors.dublincore.IDublinCore",
        "guillotina.behaviors.attachment.IMultiAttachment",
        "guillotina.contrib.image.behaviors.IMultiImageAttachment",
        "guillotina.contrib.workflows.interfaces.IWorkflowBehavior",
    ],
    add_permission="guillotina.AddContent"
)
class GMIBehaviors(content.Item):
    pass