from guillotina import configure
from guillotina import content
from guillotina_react_app.gmi.interface import IGMI

@configure.contenttype(
    type_name="GMI",
    schema=IGMI,
    behaviors=[
        "guillotina.behaviors.dublincore.IDublinCore",
        "guillotina.behaviors.attachment.IAttachment",
        "guillotina.contrib.image.behaviors.IImageAttachment",
        "guillotina.contrib.workflows.interfaces.IWorkflowBehavior",
        "guillotina.contrib.image.behaviors.IMultiImageOrderedAttachment",
    ],
    add_permission="guillotina.AddContent"
)
class GMI(content.Folder):
    pass