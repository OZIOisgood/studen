export default function getUser() {
  const userJSON = localStorage.getItem("authUser");
  const user = userJSON ? JSON.parse(userJSON) : null;

  return user;
}
