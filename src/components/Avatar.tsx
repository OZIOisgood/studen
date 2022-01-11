import React, { FC } from "react";
import { UserData } from "../types/types";
// import { UserData } from "../types/types";

var md5 = require("md5");

interface UserAvatarData {
  // extends UserData
  // firstName?: string;
  // lastName?: string;
  email: string;
  height?: number;
  size?: number;
}

export const Avatar: FC<UserAvatarData> = ({ email, height, size = 50 }) => {
  const url = `https://www.gravatar.com/avatar/${md5(email)}?s=${String(
    Math.max(size, 250)
  )}&d=blank`;

  return (
    <img
      src={`${url}`}
      alt={`Avatar`}
      height={height}
      className="avatar thumbnail-image rounded-circle"
    />
  );
};
