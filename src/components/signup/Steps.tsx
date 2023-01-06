import { FC, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { RiErrorWarningFill } from "react-icons/ri";
import { validateEmail, validatePassword } from "../../utils/validation/signupValidation";

interface StepsParams {
  step: number;
  setStep: any;
  loading: boolean;
  signupEmail: string;
  signupPassword: string;
  signupPasswordConfirmation: string;
  signupLastname: string;
  signupFirstname: string;
  setSignupEmail: any;
  setSignupPassword: any;
  setSignupPasswordConfirmation: any;
  setLastname: any;
  setFirstname: any;
  signup: any;
}

export const Steps: FC<StepsParams> = ({
  step,
  setStep,
  loading,
  signupEmail,
  signupPassword,
  signupPasswordConfirmation,
  signupLastname,
  signupFirstname,
  setSignupEmail,
  setSignupPassword,
  setSignupPasswordConfirmation,
  setLastname,
  setFirstname,
  signup
}) => {
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [showPasswordWarning, setShowPasswordWarning] = useState(false);
  const [showPasswordConfirmationWarning, setShowPasswordConfirmationWarning] = useState(false);
  const [showLastnameWarning, setShowLastnameWarning] = useState(false);
  const [showFirstnameWarning, setShowFirstnameWarning] = useState(false);
  
  const [showPasswords, setShowPasswords] = useState(false);

  const buttons = [
    (
      <Button
        variant="info"
        className="mt-5"
        size="lg"
        onClick={() => {
          console.log('Going to the next step');
          setStep(step + 1);
          setShowPasswords(false);
        }}
        disabled={
            signupEmail === ''
            || signupPassword === ''
            || signupPassword !== signupPasswordConfirmation
        }
      >
        <span className="text-white fs-5">
          Continue <i className="fas fa-arrow-right"></i>
        </span>
      </Button>
    ),
    (
      <>
        <Button
          variant="info"
          className="mt-5"
          size="lg"
          onClick={signup}
          disabled={
            loading
            || signupLastname === ''
            || signupFirstname === ''
          }
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

        <Button
          variant="secondary"
          className="mt-3"
          size="lg"
          onClick={() => {
            setStep(step - 1);
          }}
        >
          <span className="text-white fs-5">
            <i className="fas fa-arrow-left"></i> Back
          </span>
        </Button>
      </>
    ),
  ];

  const configureWarning = (message: string, isHidden: boolean): any => (
    isHidden && (
      <Alert variant="danger" className="mt-3 p-2">
        <RiErrorWarningFill /> {message}
      </Alert>
    )
  );
  
  const steps = [
    (
      <>
        <Form.Group controlId="sign-up-email-address" className="mt-4">
          <Form.Label className="text-white">
            Email <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            value={signupEmail}
            type="email"
            size="lg"
            placeholder="Email address"
            className="position-relative"
            disabled={loading}
            onChange={(event: any) => {
              setSignupEmail(event.target.value);

              if (!showEmailWarning) {
                setShowEmailWarning(true);
              }
            }}
          />
          {
            configureWarning(
              'Invalid email address',
              showEmailWarning && !validateEmail(signupEmail)
            )
          }
        </Form.Group>

        <Form.Group controlId="sign-up-password" className="mt-4">
          <Form.Label className="text-white">
            Password <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            value={signupPassword}
            type={showPasswords ? "text" : "password"}
            size="lg"
            placeholder="Password"
            disabled={loading}
            className="position-relative"
            onChange={(event: any) => {
              setSignupPassword(event.target.value);

              if (!showPasswordWarning) {
                setShowPasswordWarning(true);
              }
            }}
          />
          {
            configureWarning(
              'Invalid password',
              showPasswordWarning && !validatePassword(signupPassword)
            )
          }
        </Form.Group>

        <Form.Group controlId="sign-up-password-confirmation" className="mt-3">
          <Form.Label className="text-white">
            Password confirmation <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            value={signupPasswordConfirmation}
            type={showPasswords ? "text" : "password"}
            size="lg"
            placeholder="Confirm password"
            disabled={loading}
            className="position-relative"
            onChange={(event: any) => {
              setSignupPasswordConfirmation(event.target.value);

              if (!showPasswordConfirmationWarning) {
                setShowPasswordConfirmationWarning(true);
              }
            }}
          />
          {configureWarning(
            'Passwords do not match',
            showPasswordConfirmationWarning
            && (signupPassword !== '')
            && (signupPassword !== signupPasswordConfirmation)
          )}
        </Form.Group>

        <Form.Check
            // value={showPasswords}
            type={'switch'}
            label={'Show passwords'}
            onChange={() => {
              setShowPasswords(!showPasswords);
            }}
            className="mt-3 text-white"
          />
      </>
    ),
    (
      <>
        <Form.Group controlId="sign-up-lastname" className="mt-4">
          <Form.Label className="text-white">
            Lastname <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            value={signupLastname}
            type="text"
            size="lg"
            placeholder="Enter your lastname"
            onChange={(event: any) => {
              setLastname(event.target.value);

              if (!showLastnameWarning) {
                setShowLastnameWarning(true);
              }
            }}
          />
          {configureWarning(
            'Please enter your lastname',
            showLastnameWarning
            && (signupLastname === '')
          )}
        </Form.Group>

        <Form.Group controlId="sign-up-firstname" className="mt-3">
          <Form.Label className="text-white">
            Firstname <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            value={signupFirstname}
            type="text"
            size="lg"
            placeholder="Enter your firstname"
            onChange={(event: any) => {
              setFirstname(event.target.value);

              if (!showFirstnameWarning) {
                setShowFirstnameWarning(true);
              }
            }}
          />
          {configureWarning(
            'Please enter your firstname',
            showFirstnameWarning
            && (signupFirstname === '')
          )}
        </Form.Group>
      </>
    )
  ];


  return (
    <>
      {steps[step]}

      <div className="d-grid">
        {buttons[step]}
      </div>
    </>
  );
};
