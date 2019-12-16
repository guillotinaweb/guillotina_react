import React from 'react'
import {Modal as ModalBase} from 'bloomer'
import {
  ModalBackground,
  ModalContent,
  ModalClose
} from 'bloomer'
import {Box} from 'bloomer'


export function Modal(props) {
  const {isActive, setActive, children, ...rest} = props

  return (
    <ModalBase isActive={isActive} {...rest}>
      <ModalBackground onClick={() => setActive(false)}  />
        <ModalContent>
          <Box>
          {children}
          </Box>
        </ModalContent>
      <ModalClose onClick={() => setActive(false)} />
    </ModalBase>
  )
}


export function Confirm({message, onCancel, onConfirm}) {
  const setActive = (p) => onCancel()
  return (
    <Modal isActive setActive={setActive}>
      <React.Fragment>
        <h1 className="title is-size-4">{message || 'Are you Sure?'}</h1>
        <div className="level" style={{marginTop:'50px;'}}>
          <div className="level-left"></div>
          <div className="level-right">
          <button className="button is-danger"
              onClick={() => onCancel()}>Cancel</button>
              &nbsp;&nbsp;
            <button className="button is-success"
              onClick={() => onConfirm()}>Confirm</button>
          </div>
        </div>
      </React.Fragment>
    </Modal>
  )
}
