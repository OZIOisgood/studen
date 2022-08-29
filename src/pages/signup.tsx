import { FC, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import * as ROUTES from "../constants/routes";
import { getAuthErrorDesc, setUser } from "../utils";
import { ErrorModal } from "../components";

import "../styles/pages/signin.sass";

const logo = require("../assets/studen_mid_logo_white.png");

const SignUpPage: FC = (props) => {
  const [loading, setLoading] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleShowErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLastname, setLastname] = useState("");
  const [signupFirstname, setFirstname] = useState("");

  const db = getFirestore();

  const signup = async () => {
    try {
      setLoading(true);

      if (signupLastname === "") throw new Error("auth/lastname-not-entered");
      if (signupFirstname === "") throw new Error("auth/firstname-not-entered");

      const cred = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );

      const user = cred.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: signupFirstname,
        lastName: signupLastname,
        groups: ["default"],
      });

      const userDoc = await getDoc(doc(db, "users", user.uid));

      setUser(
        JSON.stringify({
          ...userDoc.data(),
          id: cred.user.uid,
        })
      );

      window.location.href = ROUTES.HOME;
    } catch (error: any) {
      // if (typeof error.code === "undefined")
      //   handleShowErrorModal(getAuthErrorDesc(error.message));
      // else handleShowErrorModal(getAuthErrorDesc(error.code.split("/")[1]));

      handleShowErrorModal(
        getAuthErrorDesc(
          (typeof error.code === "undefined"
            ? error.message
            : error.code
          ).split("/")[1]
        )
      );

      setLoading(false);
    }
  };

  return (
    <Container id="main-container" className="d-grid h-100">
      <Form id="sign-up-form">
        <a href={ROUTES.STARTER}>
          <img src={logo} className="logo text-center" alt="studen logo" />
        </a>
        <h1 className="text-white fs-3 mt-5 text-center">Please sign up</h1>
        <Form.Group controlId="sign-up-email-address" className="mt-4">
          <Form.Label className="text-white">
            Email <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="email"
            size="lg"
            placeholder="Email address"
            className="position-relative"
            disabled={loading}
            onChange={(event: any) => {
              setSignupEmail(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="sign-up-password" className="mt-3">
          <Form.Label className="text-white">
            Password <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="password"
            size="lg"
            placeholder="Password"
            disabled={loading}
            className="position-relative"
            onChange={(event: any) => {
              setSignupPassword(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mt-4 lesson-name">
          <Form.Label className="text-white">
            Lastname <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            size="lg"
            placeholder="Enter your lastname"
            onChange={(event: any) => {
              setLastname(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mt-3 lesson-name">
          <Form.Label className="text-white">
            Firstname <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            size="lg"
            placeholder="Enter your firstname"
            onChange={(event: any) => {
              setFirstname(event.target.value);
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
            className="mt-5"
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

      <ErrorModal
        modalTitle="Error detected"
        buttonTitle="Try again"
        showErrorModal={showErrorModal}
        handleCloseErrorModal={handleCloseErrorModal}
        errorMessage={errorMessage}
      />
    </Container>
  );
};

export default SignUpPage;
