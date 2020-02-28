import React from "react";

export const Config = {
  DisabledTypes: ["UserManager", "GroupManager"],
  PageSize: 10,
  DelayActions: 200,
}



let calculated = Object.assign({}, Config);

const addConfig = (additional, original) => {
  const rest = Object.assign({}, original);
  Object.keys(additional).forEach(item => {
    if (typeof Config[item] === "object" && Array.isArray(Config[item])) {
      rest[item] = [].concat(Config[item], additional[item]);
    } else if (typeof Config[item] === "object") {
      rest[item] = Object.assign({}, Config[item], additional[item]);
    } else {
      rest[item] = additional[item];
    }
  });
  return rest;
};

export function useConfig(cfg) {
  const ref = React.useRef();
  if (cfg && !ref.current) {
    console.log("cfg", cfg)
    calculated = addConfig(cfg, calculated);
    ref.current = calculated
  }

  // if (cfg && !ref.current) {
  //   ref.current = addConfig(cfg, ref.current);
  //   calculated = ref.current
  //   console.log("Current config", cfg)
  // }
  return calculated
}
