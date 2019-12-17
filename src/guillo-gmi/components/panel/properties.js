import React from "react";
import { TraversalContext } from "../../contexts";
import {ItemModel} from '../../models'
import { BehaviorsView } from "../behavior_view";
import { Icon } from "../ui/icon";
import { Button } from "../input/button";

const showProperties = ["@id", "@name", "@uid", "title"];

export function PanelProperties(props) {
  const Ctx = React.useContext(TraversalContext);

  const model = new ItemModel(Ctx.context)

  return (
    <div className="container">
      <div className="level">
        <div className="level-left">
          <h2 className="title is-size-4 is-primary">
            <Icon icon={model.icon} align="is-left" className="has-text-grey" /> &nbsp;
            <span>{Ctx.context.title}</span>
          </h2>
        </div>
        <div className="level-right">
          <Button className="is-small">
            <Icon icon="fas fa-edit" />
            <span>Edit</span>
          </Button>
        </div>
      </div>

      <hr />
      <div className="columns">
        <div className="column">
          <table className="table is-striped is-fullwidth is-size-7">
            <thead>
              <tr>
                <td>Prop</td>
                <td>Value</td>
              </tr>
            </thead>
            <tbody>
              {showProperties.map(prop => (
                <tr>
                  <td>{prop}</td>
                  <td>{Ctx.context[prop]}</td>
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


