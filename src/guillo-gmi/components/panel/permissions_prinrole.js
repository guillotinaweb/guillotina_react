import React from "react";
import { Select } from "../input/select";
import { Button } from "../input/button";
import { useCrudContext } from "../../hooks/useCrudContext";
import { useSetState } from "react-use";
import ErrorZone from "../error_zone";

export function PermissionPrinrole({
  groups,
  roles,
  operations,
  refresh
}) {
  const { post, loading } = useCrudContext();
  const [state, setState] = useSetState({
    principal: undefined,
    roles: [],
    setting: undefined,
    error: undefined
  });

  const getMultiples = (field, setter) => ev => {
    let values = [];
    for (let i = 0; i < ev.target.selectedOptions.length; i++) {
      values = values.concat([ev.target.selectedOptions[i].value]);
    }
    setter({ [field]: values });
  };

  const savePermission = async ev => {
    if (!state.principal || !state.setting || state.roles.length === 0) {
      setState({ error: "Invalid form" });
      return
    }
    const data = {
      prinrole: state.roles.map(perm => ({
        principal: state.principal,
        role: perm,
        setting: state.setting
      }))
    };
    await post(data, "@sharing", false);
    refresh(Math.random());
  };

  return (
    <div className="container">
      {loading}
      {state.error && <ErrorZone>Invalid form data</ErrorZone>}
      <div className="field">
        <label className="label">Select a Principal</label>
        <Select
          appendDefault
          options={groups}
          onChange={ev => setState({ principal: ev.target.value })}
        />
      </div>
      <div className="field">
        <label className="label">Select a Role</label>
        <Select
          options={roles}
          onChange={getMultiples("roles", setState)}
          size={5}
          multiple
        />
      </div>
      <div className="field">
        <label className="label">Operation</label>
        <Select
          appendDefault
          options={operations}
          onChange={ev => setState({ setting: ev.target.value })}
        />
      </div>
      <Button
        className="is-primary is-small"
        loading={loading}
        onClick={savePermission}
      >
        Save
      </Button>
    </div>
  );
}
