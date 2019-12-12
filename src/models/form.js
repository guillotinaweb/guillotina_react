import React from 'react'

class BaseElement {

  exclude = ["modification_date", "creation_date"]
  excludeEdit = ["id"]
  excludeAdd = []

  constructor(schema) {
    this.schema = schema
  }

  getFieldsAdd() {

  }

  getFieldsEdit() {

  }

}


const Schema = [
  {"field": "title", "widget": "TextInput", }
]



export function FF(props) {
  return (
    <Form schema={Schema} addExclusions={["title"]}>
        <AddBehaviours />
    </Form>
  )
}

class Folder extends BaseElement {
}

const Schema = {
  "title": "Folder",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "required": [
    "type_name",
    "uuid"
  ],
  "definitions": {
    "guillotina.behaviors.dublincore.IDublinCore": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "The first unqualified Dublin Core 'Title' element value.",
          "title": "Title"
        },
        "description": {
          "type": "string",
          "description": "The first unqualified Dublin Core 'Description' element value.",
          "title": "Description"
        },
        "creation_date": {
          "type": "datetime",
          "description": "The date and time that an object is created. \nThis is normally set automatically.",
          "title": "Creation Date"
        },
        "modification_date": {
          "type": "datetime",
          "description": "The date and time that the object was last modified in a\nmeaningful way.",
          "title": "Modification Date"
        },
        "effective_date": {
          "type": "datetime",
          "description": "The date and time that an object should be published. ",
          "title": "Effective Date"
        },
        "expiration_date": {
          "type": "datetime",
          "description": "The date and time that the object should become unpublished.",
          "title": "Expiration Date"
        },
        "creators": {
          "type": "array",
          "description": "The unqualified Dublin Core 'Creator' element values",
          "title": "Creators",
          "items": {
            "type": "string"
          }
        },
        "tags": {
          "type": "array",
          "description": "The unqualified Dublin Core 'Tags' element values",
          "title": "Tags",
          "items": {
            "type": "string"
          }
        },
        "publisher": {
          "type": "string",
          "description": "The first unqualified Dublin Core 'Publisher' element value.",
          "title": "Publisher"
        },
        "contributors": {
          "type": "array",
          "description": "The unqualified Dublin Core 'Contributor' element values",
          "title": "Contributors",
          "items": {
            "type": "string"
          }
        }
      },
      "required": [],
      "invariants": [],
      "title": "Dublin Core fields",
      "description": ""
    }
  },
  "properties": {
    "type_name": {
      "type": "string",
      "readonly": true
    },
    "title": {
      "type": "string",
      "description": "Title of the Resource",
      "title": "Title"
    },
    "uuid": {
      "type": "string",
      "readonly": true,
      "title": "UUID"
    },
    "modification_date": {
      "type": "datetime",
      "title": "Modification date"
    },
    "creation_date": {
      "type": "datetime",
      "title": "Creation date"
    },
    "__behaviors__": {
      "type": "array",
      "description": "Dynamic behaviors for the content type",
      "readonly": true,
      "title": "Enabled behaviors"
    },
    "guillotina.behaviors.dublincore.IDublinCore": [
      {
        "$ref": "#/components/schemas/guillotina.behaviors.dublincore.IDublinCore"
      }
    ]
  },
  "invariants": []
}
