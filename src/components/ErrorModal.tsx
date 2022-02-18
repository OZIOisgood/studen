import { FC, useContext } from "react";
import {
  Button,
  Container,
  Alert,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import { FirebaseContext } from "../context/firebase";
import { collection, DocumentData, query } from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { Avatar } from "../components";

type ErrorModalProps = {
  modalTitle: string;
  buttonTitle: string;

  showErrorModal: any;
  handleCloseErrorModal: any;

  errorMessage: string;
};

export const ErrorModal: FC<ErrorModalProps> = ({
  modalTitle,
  buttonTitle,
  showErrorModal,
  handleCloseErrorModal,
  errorMessage,
}) => {
  return (
    <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Modal.Title className="fs-5 text-secondary">
          {errorMessage}
        </Modal.Title>
        <Form>
          <div className="d-grid mt-4">
            <Button
              variant="danger"
              className="text-white"
              onClick={handleCloseErrorModal}
            >
              <b>{buttonTitle}</b>
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
