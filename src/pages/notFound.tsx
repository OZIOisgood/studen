import { FC } from "react";
import { Alert, Container } from "react-bootstrap";
import { Footer, NavBar } from "../components";
// import * as ROUTES from "../constants/routes";

const NotFoundPage: FC = (props) => {
  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <Alert variant="danger">
          <h1 className="fs-5">Page not found</h1>
        </Alert>
      </Container>
      <Footer />
    </>
  );
};

export default NotFoundPage;
