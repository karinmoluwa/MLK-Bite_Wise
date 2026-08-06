import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDatabase } from "@/services/auth/firebase";

export class FirestoreRepository<T extends object> {
  constructor(private readonly collectionName: string) {}

  async get(id: string): Promise<T | null> {
    const database = getFirebaseDatabase();
    if (!database) return null;
    const snapshot = await getDoc(doc(collection(database, this.collectionName), id));
    return snapshot.exists() ? (snapshot.data() as T) : null;
  }

  async set(id: string, value: T): Promise<void> {
    const database = getFirebaseDatabase();
    if (!database) return;
    await setDoc(doc(collection(database, this.collectionName), id), value, { merge: true });
  }
}
