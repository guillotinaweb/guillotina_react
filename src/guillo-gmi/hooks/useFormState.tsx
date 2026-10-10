import { useState, useCallback, useMemo } from 'react'
import { IndexSignature, EditableFieldValue } from '../types/global'

interface UseFormStateOptions<T extends IndexSignature> {
  initialValues: T
  onSubmit?: (changedFields: Partial<T>) => void | Promise<void>
}

interface UseFormStateReturn<T extends IndexSignature> {
  /** Current form data */
  formData: T
  /** Set a single field value */
  setFieldValue: (field: keyof T, value: EditableFieldValue) => void
  /** Set multiple field values at once */
  setFieldValues: (values: Partial<T>) => void
  /** Whether any field has been modified */
  isDirty: boolean
  /** Get only the fields that have been modified */
  getChangedFields: () => Partial<T>
  /** Reset form to initial values */
  resetForm: () => void
  /** Reset form with new initial values */
  resetFormWithValues: (newValues: T) => void
  /** Check if a specific field has been modified */
  isFieldDirty: (field: keyof T) => boolean
  /** Get the number of modified fields */
  changedFieldsCount: number
  /** Set of field names that have been modified */
  dirtyFields: Set<keyof T>
}

/**
 * Hook for managing form state with dirty tracking
 * Compares current values with initial values to determine which fields have changed
 */
export function useFormState<T extends IndexSignature>({
  initialValues,
}: UseFormStateOptions<T>): UseFormStateReturn<T> {
  const [formData, setFormData] = useState<T>(initialValues)
  const [baseValues, setBaseValues] = useState<T>(initialValues)

  const setFieldValue = useCallback(
    (field: keyof T, value: EditableFieldValue) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    },
    []
  )

  const setFieldValues = useCallback((values: Partial<T>) => {
    setFormData((prev) => ({
      ...prev,
      ...values,
    }))
  }, [])

  const isValueEqual = useCallback(
    (a: EditableFieldValue, b: EditableFieldValue): boolean => {
      // Handle null/undefined
      if (a === b) return true
      if (a == null && b == null) return true
      if (a == null || b == null) return false

      // Handle arrays
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false
        return a.every((val, idx) => isValueEqual(val, b[idx]))
      }

      // Handle objects (but not arrays)
      if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a as object)
        const keysB = Object.keys(b as object)
        if (keysA.length !== keysB.length) return false
        return keysA.every((key) =>
          isValueEqual((a as IndexSignature)[key], (b as IndexSignature)[key])
        )
      }

      return a === b
    },
    []
  )

  const dirtyFields = useMemo(() => {
    const dirty = new Set<keyof T>()
    Object.keys(formData).forEach((key) => {
      const field = key as keyof T
      if (!isValueEqual(formData[field], baseValues[field])) {
        dirty.add(field)
      }
    })
    return dirty
  }, [formData, baseValues, isValueEqual])

  const isDirty = useMemo(() => dirtyFields.size > 0, [dirtyFields])

  const changedFieldsCount = useMemo(() => dirtyFields.size, [dirtyFields])

  const isFieldDirty = useCallback(
    (field: keyof T): boolean => {
      return dirtyFields.has(field)
    },
    [dirtyFields]
  )

  const getChangedFields = useCallback((): Partial<T> => {
    const changed: Partial<T> = {}
    dirtyFields.forEach((field) => {
      changed[field] = formData[field]
    })
    return changed
  }, [formData, dirtyFields])

  const resetForm = useCallback(() => {
    setFormData(baseValues)
  }, [baseValues])

  const resetFormWithValues = useCallback((newValues: T) => {
    setBaseValues(newValues)
    setFormData(newValues)
  }, [])

  return {
    formData,
    setFieldValue,
    setFieldValues,
    isDirty,
    getChangedFields,
    resetForm,
    resetFormWithValues,
    isFieldDirty,
    changedFieldsCount,
    dirtyFields,
  }
}

export default useFormState
