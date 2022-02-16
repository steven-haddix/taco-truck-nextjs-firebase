import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactDOM,
  ReactNode,
} from "react";
import { createFirebaseApp } from "../firebase/clientApp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import IUser from "../types/IUser";

type UserContextType = {
  user: IUser | undefined;
  loadingUser: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>> | undefined;
};

export const UserContext = createContext<UserContextType>({
  user: undefined,
  loadingUser: true,
  setUser: undefined,
});

export default function UserContextComp({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [loadingUser, setLoadingUser] = useState<boolean>(true); // Helpful, to update the UI accordingly.

  useEffect(() => {
    // Listen authenticated user
    const app = createFirebaseApp();
    const auth = getAuth(app);
    const unsubscriber = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid, displayName, email, photoURL } = user;
          // You could also look for the user doc in your Firestore (if you have one):
          // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
          setUser({ uid, displayName, email, photoURL });
        } else setUser(undefined);
      } catch (error) {
        // Most probably a connection error. Handle appropriately.
      } finally {
        setLoadingUser(false);
      }
    });

    // Unsubscribe auth listener on unmount
    return () => unsubscriber();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook that shorthands the context!
export const useUser = () => useContext(UserContext);
