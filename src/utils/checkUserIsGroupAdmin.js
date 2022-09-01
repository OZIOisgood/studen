export default function getTimeNow(group, user) {
  if (group?.admins?.find((adminID) => adminID === user.id)) return true;
  else return false;
}
