import React, { useState } from 'react'
import { useLocation } from '../hooks/useLocation'
import { IndexSignature } from '../types/global'

function FallbackTab({ title }: { title: string }) {
  return <div>Tab &apos;{title}&apos; not found</div>
}

interface Props {
  tabs: IndexSignature
  currentTab: string
  rightToolbar?: React.ReactNode
  fallback?: React.ComponentType<{ title: string }>
}

export function TabsPanel({
  tabs,
  currentTab,
  rightToolbar,
  fallback = FallbackTab,
}: Props) {
  const [location, setLocation] = useLocation()

  currentTab = location.get('tab') || Object.keys(tabs)[0]
  /*if (!Object.keys(tabs).includes(currentTab)) {
    setLocation(defaultTab)
    currentTab = defaultTab
  }*/

  const [current, setTab] = useState(currentTab)
  const CurrentComp = tabs[current] || fallback

  React.useEffect(() => {
    if (Object.keys(tabs).includes(currentTab)) {
      setTab(currentTab)
      // setLocation({tab: currentTab})
    }
  }, [currentTab, tabs])

  const changeTab = (tab: string) => {
    setLocation({ tab: tab })
  }

  return (
    <div className="container">
      <div className="level is-flex-wrap-wrap">
        <div className="level-left mb-4">
          <div className="tabs">
            <ul>
              {Object.keys(tabs).map((tab) => (
                <li
                  className={
                    'is-size-7 ' + (tab === current ? 'is-active' : '')
                  }
                  key={tab}
                >
                  <a
                    data-test={`tabTest-${tab.toLowerCase()}`}
                    onClick={() => changeTab(tab)}
                  >
                    {tab}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {rightToolbar && <div className="level-right">{rightToolbar}</div>}
      </div>
      <div className="container">
        <CurrentComp title={current} />
      </div>
    </div>
  )
}
