import React from "react";

import { Delete } from "./ui";
import { ItemModel } from "../models";
import { TraversalContext } from "../contexts";
import { useContext } from "react";
import { Icon } from "./ui/icon";

export function Item({ item, setPath, icon }) {
  const Ctx = useContext(TraversalContext);
  const link = () => Ctx.setPath(item.path);
  return (
    <tr>
      <td onClick={link} style={{ width: "25px" }}>
        {icon && <Icon icon={icon} />}
      </td>
      <td onClick={link}>{item.id}</td>
    </tr>
  );
}

const smallcss = {
  width: "25px"
};

const mediumcss = {
  width: "120px"
};

export function RItem({ item }) {
  const traversal = useContext(TraversalContext);
  const model = new ItemModel(item, traversal.url, traversal.path);
  const link = () => traversal.setPath(model.path);

  return (
    <tr>
      <td style={smallcss}>{<Icon icon={model.icon} />}</td>
      <td style={smallcss} onClick={link}>
        <span className="tag">{model.type}</span>
      </td>
      <td onClick={link}>
        {model.name}
        {traversal.state.search && (
          <React.Fragment>
            <br />
            <span className="is-size-7 tag is-light">{model.path}</span>
          </React.Fragment>
        )}
      </td>
      <td style={mediumcss} className="is-size-7 is-vcentered">
        {model.created}
      </td>
      <td style={mediumcss} className="is-size-7 is-vcentered">
        {model.updated}
      </td>
      <td style={smallcss}>
        {traversal.hasPerm("guillotina.DeleteContent") && (
          <Delete onClick={() => traversal.doAction("removeItem", model)} />
        )}
      </td>
    </tr>
  );
}

export function ItemTitle({ title, actions }) {
  return (
    <nav className="level">
      <div className="level-left">
        <div className="level-item">
          <h4 className="title has-text-primary is-size-5">{title}</h4>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">{actions && actions}</div>
      </div>
    </nav>
  );
}
