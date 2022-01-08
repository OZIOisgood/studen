import React, { FC, useState } from 'react';
import { Button, Container, Alert } from 'react-bootstrap';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config'

import NavBar from '../components/Navbar'

import '../styles/pages/home.sass';

const groupPhoto = require('../assets/KA-16_photo.jpeg');

const HomePage: FC = (props) => {
  const [user, setUser] = useState<any | null>({});

  onAuthStateChanged( auth, (currentuser) => {
      setUser(currentuser);
  })

  return (
    <>
      <NavBar/>
      {
        auth.currentUser != null ?
        <Container className="mt-5">
          <h1 className="text-white">
            Home (logged in as: {auth.currentUser.email})
          </h1>
          <Alert variant="dark box mt-5">
            <h2 className="text-white">
            Schedule
            </h2>
            <Container className="d-grid gap-3 mt-5">
              <Button variant="danger" href="https://meet.google.com/bwy-tbvf-kfr" size="lg">
                <h4>
                  Join <b>current</b> conference
                </h4>
              </Button>
              <Button variant="success" href="https://meet.google.com/bwy-tbvf-kfr" size="lg">
                <h4>
                  Join <b>next</b> conference
                </h4>
              </Button>
            </Container>
            <Container className="d-grid gap-3 mt-5">
              <Button disabled={true} variant="secondary" href="https://meet.google.com/bwy-tbvf-kfr" size="lg">
                <h4>
                  Матаналіз 🧮
                </h4>
              </Button>
              <Button disabled={true} variant="secondary" href="https://us04web.zoom.us/j/2998834367?pwd=MFM1a1NKNCtPMDN5R2FOMnJaMlJBdz09" size="lg">
                <h4>
                  Дискретка 🧣
                </h4>
              </Button>
              <Button variant="secondary" href="https://meet.google.com/wzf-rdra-vxz" size="lg">
                <h4>
                  Лінал (лекція) 🐏
                </h4>
              </Button>
              <Button variant="secondary" href="https://meet.google.com/ioc-ouus-ozh" size="lg">
                <h4>
                  Лінал (практика) 🙎🏼‍♀️
                </h4>
              </Button>
              <Button variant="secondary" href="https://us02web.zoom.us/j/4803998293?pwd=U0J2cS85eDdJK0JYZDYxbk9yQnlJdz09" size="lg">
                <h4>
                  Англійська мова 🇬🇧
                </h4>
              </Button>
              <Button variant="secondary" href="https://us04web.zoom.us/j/7162303536?pwd=U3Q3M0JSTm1uL2MyNms0d3k0V2FrZz09" size="lg">
                <h4>
                  ФIзкультура (ПРактика) 🏃
                </h4>
              </Button>
              <Button variant="secondary" href=" https://meet.google.com/zog-yorh-yto" size="lg">
                <h4>
                  Риторика (Практика) 👩🏼‍🎓
                </h4>
              </Button>
            </Container>
          </Alert>
        </Container>
        :
        <Container className="d-grid gap-3 mt-5">
          <Alert variant="danger">
            Please sign in or sign up to use STUDEN.
          </Alert>
        </ Container>
    }
    </>
  );
}

export default HomePage;
