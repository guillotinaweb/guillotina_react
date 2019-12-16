import React from "react";
import { TraversalContext } from "../../contexts";

const showProperties = ["@id", "@name", "@uid"];

export function PanelProperties(props) {
  const Ctx = React.useContext(TraversalContext);

  return (
    <div className="container">
      <h2 className="title is-size-4">{props.title}</h2>
      <hr />
      <div className="columns">
        <div className="column">
          <table className="table is-striped is-fullwidth">
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
        </div>
      </div>
    </div>
  );
}
