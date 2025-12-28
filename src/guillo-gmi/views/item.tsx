import { TabsPanel } from '../components/tabs'
import { useTraversal } from '../contexts'
import { PanelPermissions } from '../components/panel/permissions'
import { PanelBehaviors } from '../components/panel/behaviors'
import { PanelProperties } from '../components/panel/properties'
import { PanelActions } from '../components/panel/actions'
import { PanelEditForm } from '../components/panel/editForm'
import { Confirm } from '../components/modal'
import { useTabDirtyGuard } from '../hooks/useTabDirtyGuard'
import { useIntl } from 'react-intl'

const tabs = {
  Properties: PanelProperties,
  Edit: PanelEditForm,
  Behaviors: PanelBehaviors,
  Permissions: PanelPermissions,
  Actions: PanelActions,
}

const tabsPermissions = {
  Properties: 'guillotina.ViewContent',
  Edit: 'guillotina.ModifyContent',
  Behaviors: 'guillotina.ModifyContent',
  Permissions: 'guillotina.SeePermissions',
}

export function ItemCtx() {
  const intl = useIntl()
  const ctx = useTraversal()
  const calculated = ctx.filterTabs(tabs, tabsPermissions)

  const {
    showConfirmModal,
    handleDirtyChange,
    handleBeforeTabChange,
    handleConfirmLeave,
    handleCancelLeave,
  } = useTabDirtyGuard()

  return (
    <>
      <TabsPanel
        tabs={calculated}
        currentTab="Properties"
        onBeforeTabChange={handleBeforeTabChange}
        onDirtyChange={handleDirtyChange}
      />
      {showConfirmModal && (
        <Confirm
          message={intl.formatMessage({
            id: 'unsaved_changes_confirm',
            defaultMessage:
              'You have unsaved changes. Do you want to discard them?',
          })}
          onCancel={handleCancelLeave}
          onConfirm={handleConfirmLeave}
        />
      )}
    </>
  )
}
