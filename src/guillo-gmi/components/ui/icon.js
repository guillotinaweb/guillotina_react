import React from "react";
import { classnames } from "../../lib/helpers";

export const Icon = ({ icon, className, align }) => {
  const addClass = className ? className.split(" ") : [className];

  align = align || "is-right";

  return (
    <span className={classnames(["icon", align, ...addClass])}>
      <i className={icon}></i>
    </span>
  );
};
