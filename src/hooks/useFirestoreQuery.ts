import { useEffect, useState } from "react";
import { onSnapshot, DocumentData } from "firebase/firestore";

export default function useFirestoreQuery(query: any) {
  const [docs, setDocs] = useState<DocumentData | null>([]);

  useEffect(
    () =>
      onSnapshot(query, (snapshot: any) => {
        setDocs(
          snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
        );
      }),
    // eslint-disable-next-line
    []
  );

  return docs;
}
