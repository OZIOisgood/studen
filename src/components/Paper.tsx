import { FC } from "react";
import { Alert } from "react-bootstrap";
import styled from "styled-components";

interface Props {
  variant?: string;
  children: any;
}

const StyledAlert = styled(Alert)`
  background: rgba(78,78,78, 0.4);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(78,78,78, 0.4);
  border-radius: 8px;
  
`;

export const Paper: FC<Props> = ({ variant, children }) => {
  return (
    <StyledAlert variant={`dark ${variant}`}>
      {children}
    </StyledAlert>
  );
};
