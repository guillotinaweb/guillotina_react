import React from 'react';
import {useState} from 'react';
import { TraversalContext } from '../contexts';


export function TabsPanel({tabs, currentTab, rightToolbar, ...props}) {

  const Ctx = React.useContext(TraversalContext)

  currentTab = currentTab || Object.keys(tabs)[0]
  const [current, setTab] = useState(currentTab)
  const CurrentComp = tabs[current]

  React.useEffect(() => {
    if (Object.keys(tabs).includes("Items")) {
      setTab("Items")
    }
  }, [Ctx.state])

  return (
    <div className="container">
    <div className="level">
      <div className="level-left">
        <div className="tabs">
          <ul>
            {Object.keys(tabs).map(tab =>
              <li className={ 'is-size-7 ' + ((tab === current) ? 'is-active' : '')}
                key={tab}>
                <a onClick={() => setTab(tab)}>{tab}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      {rightToolbar && <div className="level-right">
         {rightToolbar}
      </div>}
    </div>
    <div className="container">
      <CurrentComp title={current} {...props} />
    </div>
  </div>
  )
}
