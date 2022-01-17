import React, { FC } from "react";
import {
  Button,
  Container,
  Alert,
  ButtonGroup,
  Row,
  Col,
} from "react-bootstrap";
import moment from "moment";
import { firestore } from "../firebase-config";
import { collection, query, orderBy, where } from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { getPrettyTimeByStamp, getTimeNow } from "../utils";
import { Avatar, Schedule, PrivateRoute, NavBar } from "../components";

import "../styles/components/schedule.sass";

export const Users: FC = () => {
  const usersCollectionRef = collection(firestore, "users");
  const usersQuery = query(usersCollectionRef);
  const users = useFirestoreQuery(usersQuery);

  return (
    <Alert variant="dark box mt-5">
      <h2 className="text-white">All users</h2>
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
                <h4>{index + 1}.</h4>
              </Col>
              <Col xs={1} className="user-avatar">
                <Avatar email={item.email} height={28} size={50} />
              </Col>
              <Col xs={12} sm={10} className="user-email">
                <h4>{item.email}</h4>
              </Col>
            </Row>
          </Button>
        ))}
      </Container>
    </Alert>
  );
};
