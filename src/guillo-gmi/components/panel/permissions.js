import React from "react";

import { Table } from "../ui/table";
import { useCrudContext } from "../../hooks/useCrudContext";
import { Sharing } from "../../models";
import { TraversalContext } from "../../contexts";
import { useSetState } from "react-use";
import { Select } from "../input/select";
import { PermissionRoleperm } from "./permissions_roleperm";
import { PermissionPrinperm } from "./permissions_prinperm";
import { PermissionPrinrole } from "./permissions_prinrole";

export function PanelPermissions(props) {
  const { get, result, loading } = useCrudContext();

  const [reset, setReset] = React.useState(1);

  React.useEffect(() => { get("@sharing") }, [reset]);

  const perms = new Sharing(result);

  return (
    <div className="columns">
      {!loading && (
        <div className="column is-8 is-size-7 permissions">
          <h2 className="title is-size-5 has-text-grey-dark">
            Role Permissions
          </h2>
          <Table headers={["Role", "Premission", "Setting"]}>
            {perms.roles.map((role, idx) => (
              <React.Fragment key={'ff' + idx}>
                <tr>
                  <td colSpan="3" className="has-text-link">
                    {role}
                  </td>
                  {/* <td>
                    <Icon icon="fas fa-ban" />
                    <span>Remove</span>
                  </td> */}
                </tr>
                {Object.keys(perms.getRole(role)).map((row, idx) => (
                  <tr key={'k' + idx}>
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
            {perms.principals.map((role, idx) => (
              <React.Fragment key={'f2' + idx}>
                <tr>
                  <td colSpan="3" className="has-text-link">
                    {role}
                  </td>
                </tr>
                {Object.keys(perms.getPrincipals(role)).map((row, idx) => (
                  <tr key={"x" + idx}>
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
            {perms.prinrole.map((role, idx) => (
              <React.Fragment key={role + idx}>
                <tr>
                  <td colSpan="3" className="has-text-link">
                    {role}
                  </td>
                </tr>
                {Object.keys(perms.getPrinroles(role)).map((row, idx) => (
                  <tr key={"xx" + idx}>
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
      <AddPermission refresh={setReset} reset={reset} />
    </div>
  );
}

const initial = {
  permissions: undefined,
  groups: undefined,
  roles: [],
  current: "",
  currentObj: undefined
};

const operations = [
  { text: "Allow", value: "Allow" },
  { text: "Deny", value: "Deny" },
  { text: "AllowSingle", value: "AllowSingle" },
  { text: "Unset", value: "Unset" }
];

const defaultOptions = [
  { text: "Choose..", value: "" },
  { text: "Role Permissions", value: "roleperm" },
  { text: "Principal Permissions", value: "prinperm" },
  { text: "Principal Roles", value: "prinrole" }
];

export function AddPermission({ refresh, reset }) {
  const Ctx = React.useContext(TraversalContext);
  const [state, setState] = useSetState(initial);

  React.useEffect(() => {
    async function init() {
      const permissions = (await Ctx.client.getAllPermissions(Ctx.path)).map(
        perm => ({
          text: perm,
          value: perm
        })
      );
      let req = await Ctx.client.getGroups(Ctx.path);
      const groups = (await req.json()).map(group => ({
        text: group.id,
        value: group.id
      }));
      req = await Ctx.client.getRoles(Ctx.path);
      const roles = (await req.json()).map(role => ({
        text: role,
        value: role
      }));
      setState({ permissions, groups, roles });
    };

    init();
  }, [reset]);

  return (
    <div className="column is-4 is-size-7">
      <h1 className="title is-size-5">Add Permissions</h1>
      <p>Select a type:</p>
      <Select
        options={defaultOptions}
        onChange={v => setState({ current: v.target.value })}
      />
      <hr />
      {state.current && state.current === "roleperm" && (
        <PermissionRoleperm
          {...state}
          operations={operations}
          refresh={refresh}
        />
      )}
      {state.current && state.current === "prinperm" && (
        <PermissionPrinperm
          {...state}
          operations={operations}
          refresh={refresh}
        />
      )}
      {state.current && state.current === "prinrole" && (
        <PermissionPrinrole
          {...state}
          operations={operations}
          refresh={refresh}
        />
      )}
    </div>
  );
}
