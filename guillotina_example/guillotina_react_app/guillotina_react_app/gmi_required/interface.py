import json
from guillotina import interfaces
from guillotina import schema
from guillotina.directives import index_field
from guillotina.fields import CloudFileField

JSON_EXAMPLE_SCHEMA = json.dumps(
    {
        "title": "My Json Field",
        "type": "object", 
        "properties": {
            "items": {
                "type": "array",
                "title": "Array in json"
            },
            "text": {
                "type": "string", 
                "title": "Text in json"
            },
            "second_level": {
                "type": "object",
                "title": "Two levels",
                "properties": {
                    "first_item_second_level": {
                        "type": "string",
                        "title": "Item second level text",
                    },
                },
            },
        }
    }
)
class IGMIAllRequired(interfaces.IFolder):

    json_example = schema.JSONField(schema=JSON_EXAMPLE_SCHEMA, required=False)

    index_field("text_richtext_field", type="searchabletext")
    text_richtext_field = schema.Text(title="Text richtext field", required=True, widget="richtext")

    index_field("text_field", type="searchabletext")
    text_field = schema.Text(title="Text field", required=True)

    index_field("textarea_field", type="searchabletext")
    textarea_field = schema.Text(title="Text area field", required=True, widget="textarea")


    text_line_field = schema.TextLine(title="Text line field", required=True)
    index_field("number_field", type="int")
    number_field = schema.Int(title="Number field", required=True)
    index_field("boolean_field", type="boolean")
    boolean_field = schema.Bool(title="Boolean field")
    cloud_file_field = CloudFileField(title="Cloud file field")
    list_field = schema.List(title="List field", value_type=schema.TextLine(), missing_value=[], required=True)
    
    index_field("datetime_field", type="date")
    datetime_field = schema.Datetime(title="Datetime field", required=True)

    index_field("time_field", type="text")
    time_field = schema.Time(title="Time field", required=True)

    index_field("date_field", type="date")
    date_field = schema.Date(title="Date field", required=True)

    index_field("choice_field_vocabulary", type="keyword")
    choice_field_vocabulary = schema.Choice(
        title="Choice field vocabulary",
        vocabulary="gmi_vocabulary",
        required=True
    )

    index_field("choice_field", type="keyword")
    choice_field = schema.Choice(
        title="Choice field",
        values=["date", "integer", "text", "float", "keyword", "boolean"],
        required=True,
    )

    index_field("multiple_choice_field", type="keyword")
    multiple_choice_field = schema.List(
        title="Multiple choice field", 
        value_type=schema.Choice(
            title="Choice field",
            values=["date", "integer", "text", "float", "keyword", "boolean"],
        ), 
        missing_value=[],
        required=True
    )

    index_field("multiple_choice_field_vocabulary", type="keyword")
    multiple_choice_field_vocabulary = schema.List(
        title="Multiple choice field vocabulary", 
        value_type=schema.Choice(
            title="Choice field vocabulary",
            vocabulary="gmi_vocabulary",
            required=True,
        ), 
        missing_value=[],
        required=True
    )

    gmi_ids = schema.List(
        title="GMI list",
        value_type=schema.TextLine(),
        default=[],
        null=True,
        blank=True,
        widget="search_list",
        labelProperty="title",
        typeNameQuery="GMI",
        required=True
    )

    brother_gmi = schema.Text(
        title="Brother GMI", 
        widget="search",
        typeNameQuery="GMI",
        labelProperty="title",
        required=True
    )
