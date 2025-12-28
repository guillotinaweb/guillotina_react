import { useState, useCallback } from 'react'

interface UseTabDirtyGuardResult {
  isEditDirty: boolean
  showConfirmModal: boolean
  handleDirtyChange: (isDirty: boolean) => void
  handleBeforeTabChange: (newTab: string) => boolean
  handleConfirmLeave: () => void
  handleCancelLeave: () => void
}

/**
 * Hook to manage dirty state and confirmation modal for tab navigation.
 * Used to prevent accidental loss of unsaved changes when switching tabs.
 */
export function useTabDirtyGuard(): UseTabDirtyGuardResult {
  const [isEditDirty, setIsEditDirty] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingTab, setPendingTab] = useState<string | null>(null)

  const handleDirtyChange = useCallback((isDirty: boolean) => {
    setIsEditDirty(isDirty)
  }, [])

  const handleBeforeTabChange = useCallback(
    (newTab: string): boolean => {
      if (isEditDirty) {
        setPendingTab(newTab)
        setShowConfirmModal(true)
        return false
      }
      return true
    },
    [isEditDirty]
  )

  const handleConfirmLeave = useCallback(() => {
    setShowConfirmModal(false)
    setIsEditDirty(false)
    if (pendingTab) {
      const tabLink = document.querySelector(
        `[data-test="tabTest-${pendingTab.toLowerCase()}"]`
      ) as HTMLElement
      if (tabLink) {
        tabLink.click()
      }
    }
    setPendingTab(null)
  }, [pendingTab])

  const handleCancelLeave = useCallback(() => {
    setShowConfirmModal(false)
    setPendingTab(null)
  }, [])

  return {
    isEditDirty,
    showConfirmModal,
    handleDirtyChange,
    handleBeforeTabChange,
    handleConfirmLeave,
    handleCancelLeave,
  }
}
