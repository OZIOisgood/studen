import { FC } from "react";
import { Container } from "react-bootstrap";

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
          url(https://images.unsplash.com/photo-1624359209425-05eb9b809795?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1136&q=80),
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
