import { FC } from "react";
import { Alert } from "react-bootstrap";
import { Footer, NavBar, Wrapper } from "../components";

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
