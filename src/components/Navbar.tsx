import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const logo = require('../assets/studen_mid_logo_white.png');

export default function NavBar() {
  return (
    <Navbar bg="dark">
        <Container>
                <Navbar.Brand href="#home">
                <img
                    src={ logo }
                    height="25"
                    className="d-inline-block align-top"
                    alt="studen logo"
                />
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};