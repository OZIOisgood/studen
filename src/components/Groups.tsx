import { collection, query, where } from "firebase/firestore";
import { FC, useContext } from "react";
import { Button, Container, Alert, Row, Col } from "react-bootstrap";
import * as ROUTES from "../constants/routes";
import { FirebaseContext } from "../context/firebase";
import { useFirestoreQuery } from "../hooks";

import "../styles/components/groups.sass";
import { getUser } from "../utils";

type GroupsProps = {
  groups: any;
  title: string;
};

export const Groups: FC<GroupsProps> = ({ groups, title }) => {
  const { firestore } = useContext(FirebaseContext);
  const user = getUser();

  const myGroupsCollectionRef = collection(firestore, "groups");
  const myGroupsQuery = query(
    myGroupsCollectionRef,
    where("users", "array-contains", user.id)
  );
  const myGroups = useFirestoreQuery(myGroupsQuery);

  return (
    <Alert variant="dark box mt-5 box-groups">
      <h2 className="text-white">{title}</h2>
      <Container className="mt-3">
        <Row xs={1} md={2} lg={3}>
          {groups?.map((group: any, index: number) => (
            <Col key={group.id} className="mt-4">
              <Button
                disabled={
                  !myGroups?.find((myGroup: any) => myGroup.id === group.id)
                }
                variant="secondary"
                className="group-btn d-flex"
                style={{
                  backgroundImage: `url(${group.backgroundURL})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
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
