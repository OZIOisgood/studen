import React, { FC, useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Alert,
  ButtonGroup,
  Row,
  Col,
} from "react-bootstrap";
import { collection, query, orderBy, where } from "firebase/firestore";
import { useFirestoreQuery, useAuthState } from "../hooks";
import { Avatar, Schedule, NavBar, PrivateRoute } from "../components";
import { FirebaseContext } from "../context/firebase";
import * as ROUTES from "../constants/routes";

const GroupsPage: FC = (props) => {
  console.clear();

  const { firestore } = useContext(FirebaseContext);

  const userJSON = localStorage.getItem("authUser");
  const user = userJSON ? JSON.parse(userJSON) : null;

  const myGroupsCollectionRef = collection(firestore, "groups");
  const myGroupsQuery = query(
    myGroupsCollectionRef,
    where("users", "array-contains", user.uid)
  );
  const myGroups = useFirestoreQuery(myGroupsQuery);

  console.log("~~~~~~~~~~~~~~~~ myGroups ~~~~~~~~~~~~~~~~");
  console.log(user);
  console.log(myGroups);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

  const allGroupsCollectionRef = collection(firestore, "groups");
  const allGroupsQuery = query(allGroupsCollectionRef);
  const allGroups = useFirestoreQuery(allGroupsQuery);

  return (
    <PrivateRoute>
      <Container className="mt-5">
        <h1 className="text-white">Groups</h1>

        <Alert variant="dark box mt-5">
          <h2 className="text-white">My groups</h2>
          <Container className="d-grid gap-3 mt-5">
            {myGroups?.map((item: any, index: number) => (
              <Button
                disabled={true}
                variant="secondary"
                href="#"
                key={item.id}
                className="user-btn"
              >
                <Row>
                  <Col xs={1} className="user-number">
                    <h4>{index + 1}.</h4>
                  </Col>
                  <Col xs={11} className="user-email">
                    <h4>{item.name}</h4>
                  </Col>
                </Row>
              </Button>
            ))}
          </Container>
        </Alert>

        <Alert variant="dark box mt-5">
          <h2 className="text-white">All groups</h2>
          <Container className="d-grid gap-3 mt-5">
            {allGroups?.map((item: any, index: number) => (
              <Button
                disabled={true}
                variant="secondary"
                href="#"
                key={item.id}
                className="user-btn"
              >
                <Row>
                  <Col xs={1} className="user-number">
                    <h4>{index + 1}.</h4>
                  </Col>
                  <Col xs={11} className="user-email">
                    <h4>{item.name}</h4>
                  </Col>
                </Row>
              </Button>
            ))}
          </Container>
        </Alert>
      </Container>
    </PrivateRoute>
  );
};

export default GroupsPage;
