import { FC } from "react";

var md5 = require("md5");

interface UserAvatarData {
  email: string;
  height?: number;
  size?: number;
}

export const Avatar: FC<UserAvatarData> = ({ email, height, size = 50 }) => {
  const url = `https://www.gravatar.com/avatar/${md5(email)}?s=${String(
    Math.max(size, 250)
  )}&d=mp`;

  return (
    <img
      src={`${url}`}
      alt={`Avatar`}
      height={height}
      className="avatar thumbnail-image rounded-circle"
    />
  );
};
