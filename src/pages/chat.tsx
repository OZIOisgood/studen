import { doc, DocumentData, getDoc } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import styled from "styled-components";
import { Paper, PrivateRoute, Wrapper } from "../components";
import { firestore } from "../firebase-config";
import { getUser } from "../utils";

const StyledChatButtonGroup = styled(ButtonGroup)`
  width: 100%;
`;

type StyledChatButtonProps = {
  first?: boolean;
  middle?: boolean;
  last?: boolean;
};

const StyledChatButton = styled(Button)<StyledChatButtonProps>`
  background: transparent;
  backdrop-filter: blur(5px);
  border: 0;
  border-radius: 8px 0 0 8px;
   &:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
`;


const ChatPage: FC = (props) => {
  const user = getUser();
  
  const [profile, setProfile] = useState<DocumentData | undefined>({});

  const profileRef = doc(firestore, "users", `${user.id}`);
  useEffect(() => {
    const getProfile = async () => {
      const data = await getDoc(profileRef);
      setProfile(data.data());
    };

    getProfile();
    // eslint-disable-next-line
  }, []);
  
  return (
    <PrivateRoute>
      <Wrapper
        showBackground
        className="pt-5"
      >
        <h1 className="text-white">Chat</h1>

        <Paper variant="p-0">
          <Row>
            <Col xs={4}>
              <StyledChatButtonGroup vertical>
                {
                  profile?.chats?.map((chat: any) => (
                    <StyledChatButton>
                      {chat}
                    </StyledChatButton>
                  ))
                }
              </StyledChatButtonGroup>
            </Col>
          </Row>
        </Paper>
      </Wrapper>
    </PrivateRoute>
  );
};

export default ChatPage;
