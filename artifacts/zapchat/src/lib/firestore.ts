import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";

// ─── User Profile ──────────────────────────────────────────────────────────

export async function saveUserProfile(user: User, extra?: { businessName?: string }) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      businessName: extra?.businessName || "",
      createdAt: serverTimestamp(),
    });
  } else if (extra?.businessName !== undefined) {
    await updateDoc(ref, { businessName: extra.businessName });
  }
}

export async function updateUserProfile(uid: string, data: { displayName?: string; businessName?: string }) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { ...data });
}

export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// ─── Customers ─────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  createdAt: any;
}

export function subscribeToCustomers(
  uid: string,
  callback: (customers: Customer[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "users", uid, "customers"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Customer));
    callback(data);
  });
}

export async function addCustomer(
  uid: string,
  data: { name: string; phone: string; tags?: string[] }
) {
  await addDoc(collection(db, "users", uid, "customers"), {
    name: data.name,
    phone: data.phone,
    tags: data.tags || [],
    createdAt: serverTimestamp(),
  });
}

export async function deleteCustomer(uid: string, customerId: string) {
  await deleteDoc(doc(db, "users", uid, "customers", customerId));
}

// ─── Automations ───────────────────────────────────────────────────────────

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  reply: string;
  active: boolean;
  createdAt: any;
}

export function subscribeToAutomations(
  uid: string,
  callback: (automations: Automation[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "users", uid, "automations"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Automation));
    callback(data);
  });
}

export async function addAutomation(
  uid: string,
  data: { name: string; trigger: string; reply: string }
) {
  await addDoc(collection(db, "users", uid, "automations"), {
    name: data.name,
    trigger: data.trigger,
    reply: data.reply,
    active: true,
    createdAt: serverTimestamp(),
  });
}

export async function toggleAutomation(uid: string, automationId: string, active: boolean) {
  await updateDoc(doc(db, "users", uid, "automations", automationId), { active });
}

export async function deleteAutomation(uid: string, automationId: string) {
  await deleteDoc(doc(db, "users", uid, "automations", automationId));
}

// ─── Messages ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  phone: string;
  text: string;
  direction: "incoming" | "outgoing";
  fromName?: string;
  status: "sent" | "delivered" | "read";
  timestamp: string;
  createdAt: any;
}

export async function saveMessage(
  uid: string,
  msg: Omit<ChatMessage, "createdAt">
): Promise<void> {
  const ref = doc(db, "users", uid, "messages", msg.id);
  await setDoc(ref, { ...msg, createdAt: serverTimestamp() }, { merge: true });
}

export function subscribeToMessages(
  uid: string,
  callback: (messages: ChatMessage[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "users", uid, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ ...d.data() } as ChatMessage));
    callback(data);
  });
}
