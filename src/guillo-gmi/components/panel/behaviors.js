import React from "react";
import { useCrudContext } from "../../hooks/useCrudContext";
import { Table } from "../ui/table";
import { Button } from "../input/button";

export function PanelBehaviors() {
  const { Ctx, get, result, loading, isError } = useCrudContext();
  const ops = useCrudContext();

  const [state, setState] = React.useState(false);

  const enableBehavior = behavior => async () => {
    await ops.patch({ behavior }, "@behaviors");
    setState(!state);
    Ctx.refresh()
  };

  const disableBehavior = behavior => async () => {
    await ops.del({ behavior }, "@behaviors");
    setState(!state);
    Ctx.refresh()
  };

  React.useEffect(() => {
    (async () => {
      await get("@behaviors");
    })();
  }, [state]);

  return (
    <div className="columns behaviors">
      <div className="column is-8 is-size-7">
        <h2 className="title is-size-5 has-text-grey-dark">Behaviors</h2>
        {!loading && !isError && result && (
          <React.Fragment>
            <Table>
              <tr>
                <td colSpan="3">
                  <h3 className="title is-size-6">Static</h3>
                </td>
              </tr>
              {result.static.map(behavior => (
                <tr key={behavior}>
                  <td>Static</td>
                  <td>{behavior}</td>
                  <td className="">
                    <Button className="is-small is-pulled-right" disabled>
                      Disable
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
            <Table>
              <tr>
                <td colSpan="3">
                  <h3 className="title is-size-6">Enabled</h3>
                </td>
              </tr>
              {result.dynamic.map(behavior => (
                <tr key={behavior}>
                  <td>Enabled</td>
                  <td>{behavior}</td>
                  <td>
                    <Button
                      className="is-small is-danger is-pulled-right"
                      onClick={disableBehavior(behavior)}
                    >
                      Disable
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
            <Table>
              <tr>
                <td colSpan="3">
                  <h3 className="title is-size-6">Available</h3>
                </td>
              </tr>
              {result.available.map(behavior => (
                <tr key={behavior}>
                  <td>Available</td>
                  <td>{behavior}</td>
                  <td>
                    <Button
                      className="is-small is-primary is-pulled-right"
                      onClick={enableBehavior(behavior)}
                    >
                      Enable
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
          </React.Fragment>
        )}
      </div>
      <div className="column is-4"></div>
    </div>
  );
}
