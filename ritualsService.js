
// src/services/ritualsService.js
import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const userRitualsCollection = (uid) => collection(db, `users/${uid}/rituals`);

export async function createRitual(uid, ritual) {
  const col = userRitualsCollection(uid);
  const ref = await addDoc(col, { ...ritual, createdAt: serverTimestamp() });
  return ref.id;
}

export async function listRituals(uid) {
  const col = userRitualsCollection(uid);
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateRitual(uid, ritualId, patch) {
  const ref = doc(db, `users/${uid}/rituals`, ritualId);
  await updateDoc(ref, patch);
}

export async function completeRitual(uid, ritualId, ritualPoints = 10) {
  const dateStr = new Date().toISOString().slice(0,10);
  const key = `${dateStr}_${ritualId}`;
  const ref = doc(db, `users/${uid}/completions`, key);
  await setDoc(ref, {
    ritualId,
    date: dateStr,
    completedAt: serverTimestamp(),
    points: ritualPoints
  });
}
