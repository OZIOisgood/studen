export default function getPrettyTimeByStamp(stamp: any) {
  let prettiedTime = new Date(stamp?.seconds * 1000).toLocaleTimeString(
    navigator.language,
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

  return prettiedTime;
}
