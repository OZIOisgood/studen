export default function checkTime(timeStr) {
  const regexTime = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return regexTime.test(timeStr);
}
