import { FC, useContext } from "react";
import {
  Button,
  Container,
  Alert,
  Row,
  Col,
  Card,
  CardGroup,
} from "react-bootstrap";
import { FirebaseContext } from "../context/firebase";
import { collection, DocumentData, query } from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { Avatar } from "../components";
import * as ROUTES from "../constants/routes";

import "../styles/components/groups.sass";

type GroupsProps = {
  groups: any;
  title: string;
};

export const Groups: FC<GroupsProps> = ({ groups, title }) => {
  return (
    <Alert variant="dark box mt-5 box-groups">
      <h2 className="text-white">{title}</h2>
      <Container className="d-grid gap-3 mt-5">
        <Row xs={1} sm={2} lg={3}>
          {groups?.map((group: any, index: number) => (
            <Col key={group.id}>
              <Button
                variant="secondary"
                className="group-btn d-flex"
                style={{ backgroundImage: `url(${group.backgroundURL})` }}
                href={`${ROUTES.GROUPS}/${group.id}`}
              >
                <h3 className="fs-2">
                  <b>{group.name}</b>
                </h3>
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
    </Alert>
  );
};
