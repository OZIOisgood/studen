import moment from "moment";
import { FC } from "react";
import { Container } from "react-bootstrap";

export const Footer: FC = () => {
  return (
    <Container>
      <h6 className="text-muted text-center mt-5">
        Copyright © {moment().year()} <span className="text-white">STUDEN</span>
        <span className="text-info">.</span>
      </h6>
    </Container>
  );
};

export default Footer;
