import React, { useState, useCallback } from 'react'
import { useLocation } from '../hooks/useLocation'
import { IndexSignature } from '../types/global'

function FallbackTab({ title }: { title: string }) {
  return <div>Tab &apos;{title}&apos; not found</div>
}

interface TabsPanelProps {
  tabs: IndexSignature
  currentTab: string
  rightToolbar?: React.ReactNode
  fallback?: React.ComponentType<{ title: string }>
  /**
   * Optional callback called before changing tabs.
   * If it returns false (or a Promise resolving to false), the tab change is prevented.
   * Useful for warning about unsaved changes.
   */
  onBeforeTabChange?: (newTab: string) => boolean | Promise<boolean>
}

type TabsPanelPropsWithChildren<T = Record<string, unknown>> = TabsPanelProps &
  T

export function TabsPanel<
  T extends Record<string, unknown> = Record<string, unknown>
>({
  tabs,
  currentTab,
  rightToolbar,
  fallback = FallbackTab,
  onBeforeTabChange,
  ...restProps
}: TabsPanelPropsWithChildren<T>) {
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

  const changeTab = useCallback(
    async (tab: string) => {
      if (onBeforeTabChange) {
        const canChange = await onBeforeTabChange(tab)
        if (!canChange) {
          return
        }
      }
      setLocation({ tab: tab })
    },
    [onBeforeTabChange, setLocation]
  )

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
        <CurrentComp title={current} {...restProps} />
      </div>
    </div>
  )
}
