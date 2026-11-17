import { type CurrentUser } from "../types";
import { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser } from "../utils/api";

type  AuthContextValue = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: CurrentUser) => void;
  logout: () => void;
  
};
export const  AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  

});
export function  AuthProvider({ children }: { children: React.ReactNode }) {
  const  [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const  [isAuthenticated, setIsAuthenticated] = useState(false);
  const  [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
   const token = localStorage.getItem('auth-token');
   if (!token) {
     setIsLoading(false);
     return;
   }
   getCurrentUser()
     .then((res) => {
        if (res.data) {
        setCurrentUser(res.data);
        setIsAuthenticated(true);
    }
     })
     .catch(() => {
       // remove token from local storage
       localStorage.removeItem('auth-token');
     })
     .finally(() => {
       setIsLoading(false);
     });
 }, []);

  
  function  login(token: string, user: CurrentUser) {
    // save token to localStorage, set isAuthenticated and currentUser
     localStorage.setItem( 'auth-token', token );
     setIsAuthenticated(true);
     setCurrentUser(user);
  }
  function  logout() {
    // remove token from localStorage, reset state
    localStorage.removeItem( 'auth-token');
    setIsAuthenticated(false);
     setCurrentUser(null);
  }
  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function  useAuth() {
  return  useContext(AuthContext);
}