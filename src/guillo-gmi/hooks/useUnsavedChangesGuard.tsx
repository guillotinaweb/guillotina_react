import { useState, useEffect, useCallback, useRef } from 'react'

interface UseUnsavedChangesGuardOptions {
  /** Whether there are unsaved changes */
  isDirty: boolean
  /** Message to show in the browser's beforeunload dialog (browsers may ignore custom messages) */
  message?: string
}

interface UseUnsavedChangesGuardReturn {
  /** Whether the confirmation modal should be shown */
  showConfirmModal: boolean
  /** Hide the confirmation modal */
  hideConfirmModal: () => void
  /** Confirm leaving (execute the pending action) */
  confirmLeave: () => void
  /** Cancel leaving (stay on current view) */
  cancelLeave: () => void
  /**
   * Wrap an action that should be guarded.
   * If there are unsaved changes, shows confirmation modal instead of executing immediately.
   * If no changes, executes the action immediately.
   */
  guardedAction: (action: () => void) => void
  /**
   * Create a guarded version of a callback.
   * Useful for event handlers where you need to pass a function reference.
   */
  createGuardedCallback: <T extends (...args: unknown[]) => void>(
    callback: T
  ) => (...args: Parameters<T>) => void
}

/**
 * Hook for managing unsaved changes warnings
 * Handles both browser beforeunload events and internal navigation
 */
export function useUnsavedChangesGuard({
  isDirty,
  message = 'You have unsaved changes. Are you sure you want to leave?',
}: UseUnsavedChangesGuardOptions): UseUnsavedChangesGuardReturn {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const pendingActionRef = useRef<(() => void) | null>(null)

  // Handle browser beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        // Modern browsers ignore custom messages but we set it anyway
        e.returnValue = message
        return message
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty, message])

  const hideConfirmModal = useCallback(() => {
    setShowConfirmModal(false)
    pendingActionRef.current = null
  }, [])

  const confirmLeave = useCallback(() => {
    const action = pendingActionRef.current
    pendingActionRef.current = null
    setShowConfirmModal(false)
    if (action) {
      action()
    }
  }, [])

  const cancelLeave = useCallback(() => {
    pendingActionRef.current = null
    setShowConfirmModal(false)
  }, [])

  const guardedAction = useCallback(
    (action: () => void) => {
      if (isDirty) {
        pendingActionRef.current = action
        setShowConfirmModal(true)
      } else {
        action()
      }
    },
    [isDirty]
  )

  const createGuardedCallback = useCallback(
    <T extends (...args: unknown[]) => void>(callback: T) => {
      return (...args: Parameters<T>) => {
        guardedAction(() => callback(...args))
      }
    },
    [guardedAction]
  )

  return {
    showConfirmModal,
    hideConfirmModal,
    confirmLeave,
    cancelLeave,
    guardedAction,
    createGuardedCallback,
  }
}

export default useUnsavedChangesGuard
