import React, { useState } from 'react';
import { Navbar, Nav, Button, Container, Dropdown, DropdownButton } from 'react-bootstrap';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase-config'

import '../styles/components/navbar.sass';
import { sassNull } from 'sass';

const logo = require('../assets/studen_mid_logo_white.png');

export default function NavBar() {
    const [user, setUser] = useState<any | null>({});

    onAuthStateChanged( auth, (currentuser) => {
        setUser(currentuser);
    })
    
    const signout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            // console.log(error.message) //TODO: ERROR
        }
    }

    console.log(auth.currentUser ? auth.currentUser.email : "No user logged in");

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        src={ logo }
                        height="25"
                        className="d-inline-block align-top"
                        alt="studen logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav d-flex">
                    <Nav className="me-auto">
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            {/* <Nav.Link href="/">Home</Nav.Link> */}
                        </Nav>
                    </Nav>
                    <Nav>
                        {
                            auth.currentUser != null ?
                            <DropdownButton
                                align={{ lg: 'end' }}
                                id="dropdown-basic-button"
                                menuVariant='dark'
                                variant='info'
                                className="dropdown-avatar"
                                title={
                                    <span className="text-white">
                                        <i className="fas fa-user"></i>
                                    </span>
                                    // <div>
                                    //     <img
                                    //         className="thumbnail-image rounded-circle" 
                                    //         height="38"
                                    //         src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg"
                                    //         alt="user pic"
                                    //     />
                                    // </div>
                                } 
                            >
                                <Dropdown.Item disabled>{auth.currentUser.email}</Dropdown.Item>
                                <hr />
                                <Dropdown.Item href="#">Profile</Dropdown.Item>
                                <Dropdown.Item href="#">Settings</Dropdown.Item>
                                <hr />
                                <Dropdown.Item href="/" onClick={ signout }>
                                    <span className="text-danger">
                                        <i className="fas fa-sign-out-alt"></i> Sign out
                                    </span>
                                </Dropdown.Item>
                            </DropdownButton>
                            :
                            <Button variant="info" href="/signin">
                                <span className="text-white">
                                    <i className="fas fa-sign-in-alt"></i> Sign in
                                </span>
                            </Button>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};