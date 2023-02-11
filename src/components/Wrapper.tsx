import { FC } from "react";
import { Container } from "react-bootstrap";
import getWrapperBackground from "../utils/wrapper/getWrapperBackground";

interface Props {
  showBackground?: boolean;
  id?: string;
  className?: string;
  children: any;
}

export const Wrapper: FC<Props> = ({ showBackground, id, className, children }) => {
  return (
    <Container
      id={id}
      fluid="lg"
      className={className}
      style={showBackground === true ? { 
        background: `
          radial-gradient(
            50% 50% at 50% 0,
            transparent 0,
            #1e1e1e 100%
          ),
          url(${getWrapperBackground()}),
          no-repeat
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%'
      } : undefined}
    >
      {children}
    </Container>
  );
};
