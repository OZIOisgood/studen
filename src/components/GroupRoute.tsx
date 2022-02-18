import React, { FC, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "../components";
import * as ROUTES from "../constants/routes";

type GroupRouteProps = {
  children: React.ReactNode;
  groupUsers: Array<String>;
  userID: string;
};

export const GroupRoute: FC<GroupRouteProps> = (props) => {
  return (
    <>
      {!(props.groupUsers && props.userID) ? (
        <Loader />
      ) : props.groupUsers?.includes(props.userID) ? (
        props.children
      ) : (
        <Navigate to={ROUTES.HOME} />
      )}
    </>
  );
};
