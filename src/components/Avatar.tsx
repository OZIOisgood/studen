import { FC } from "react";
import md5 from "md5";

interface UserAvatarData {
  className?: string;
  email?: string;
  href?: string;
  height?: number;
  size?: number;
}

export const Avatar: FC<UserAvatarData> = ({
  email,
  className,
  href,
  height,
  size = 50,
}) => {
  let url = "";

  if (email)
    url = `https://www.gravatar.com/avatar/${md5(email)}?s=${String(
      Math.max(size, 250)
    )}&d=mp`;
  else if (href) url = href;

  return (
    <img
      src={`${url}`}
      alt={`Avatar`}
      height={height}
      width={height}
      className={`avatar thumbnail-image rounded-circle ${className}`}
      style={{ objectFit: "cover" }}
    />
  );
};
