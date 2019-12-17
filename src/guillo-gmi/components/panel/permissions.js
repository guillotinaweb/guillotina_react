import React from "react";

import { Table } from "../ui/table";
import { useCrudContext } from "../../hooks/useCrudContext";
import { Sharing } from "../../models";
import { Icon } from "../ui/icon"

export function PanelPermissions(props) {
  const { get, result, loading } = useCrudContext();

  React.useEffect(() => {
    (async () => {
      await get("@sharing");
    })();
  }, []);

  const perms = new Sharing(result);

  return (
    <div className="columns">
      {!loading && (
        <div className="column is-8 is-size-7 permissions">
          <h2 className="title is-size-5 has-text-grey-dark">
            Role Permissions
          </h2>
          <Table headers={["Role", "Premission", "Setting"]}>
            {perms.roles.map(role => (
              <React.Fragment>
                <tr>
                  <td colSpan="3" className="has-text-link">{role}</td>
                  {/* <td>
                    <Icon icon="fas fa-ban" />
                    <span>Remove</span>
                  </td> */}
                </tr>
                {Object.keys(perms.getRole(role)).map(row => (
                  <tr>
                    <td></td>
                    <td>{row}</td>
                    <td>{perms.getRole(role)[row]}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {perms.roles.length === 0 && (
              <tr>
                <td colSpan="3">No roles permissions defined</td>
              </tr>
            )}
          </Table>
          <h2 className="title is-size-5 has-text-grey-dark">
            Principal Permissions
          </h2>
          <Table headers={["Principal", "Premission", "Setting"]}>
            {perms.principals.map(role => (
              <React.Fragment>
                <tr>
                  <td colSpan="3" className="has-text-link">{role}</td>
                </tr>
                {Object.keys(perms.getPrincipals(role)).map(row => (
                  <tr>
                    <td></td>
                    <td>{row}</td>
                    <td>{perms.getPrincipals(role)[row]}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {perms.principals.length === 0 && (
              <tr>
                <td colSpan="3">No principals permissions defined</td>
              </tr>
            )}
          </Table>
          <h2 className="title is-size-5 has-text-grey-dark">
            Principal Roles
          </h2>
          <Table headers={["Principal", "Role", "Setting"]}>
            {perms.prinrole.map(role => (
              <React.Fragment>
                <tr>
                  <td colSpan="3" className="has-text-link">{role}</td>
                </tr>
                {Object.keys(perms.getPrinroles(role)).map(row => (
                  <tr>
                    <td></td>
                    <td>{row}</td>
                    <td>{perms.getPrinroles(role)[row]}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {perms.prinrole.length === 0 && (
              <tr>
                <td colSpan="3">No principals roles defined</td>
              </tr>
            )}
          </Table>
        </div>
      )}
      <AddPermission />
    </div>
  );
}


export function AddPermission() {
  return (
    <div className="column is-4">
      <h1 className="title is-size-5">Add Permissions</h1>
    </div>
  )
}
