import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FC, useState } from "react";
import { Form } from "react-bootstrap";
import { ErrorModal, Footer, Wrapper } from "../components";
import { Steps } from "../components/signup/Steps";
import * as ROUTES from "../constants/routes";
import { auth, firestore as db } from "../firebase-config";
import { getAuthErrorDesc, setUser } from "../utils";

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

  const [step, setStep] = useState(0);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirmation, setSignupPasswordConfirmation] = useState("");
  const [signupLastname, setLastname] = useState("");
  const [signupFirstname, setFirstname] = useState("");

  const signup = async () => {
    try {
      setLoading(true);

      if (signupEmail === "") throw new Error("auth/email-not-entered");
      if (signupPassword === "") throw new Error("auth/password-not-entered");
      if (signupPassword !== signupPasswordConfirmation)
        throw new Error("auth/passwords-not-equal");
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
    <Wrapper
      showBackground
      id="main-container"
      className="d-grid h-100"
    >
      <Form id="sign-up-form">
        <a href={ROUTES.STARTER}>
          <img src={logo} className="logo text-center" alt="studen logo" />
        </a>
        <h1 className="text-white fs-3 mt-5 text-center">Please sign up</h1>

        <Steps
          step={step}
          setStep={setStep}
          loading={loading}
          signupEmail={signupEmail}
          signupPassword={signupPassword}
          signupPasswordConfirmation={signupPasswordConfirmation}
          signupLastname={signupLastname}
          signupFirstname={signupFirstname}
          setSignupEmail={setSignupEmail}
          setSignupPassword={setSignupPassword}
          setSignupPasswordConfirmation={setSignupPasswordConfirmation}
          setLastname={setLastname}
          setFirstname={setFirstname}
          signup={signup}
        />

        <Footer />
      </Form>

      <ErrorModal
        modalTitle="Error detected"
        buttonTitle="Try again"
        showErrorModal={showErrorModal}
        handleCloseErrorModal={handleCloseErrorModal}
        errorMessage={errorMessage}
      />
    </Wrapper>
  );
};

export default SignUpPage;
