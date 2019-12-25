import React from "react";
import { Table } from "./ui/table";
import { Icon } from "./ui/icon";
import { useRegistry } from "../hooks/useRegistry";


export function BehaviorsView({ context}) {

  const {getBehavior} = useRegistry()

  const behaviors = [].concat(
    context.__behaviors__,
    context["@static_behaviors"]
  );
  const GetBehavior = b => {
    const Cls = getBehavior(b, BehaviorNotImplemented);
    return <Cls {...context[b]} />;
  };

  return (
    <React.Fragment>
      {behaviors.map(behavior => (
        <div className="container">
          <h3 className="title is-size-5">{behavior}</h3>
          <Table
            columns={["Name", "Value", "action"]}
            className="is-striped is-fullwidth is-size-7"
          >
            {GetBehavior(behavior)}
          </Table>
          <hr />
        </div>
      ))}
    </React.Fragment>
  );
}

export function BehaviorNotImplemented() {
  return (
    <tr>
      <td colSpan="3">Not Implemented</td>
    </tr>
  );
}




/*
<tr>
  <td>Creators</td>
  <td>{Ctx.context.creators.map(item =>
    <Author name={item}  key={'a' + item} />
    )}</td>
</tr> */


