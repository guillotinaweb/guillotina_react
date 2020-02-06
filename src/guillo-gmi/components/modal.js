import React from "react";
import usePortal from "react-useportal";

export function Modal(props) {
  const { isActive, setActive, children } = props;
  const { Portal } = usePortal();

  const css = "modal " + (isActive ? "is-active " : "") + props.className;
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
  );
}

export function Confirm({ message, onCancel, onConfirm }) {
  const setActive = p => onCancel();
  return (
    <Modal isActive setActive={setActive} className="confirm">
      <React.Fragment>
        <h1 className="title is-size-5">{message || "Are you Sure?"}</h1>
        <div className="level" style={{ marginTop: 50 }}>
          <div className="level-left"></div>
          <div className="level-right">
            <button className="button is-danger" onClick={() => onCancel()}>
              Cancel
            </button>
            &nbsp;&nbsp;
            <button className="button is-success" onClick={() => onConfirm()}>
              Confirm
            </button>
          </div>
        </div>
      </React.Fragment>
    </Modal>
  );
}

// @todo Improve it... Replacing the inputText to a tree
export function PathTree({ title, onConfirm, onCancel }){
  return (
    <Modal isActive setActive={onCancel}>
      <h1>{title}</h1>
      <form onSubmit={e => {
          e.preventDefault()
          onConfirm(e.target[0].value)
      }}>
        <input 
          className="input"
          placeholder="/folder (without /db/container on front)"
          style={{ margin: '20px 0'}}
          type="text" 
        />
        <div className="level-right">
          <button type="button" className="button is-danger" onClick={onCancel}>
            Cancel
          </button>
          &nbsp;&nbsp;
          <button type="submit" className="button is-success">
            Confirm
          </button>
        </div>
      </form>
    </Modal>
  )
}
