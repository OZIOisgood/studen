import React, { FC, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";

import "../styles/pages/signin.sass";

const logo = require("../assets/studen_mid_logo_white.png");

const SignUpPage: FC = (props) => {
  const [loading, setLoading] = useState(false);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const signup = async () => {
    try {
      setLoading(true);
      const user = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );
      // console.log(user)

      window.location.href = "/";
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <Container id="main-container" className="d-grid h-100">
      <Form id="sign-up-form" className="text-center">
        <a href="/">
          <img src={logo} className="logo" alt="studen logo" />
        </a>
        <h1 className="text-white fs-3 mt-5">Plese sign up</h1>
        <Form.Group controlId="sign-up-email-address" className="mt-4">
          <Form.Control
            type="email"
            size="lg"
            placeholder="Email address"
            autoComplete="username"
            className="position-relative"
            onChange={(event) => {
              setSignupEmail(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="sign-up-password">
          <Form.Control
            type="password"
            size="lg"
            placeholder="Password"
            autoComplete="current-password"
            className="position-relative mt-3"
            onChange={(event) => {
              setSignupPassword(event.target.value);
            }}
          />
        </Form.Group>
        {/* <Form.Group controlId="sign-up-password">
          <Form.Control
            type="password"
            size="lg"
            placeholder="Confirm Password"
            autoComplete="current-password"
            className="position-relative mt-1"
          />
        </Form.Group> */}
        <div className="d-grid">
          <Button
            variant="info"
            className="mt-4"
            size="lg"
            onClick={signup}
            disabled={loading}
          >
            <span className="text-white fs-5">
              {loading === false ? (
                <>
                  <i className="fas fa-user-plus"></i> Sign up
                </>
              ) : (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              )}
            </span>
          </Button>
        </div>
        <p className="mt-5 text-muted">&copy; 2021-2022</p>
      </Form>
    </Container>
  );
};

export default SignUpPage;
