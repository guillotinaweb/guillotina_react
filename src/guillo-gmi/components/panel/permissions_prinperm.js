import React from "react";

import ErrorZone from "../error_zone";
import useSetState from "../../hooks/useSetState";
import { Button } from "../input/button";
import { Select } from "../input/select";
import { useCrudContext } from "../../hooks/useCrudContext";

export function PermissionPrinperm({
  groups,
  permissions,
  operations,
  refresh
}) {
  const { post, loading } = useCrudContext();
  const [state, setState] = useSetState({
    principal: undefined,
    permission: [],
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
    if (!state.principal || !state.setting || state.permission.length === 0) {
      setState({ error: "Invalid form" });
      return
    }
    const data = {
      prinperm: state.permission.map(perm => ({
        principal: state.principal,
        permission: perm,
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
        <label className="label">Select permissions</label>
        <Select
          options={permissions}
          onChange={getMultiples("permission", setState)}
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
