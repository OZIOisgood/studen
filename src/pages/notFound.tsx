import { FC } from "react";
import { Alert, Container } from "react-bootstrap";
import { Footer, NavBar } from "../components";
import { Wrapper } from "../components/Wrapper";
// import * as ROUTES from "../constants/routes";

const NotFoundPage: FC = (props) => {
  return (
    <>
      <NavBar />
      <Wrapper className="pt-5">
        <Alert variant="danger">
          <h1 className="fs-5">Page not found</h1>
        </Alert>
      </Wrapper>
      <Footer />
    </>
  );
};

export default NotFoundPage;
