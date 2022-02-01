import { FC, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import * as ROUTES from "../constants/routes";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { setUser } from "../utils";

import "../styles/pages/signin.sass";

const logo = require("../assets/studen_mid_logo_white.png");

const SignInPage: FC = (props) => {
  const [loading, setLoading] = useState(false);

  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const db = getFirestore();

  const signin = async () => {
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(
        auth,
        signinEmail,
        signinPassword
      );

      const userDoc = await getDoc(doc(db, "users", cred.user.uid));

      setUser(
        JSON.stringify({
          ...userDoc.data(),
          id: cred.user.uid,
        })
      );

      window.location.href = ROUTES.HOME;
    } catch (error: any) {
      console.error(error.message);

      setSigninEmail("");
      setSigninPassword("");

      setLoading(false);
    }
  };

  return (
    <Container id="main-container" className="d-grid h-100">
      <Form id="sign-in-form" className="text-center">
        <a href={ROUTES.STARTER}>
          <img src={logo} className="logo" alt="studen logo" />
        </a>
        <h1 className="text-white fs-3 mt-5">Please sign in</h1>
        <Form.Group controlId="sign-in-email-address" className="mt-4">
          <Form.Control
            type="email"
            size="lg"
            placeholder="Email address"
            autoComplete="username"
            disabled={loading}
            className="position-relative"
            onChange={(event) => {
              setSigninEmail(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="sign-in-password">
          <Form.Control
            type="password"
            size="lg"
            placeholder="Password"
            autoComplete="current-password"
            disabled={loading}
            className="position-relative mt-1"
            onChange={(event) => {
              setSigninPassword(event.target.value);
            }}
          />
        </Form.Group>
        {/* <Form.Group
          controlId="remember-me"
          className="d-flex justify-content-center mt-3"
        >
          <Form.Check label="Remember me" className="text-white" />
        </Form.Group> */}
        <div className="d-grid">
          <Button
            variant="info"
            className="mt-3"
            size="lg"
            onClick={signin}
            disabled={loading}
          >
            <span className="text-white fs-5">
              {loading === false ? (
                <>
                  <i className="fas fa-sign-in-alt"></i> Sign in
                </>
              ) : (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Loading...
                </>
              )}
            </span>
          </Button>
        </div>
        <p className="mt-3 text-muted">
          <a href="/signup" className="link-primary">
            Create an account
          </a>{" "}
          to use STUDEN.
        </p>
        <p className="mt-5 text-muted">&copy; 2021-2022</p>
      </Form>
    </Container>
  );
};

export default SignInPage;
