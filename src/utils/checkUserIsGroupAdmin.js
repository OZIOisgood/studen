export default function checkUserIsGroupAdmin(group, user) {
  if (group?.admins?.find((adminID) => adminID === user.id)) return true;
  else return false;
}
