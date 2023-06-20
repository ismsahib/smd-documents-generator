import { renderAsync } from "docx-preview";
import React, { Dispatch, FC, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

interface MyModalProps {
  modalShow: boolean;
  setModalShow: Dispatch<React.SetStateAction<boolean>>;
  modalData: Blob | string;
}
const MyModal: FC<MyModalProps> = ({ modalShow, setModalShow, modalData }) => {
  useEffect(() => {
    if (typeof modalData !== "string") {
      const container = document.getElementById("preview-container-modal-data");
      if (container)
        renderAsync(modalData, container, container, {
          inWrapper: false,
          ignoreWidth: true,
          ignoreHeight: true,
        });
    }
  }, [modalData]);
  return (
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Предварительный просмотр документа</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="preview-container-modal-data"></div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setModalShow(false)}>Закрыть</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;
