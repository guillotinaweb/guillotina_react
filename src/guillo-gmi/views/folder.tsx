import { TabsPanel } from '../components/tabs'
import { ContextToolbar } from '../components/context_toolbar'
import { PanelItems } from '../components/panel/items'
import { PanelActions } from '../components/panel/actions'
import { useTraversal } from '../contexts'
import { PanelProperties } from '../components/panel/properties'
import { PanelPermissions } from '../components/panel/permissions'
import { PanelBehaviors } from '../components/panel/behaviors'
import { PanelEditForm } from '../components/panel/editForm'
import { Confirm } from '../components/modal'
import { useTabDirtyGuard } from '../hooks/useTabDirtyGuard'
import { useIntl } from 'react-intl'

const tabs = {
  Items: PanelItems,
  Properties: PanelProperties,
  Edit: PanelEditForm,
  Behaviors: PanelBehaviors,
  Permissions: PanelPermissions,
  Actions: PanelActions,
}

const tabsPermissions = {
  Items: 'guillotina.ViewContent',
  Properties: 'guillotina.ViewContent',
  Edit: 'guillotina.ModifyContent',
  Behaviors: 'guillotina.ModifyContent',
  Permissions: 'guillotina.SeePermissions',
}

export function FolderCtx() {
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
        currentTab="Items"
        rightToolbar={<ContextToolbar />}
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
