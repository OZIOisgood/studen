export default function getPrettyDateByStamp(stamp: any) {
  let prettiedDate = new Date(stamp?.seconds * 1000).toLocaleDateString(
    navigator.language,
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
  );

  return prettiedDate;
}
