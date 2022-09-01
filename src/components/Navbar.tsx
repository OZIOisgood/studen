import { FC, useContext, useState } from "react";
import {
  Navbar,
  Nav,
  Button,
  Container,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { signOut } from "firebase/auth";
import { Avatar } from "./Avatar";
import { FirebaseContext } from "../context/firebase";
import * as ROUTES from "../constants/routes";

import "../styles/components/navbar.sass";
import { ErrorModal } from "./ErrorModal";

const logo = require("../assets/studen_mid_logo_white.png");

export const NavBar: FC = () => {
  const { auth, user, initializing } = useContext(FirebaseContext);

  // Error modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleShowErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };
  //

  // signOut
  const signout = async () => {
    try {
      await signOut(auth);
      await localStorage.removeItem("authUser");
    } catch (error: any) {
      handleShowErrorModal(error.message);
    }
  };
  //

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href={ROUTES.HOME}>
          <img
            src={logo}
            height="25"
            className="d-inline-block align-top"
            alt="studen logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav d-flex">
          <Nav className="me-auto">
            <Nav className="justify-content-end flex-grow-1 pe-3">
              {user ? (
                <>
                  <Nav.Link href={ROUTES.HOME}>
                    <i className="fas fa-home"></i> Home
                  </Nav.Link>
                  <Nav.Link href={ROUTES.GROUPS}>
                    <i className="fas fa-users"></i> Groups
                  </Nav.Link>
                  <Nav.Link href={ROUTES.COURSES}>
                    <i className="fas fa-chalkboard-teacher"></i> Courses
                  </Nav.Link>
                  <Nav.Link href={ROUTES.HOMEWORKS}>
                    <i className="fas fa-book-open"></i> Homeworks
                  </Nav.Link>
                </>
              ) : !initializing ? (
                <Nav.Link href={ROUTES.HOME}>
                  <i className="fas fa-home"></i> Home
                </Nav.Link>
              ) : null}
            </Nav>
          </Nav>
          <Nav>
            {user ? (
              <DropdownButton
                align={{ lg: "end" }}
                id="dropdown-basic-button"
                menuVariant="dark"
                variant="info"
                className="dropdown-avatar"
                title={<Avatar email={user.email} height={28} size={50} />}
              >
                <Dropdown.Item disabled>{user.email}</Dropdown.Item>
                <hr />
                <Dropdown.Item href={`${ROUTES.PROFILE}/${user.uid}`}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item href={ROUTES.SETTINGS}>Settings</Dropdown.Item>
                <hr />
                <Dropdown.Item href="/" onClick={signout}>
                  <span className="text-danger">
                    <i className="fas fa-sign-out-alt"></i> Sign out
                  </span>
                </Dropdown.Item>
              </DropdownButton>
            ) : !initializing ? (
              <Button variant="info" href="/signin">
                <span className="text-white">
                  <i className="fas fa-sign-in-alt"></i> Sign in
                </span>
              </Button>
            ) : null}
          </Nav>
        </Navbar.Collapse>

        <ErrorModal
          modalTitle="Error detected"
          buttonTitle="Try again"
          showErrorModal={showErrorModal}
          handleCloseErrorModal={handleCloseErrorModal}
          errorMessage={errorMessage}
        />
      </Container>
    </Navbar>
  );
};

export default NavBar;
