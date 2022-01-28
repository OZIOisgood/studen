import { FC, useContext } from "react";
import { Button, Container, Alert, Row, Col } from "react-bootstrap";
import { FirebaseContext } from "../context/firebase";
import { collection, DocumentData, query } from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { Avatar } from "../components";

type UsersProps = {
  users: any;
  title: string;
};

export const Users: FC<UsersProps> = ({ users, title }) => {
  return (
    <Alert variant="dark box mt-5">
      <h2 className="text-white">{title}</h2>
      <Container className="d-grid gap-3 mt-5">
        {users?.map((item: any, index: number) => (
          <Button
            disabled={true}
            variant="secondary"
            key={item.id}
            className="user-btn"
          >
            <Row>
              <Col xs={1} className="user-number">
                <h4 className="text-align-right">{index + 1}.</h4>
              </Col>
              <Col xs={1} className="user-avatar text-align-left">
                <Avatar email={item.email} height={28} size={50} />
              </Col>
              <Col xs={10} className="user-fullName p-3 pt-0 pr-0 pb-0">
                <h4 className="text-align-left">{`${item.lastName} ${item.firstName}`}</h4>
              </Col>
            </Row>
          </Button>
        ))}
      </Container>
    </Alert>
  );
};
