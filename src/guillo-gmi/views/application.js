import React from "react";

import { Item } from "../components/item";
import { ItemTitle } from "../components/item";
import { Button } from "../components/input/button";
import { useState } from "react";
import { useContext } from "react";
import { useRef } from 'react'
import { TraversalContext } from "../contexts";
import { Modal } from "../components/modal";
import { Form } from "../components/input/form";
import { Input } from "../components/input/input";

export function ApplicationCtx(props) {
  const { databases } = props.state.context;
  return (
    <React.Fragment>
      <h3>Databases</h3>
      <div className="container">
        <ItemTitle title="Objects" />
        {databases.map(db => (
          <Item
            item={{ id: db, path: `/${db}/` }}
            key={db}
            icon={"fas fa-database"}
          />
        ))}
      </div>
    </React.Fragment>
  );
}

export function DatabaseCtx({ state, client, ...props }) {
  const Ctx = useContext(TraversalContext);
  const { containers } = state.context;
  const { path } = state;
  return (
    <React.Fragment>
      <div className="container">
        <ItemTitle title="Containers" actions={<CreateContainer />} />
        <table className="table is-fullwidth is-hoverable">
          <tbody>
            {containers.map(db => (
              <Item
                item={{ id: db, path: `${path}${db}/` }}
                key={db}
                icon={"fas fa-archive"}
                setPath={Ctx.setPath}
              />
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

export function CreateContainer(props) {
  const [isActive, setActive] = useState(false);

  return (
    <React.Fragment>
      <ModalAddContainer isActive={isActive} setActive={setActive} {...props} />
      <button
        className="button is-warning is-pulled-right"
        onClick={() => setActive(true)}
      >
        <span className="icon is-small">
          <i className="fas fa-plus"></i>
        </span>
        <span>Create</span>
      </button>
    </React.Fragment>
  );
}

function ModalAddContainer({ isActive, setActive }) {
  const Ctx = useContext(TraversalContext);
  const [isLoading, setLoading] = useState(false);
  const [idField, setId] = useState("");
  const [error, setError] = useState(undefined);
  const traversal = useContext(TraversalContext);

  async function createContainer(ev) {
    setLoading(true);
    const data = {
      "@type": "Container",
      id: idField
    };
    try {
      const res = await Ctx.client.createObject(Ctx.path, data);
      const result = await res.json();
      if (res.status === 200) {
        Ctx.refresh();
        setId("");
        setLoading(false);
        setActive(false);
        traversal.flash("Container created", "primary");
      } else {
        setId("");
        setLoading(false);
        setError(result.message);
      }
    } catch {
      setError("Error-submitting-form");
      setLoading(false);
    }
  }

  return (
    <Modal isActive={isActive} setActive={setActive}>
      <Form onSubmit={createContainer} title="Add Container" error={error}>
        <Input
          required
          placeholder="Container Name"
          onChange={v => {
            setId(v)
          }}
          value={idField}
          loading={isLoading}
        />
        <Button loading={isLoading}>Add Container</Button>
      </Form>
    </Modal>
  );
}
