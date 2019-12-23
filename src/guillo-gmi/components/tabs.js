import React from "react";
import { useState } from "react";
import { TraversalContext } from "../contexts";
import { useLocation } from "../hooks/useLocation";

export function TabsPanel({ tabs, currentTab, rightToolbar, ...props }) {

  const [location, setLocation] = useLocation();

  const defaultTab = currentTab

  if (location.get("tab")) {
    currentTab = location.get("tab");
  } else {
    currentTab = currentTab || Object.keys(tabs)[0];
  }

  /*if (!Object.keys(tabs).includes(currentTab)) {
    setLocation(defaultTab)
    currentTab = defaultTab
  }*/

  const [current, setTab] = useState(currentTab);
  const CurrentComp = tabs[current];

  React.useEffect(() => {
    if (Object.keys(tabs).includes(currentTab)) {
      setTab(currentTab);
      // setLocation({tab: currentTab})
    }
  }, [currentTab, tabs]);

  const changeTab = tab => {
    setLocation({ tab: tab });
  };

  return (
    <div className="container">
      <div className="level">
        <div className="level-left">
          <div className="tabs">
            <ul>
              {Object.keys(tabs).map(tab => (
                <li
                  className={
                    "is-size-7 " + (tab === current ? "is-active" : "")
                  }
                  key={tab}
                >
                  <a onClick={() => changeTab(tab)}>{tab}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {rightToolbar && <div className="level-right">{rightToolbar}</div>}
      </div>
      <div className="container">
        <CurrentComp title={current} {...props} />
      </div>
    </div>
  );
}
