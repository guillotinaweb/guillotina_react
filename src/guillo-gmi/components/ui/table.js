import React from "react";
import { classnames } from "../../lib/helpers";

export function Table({ headers, children, className }) {
  className = className
    ? className.split(" ")
    : " is-full is-fullwidth is-narrow".split(" ");
  return (
    <table className={classnames(["table", ...className])}>
      <thead>
        <tr>{headers && headers.map(item => <th>{item}</th>)}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
