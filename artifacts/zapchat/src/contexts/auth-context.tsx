import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  deleteUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { saveUserProfile } from "@/lib/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  deleteAccount: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await saveUserProfile(firebaseUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        console.error("Sign-in error:", err);
      }
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  async function deleteAccount() {
    if (!auth.currentUser) return;
    await deleteUser(auth.currentUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
