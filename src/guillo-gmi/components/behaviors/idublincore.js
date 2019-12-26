import React from "react";

import { Icon } from "../ui/icon";
import { RenderField } from "../fields/renderField";
import { TraversalContext } from "../../contexts";
import { EditableField } from "../fields/editableField";
import { Textarea } from "../input/textarea";
import { Input } from "../input/input";

const Schema = {
  editable: ["title", "description", "effective_date", "expiration_date"],
  widgets: {
    description: Textarea
  }
};

export function IDublinCore(props) {
  const Ctx = React.useContext(TraversalContext);
  const modifyContent = Ctx.hasPerm("guillotina.ModifyContent");

  return (
    <React.Fragment>
      {Object.keys(props).map(key => (
        <tr>
          <td>{key}</td>
          <td>
            {Schema.editable.includes(key) && modifyContent && (
              <EditableField
                field={key}
                value={props[key]}
                Type={Schema.widgets[key] || Input}
                ns="guillotina.behaviors.dublincore.IDublinCore"
              />
            )}
            {!Schema.editable.includes(key) && (
              <RenderField value={props[key]} />
            )}
          </td>
        </tr>
      ))}
    </React.Fragment>
  );
}

export function Author({ name }) {
  return (
    <div className="container">
      <Icon icon="fas fa-user" />
      <span>{name}</span>
    </div>
  );
}
