import { FC } from "react";
import { Button, Container, Alert, Row, Col } from "react-bootstrap";
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
      <Container className="mt-3">
        <Row xs={1} md={2} lg={3}>
          {groups?.map((group: any, index: number) => (
            <Col key={group.id} className="mt-4">
              <Button
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
