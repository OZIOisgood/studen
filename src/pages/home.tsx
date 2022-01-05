import React, { FC } from 'react';

import NavBar from '../components/Navbar'
import { Button, Container } from 'react-bootstrap';

const groupPhoto = require('../assets/KA-16_photo.jpeg');

const HomePage: FC = (props) => {
  return (
    <>
      <NavBar/>
      <Container className="mt-5 text-center">
        <img
          src={ groupPhoto }
          width="150"
          height="150"
          className="d-inline-block align-top rounded-circle"
          alt="studen logo"
        />
        <h2 className="mt-4 text-white">
          KA-16
        </h2>
      </Container>
      <h1 className="mt-5 text-white text-center">
        Посилання на конференції
      </h1>
      <hr/>
      <Container className="d-grid gap-3 mt-5">
        <Button variant="light" href="https://meet.google.com/bwy-tbvf-kfr" size="lg">
          <h3>
            Матаналіз 🧮
          </h3>
        </Button>
        <Button variant="light" href="https://us04web.zoom.us/j/2998834367?pwd=MFM1a1NKNCtPMDN5R2FOMnJaMlJBdz09" size="lg">
          <h3>
            Дискретка 🧣
          </h3>
        </Button>
        <Button variant="light" href="https://meet.google.com/wzf-rdra-vxz" size="lg">
          <h3>
            Лінал (лекція) 🐏
          </h3>
        </Button>
        <Button variant="light" href="https://meet.google.com/ioc-ouus-ozh" size="lg">
          <h3>
            Лінал (практика) 🙎🏼‍♀️
          </h3>
        </Button>
        <Button variant="light" href="https://us02web.zoom.us/j/4803998293?pwd=U0J2cS85eDdJK0JYZDYxbk9yQnlJdz09" size="lg">
          <h3>
            Англійська мова 🇬🇧
          </h3>
        </Button>
        <Button variant="light" href="https://us04web.zoom.us/j/7162303536?pwd=U3Q3M0JSTm1uL2MyNms0d3k0V2FrZz09" size="lg">
          <h3>
            ФIзкультура (ПРактика) 🏃
          </h3>
        </Button>
        <Button variant="light" href=" https://meet.google.com/zog-yorh-yto" size="lg">
          <h3>
            Риторика (Практика) 👩🏼‍🎓
          </h3>
        </Button>
      </Container>
    </>
  );
}

export default HomePage;
