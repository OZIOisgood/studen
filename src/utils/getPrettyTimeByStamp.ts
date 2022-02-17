export default function getPrettyTimeByStamp(stamp: any) {
  let prettiedTime = new Date(stamp?.seconds * 1000).toLocaleTimeString(
    navigator.language,
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return prettiedTime;
}
