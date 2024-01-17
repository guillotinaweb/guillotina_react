import { Button } from '../input/button'
import { Confirm } from '../modal'
import { Delete } from '../ui'
import { FileUpload } from '../input/upload'
import { useCrudContext } from '../../hooks/useCrudContext'
import { EditableField } from '../fields/editableField'
import { useConfig } from '../../hooks/useConfig'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import { defineMessages, useIntl } from 'react-intl'
import {
  genericFileMessages,
  genericMessages,
} from '../../locales/generic_messages'

const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))
    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])
  if (!enabled) {
    return null
  }
  return <Droppable {...props}>{children}</Droppable>
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const _sizesImages = ['large', 'preview', 'mini', 'thumb']
const messages = defineMessages({
  failed_to_sort_images: {
    id: 'failed_to_sort_images',
    defaultMessage: 'Failed to sort images',
  },
  images_sorted: {
    id: 'images_sorted',
    defaultMessage: 'Images sorted',
  },
})
export function IMultiImageOrderedAttachment({ properties, values }) {
  const intl = useIntl()
  const cfg = useConfig()
  const [sortedList, setSortedList] = useState(Object.keys(values['images']))
  const [file, setFile] = useState(null)
  const [fileKeyToDelete, setFileKeyToDelete] = useState(undefined)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const { Ctx } = useCrudContext()
  const modifyContent = Ctx.hasPerm('guillotina.ModifyContent')

  const sizesImages = cfg.size_images || _sizesImages

  async function onDragEnd(result) {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const resultSorted = reorder(
      sortedList,
      result.source.index,
      result.destination.index
    )

    setSortedList(resultSorted)
    setLoading(true)
    const endpoint = `${Ctx.path}@sort/images/`
    const req = await Ctx.client.patch(endpoint, resultSorted)
    if (req.status !== 200) {
      setError(intl.formatMessage(messages.failed_to_sort_images))
      setLoading(false)
      return
    }

    setLoading(false)
    Ctx.flash(intl.formatMessage(messages.images_sorted), 'success')
    Ctx.refresh()
  }

  const uploadFile = async (ev) => {
    ev.preventDefault()
    if (!file) {
      setError(intl.formatMessage(genericFileMessages.error_file_key_name))
      return
    }
    setLoading(true)
    setError(undefined)
    const fileKey = uuidv4()
    const endpoint = `${Ctx.path}@upload/images/${fileKey}`
    const req = await Ctx.client.upload(endpoint, file)
    if (req.status !== 200) {
      setError(intl.formatMessage(genericFileMessages.error_upload_file))
      setLoading(false)
      return
    }

    for (let i = 0; i < sizesImages.length; i++) {
      const endpointSize = `${Ctx.path}@images/images/${fileKey}/${sizesImages[i]}`
      let hasError = false
      try {
        const req = await Ctx.client.upload(endpointSize, file)
        if (req.status !== 200) hasError = true
      } catch (err) {
        hasError = true
      }

      if (hasError) {
        setError(
          intl.formatMessage(genericFileMessages.error_upload_file_size, {
            size: sizesImages[i],
          })
        )
        setLoading(false)
        return
      }
    }

    setFile(undefined)
    setLoading(false)
    Ctx.flash(intl.formatMessage(genericFileMessages.image_uploaded), 'success')
    Ctx.refresh()
  }

  const deleteFile = async () => {
    setLoading(true)
    setError(undefined)
    const endpoint = `${Ctx.path}@delete/images/${fileKeyToDelete}`
    const req = await Ctx.client.delete(endpoint, file)
    if (req.status !== 200) {
      setError(intl.formatMessage(genericFileMessages.failed_delete_file))
      setLoading(false)
      return
    }
    setLoading(false)
    Ctx.flash(intl.formatMessage(genericFileMessages.image_deleted), 'success')
    Ctx.refresh()
  }

  return (
    <React.Fragment>
      {fileKeyToDelete && (
        <Confirm
          loading={loading}
          onCancel={() => setFileKeyToDelete(undefined)}
          onConfirm={() => deleteFile()}
          message={
            (intl.formatMessage(
              genericFileMessages.confirm_message_delete_file
            ),
            { fileKeyToDelete })
          }
        />
      )}
      <section>
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {sortedList.map((key, index) => (
                  <Draggable
                    key={`multiimageattachment_${key}`}
                    draggableId={`multiimageattachment_${key}`}
                    index={index}
                  >
                    {(providedChild) => (
                      <div
                        className="is-flex is-align-items-center pt-2 pb-2"
                        style={{ borderTop: '1px solid #dbdbdb' }}
                        ref={providedChild.innerRef}
                        {...providedChild.draggableProps}
                        {...providedChild.dragHandleProps}
                      >
                        <EditableField
                          field={`images/${key}`}
                          value={values['images'][key]}
                          ns="guillotina.contrib.image.behaviors.IMultiImageAttachment.images"
                          schema={properties['images']['additionalProperties']}
                          modifyContent={false}
                          required={false}
                        />
                        <div className="ml-5">
                          <Delete
                            onClick={(ev) => {
                              ev.preventDefault()
                              setFileKeyToDelete(key)
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </section>

      {Object.keys(values['images']).length === 0 && (
        <section>
          {intl.formatMessage(genericFileMessages.no_images_uploaded)}
        </section>
      )}
      {modifyContent && (
        <section>
          <label className="label">
            {intl.formatMessage(genericFileMessages.upload_an_image)}
          </label>

          <form
            className="is-flex is-align-items-center"
            style={{ gap: '15px' }}
            data-test="formMultiimageOrderedAttachmentTest"
          >
            <div>
              <FileUpload onChange={(ev) => setFile(ev)} />
              {file && file.filename}
            </div>
            <div>
              <Button
                className="is-primary is-small"
                loading={loading}
                onClick={uploadFile}
                disabled={!file}
              >
                {intl.formatMessage(genericMessages.upload)}
              </Button>
            </div>
          </form>
          {error && <p className="help is-danger">{error}</p>}
        </section>
      )}
    </React.Fragment>
  )
}
