import { FC } from "react";
import { Container, Spinner } from "react-bootstrap";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  display: grid;
  height: 100%;
  place-items: center;
`;

export const Loader: FC = () => {
  return (
    <StyledContainer>
      <Spinner
        // size="sm"
        animation="border"
        variant="info"
      />
    </StyledContainer>
  );
};
