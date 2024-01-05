import React from 'react'
import usePortal from 'react-useportal'
import { Button } from './input/button'
import { useIntl } from 'react-intl'
import { genericMessages } from '../locales/generic_messages'

export function Modal(props) {
  const { isActive, setActive, children } = props
  const { Portal } = usePortal()

  const css = 'modal ' + (isActive ? 'is-active ' : '') + props.className
  return (
    <Portal>
      <div className={css}>
        <div className="modal-background" onClick={() => setActive(false)} />
        <div className="modal-content">
          <div className="box">{children}</div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => setActive(false)}
        />
      </div>
    </Portal>
  )
}

export function Confirm({ message, onCancel, onConfirm, loading }) {
  const intl = useIntl()
  const setActive = () => onCancel()
  return (
    <Modal isActive setActive={setActive} className="confirm">
      <React.Fragment>
        <h1 className="title is-size-5">{message || 'Are you Sure?'}</h1>
        <div className="level" style={{ marginTop: 50 }}>
          <div className="level-left"></div>
          <div className="level-right">
            <button
              className="button is-danger"
              onClick={() => onCancel()}
              data-test="btnCancelModalTest"
            >
              {intl.formatMessage(genericMessages.cancel)}
            </button>
            &nbsp;&nbsp;
            <Button
              loading={loading}
              className="is-success"
              onClick={() => onConfirm()}
              dataTest="btnConfirmModalTest"
            >
              {intl.formatMessage(genericMessages.confirm)}
            </Button>
          </div>
        </div>
      </React.Fragment>
    </Modal>
  )
}

// @todo Improve it... Replacing the inputText to a tree
export function PathTree({
  title,
  defaultPath,
  children,
  onConfirm,
  onCancel,
}) {
  const intl = useIntl()
  return (
    <Modal isActive setActive={onCancel}>
      <h1>{title}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onConfirm(e.target[0].value, e.target)
        }}
      >
        <small style={{ display: 'block', marginTop: 20 }}>
          {`Example: /folder (without /db/container on front)`}
        </small>
        <input
          className="input mb-3"
          defaultValue={defaultPath}
          type="text"
          data-test="inputPathTreeTest"
        />
        {children}
        <div className="level-right mt-3">
          <button
            type="button"
            className="button is-danger"
            onClick={onCancel}
            data-test="btnCancelModalTest"
          >
            {intl.formatMessage(genericMessages.cancel)}
          </button>
          &nbsp;&nbsp;
          <button
            type="submit"
            className="button is-success"
            data-test="btnConfirmModalTest"
          >
            {intl.formatMessage(genericMessages.confirm)}
          </button>
        </div>
      </form>
    </Modal>
  )
}
