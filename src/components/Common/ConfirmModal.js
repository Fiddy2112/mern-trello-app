import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { MODAL_ACTION_CONFIRM, MODAL_ACTION_CLOSE } from "utilities/constants";

function ConfirmModal(props) {
  const { title, content, show, onAction } = props;

  return (
    //backdrop="static" keyboard={false} animation={false} to disable closing the modal by clicking outside of it or by pressing the Esc key
    <Modal show={show} onHide={() => onAction(MODAL_ACTION_CLOSE)}>
      <Modal.Header closeButton>
        <Modal.Title className="h5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => onAction(MODAL_ACTION_CLOSE)}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => onAction(MODAL_ACTION_CONFIRM)}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
