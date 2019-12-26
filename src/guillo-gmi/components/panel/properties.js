import React from "react";
import { TraversalContext } from "../../contexts";
import { ItemModel } from "../../models";
import { BehaviorsView } from "../behavior_view";
import { Icon } from "../ui/icon";
import { Button } from "../input/button";
import { EditableField } from "../fields/editableField";
import { RenderField } from "../fields/renderField";

const showProperties = ["@id", "@name", "@uid", "title"];
const editable = ["title"];

export function PanelProperties(props) {
  const Ctx = React.useContext(TraversalContext);
  const modifyContent = Ctx.hasPerm("guillotina.ModifyContent");

  const model = new ItemModel(Ctx.context);

  return (
    <div className="container">
      <div className="level">
        <div className="level-left">
          <h2 className="title is-size-4 is-primary">
            <Icon icon={model.icon} align="is-left" className="has-text-grey" />{" "}
            &nbsp;
            <span>{Ctx.context.title}</span>
          </h2>
        </div>
        <div className="level-right">
          <Button className="is-small">
            <Icon icon="fas fa-trash" />
            <span>Delete</span>
          </Button>
          <Button className="is-small">
            <Icon icon="fas fa-arrow-right" />
            <span>Move</span>
          </Button>
        </div>
      </div>

      <hr />
      <div className="columns">
        <div className="column">
          <table className="table is-striped is-fullwidth is-size-7">
            <thead>
              <tr>
                <th className="is-2">Prop</th>
                <th className="is-8">Value</th>
              </tr>
            </thead>
            <tbody>
              {showProperties.map(prop => (
                <tr key={"prop" + prop}>
                  <td>{prop}</td>
                  <td>
                    {editable.includes(prop) && modifyContent ? (
                      <EditableField field={prop} value={Ctx.context[prop]} />
                    ) : (
                      <RenderField value={Ctx.context[prop]} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <BehaviorsView context={Ctx.context} />
        </div>
      </div>
    </div>
  );
}
