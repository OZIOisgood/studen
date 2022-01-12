import ReactDOM from "react";
import {
  Navbar,
  Nav,
  Button,
  Container,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { Avatar } from "./Avatar";
import * as ROUTES from "../constants/routes";
import { useAuthState } from "../hooks";

import "../styles/components/navbar.sass";

const logo = require("../assets/studen_mid_logo_white.png");

export default function NavBar() {
  const { user, initializing } = useAuthState(auth);

  const signout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">
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
              <Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
              <Nav.Link href={ROUTES.GROUPS}>Groups</Nav.Link>
              <Nav.Link href={ROUTES.LESSONS}>Lessons</Nav.Link>
              <Nav.Link href={ROUTES.HOMEWORK}>Homework</Nav.Link>
            </Nav>
          </Nav>
          <Nav>
            {user != null ? (
              <DropdownButton
                align={{ lg: "end" }}
                id="dropdown-basic-button"
                menuVariant="dark"
                variant="info"
                className="dropdown-avatar"
                title={<Avatar email={`${user.email}`} height={28} size={50} />}
              >
                <Dropdown.Item disabled>{user.email}</Dropdown.Item>
                <hr />
                <Dropdown.Item href={ROUTES.PROFILE}>Profile</Dropdown.Item>
                <Dropdown.Item href={ROUTES.SETTINGS}>Settings</Dropdown.Item>
                <hr />
                <Dropdown.Item href="/" onClick={signout}>
                  <span className="text-danger">
                    <i className="fas fa-sign-out-alt"></i> Sign out
                  </span>
                </Dropdown.Item>
              </DropdownButton>
            ) : (
              <Button variant="info" href="/signin">
                <span className="text-white">
                  <i className="fas fa-sign-in-alt"></i> Sign in
                </span>
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
