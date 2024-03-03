from guillotina import configure
from guillotina import content
from guillotina_react_app.gmi_required.interface import IGMIAllRequired

@configure.contenttype(
    type_name="GMIAllRequired",
    schema=IGMIAllRequired,
    behaviors=[
        "guillotina.behaviors.dublincore.IDublinCore",
        "guillotina.behaviors.attachment.IAttachment",
        "guillotina.contrib.image.behaviors.IImageAttachment",
        "guillotina.contrib.workflows.interfaces.IWorkflowBehavior",
        "guillotina.contrib.image.behaviors.IMultiImageOrderedAttachment",
    ],
    add_permission="guillotina.AddContent"
)
class GMIAllRequired(content.Folder):
    pass