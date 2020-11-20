import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext({});

export default function AuthContextProvider(props) {
  const [fetchWithCSRF, setFetchWithCSRF] = useState(() => fetch);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

	async function logoutUser() {
    await fetchWithCSRF("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    setCurrentUserId(null);
  }

  useEffect(() => {
    async function restoreCSRF() {
      const response = await fetch("/api/csrf/restore", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const authData = await response.json();
        setFetchWithCSRF(() => {
          return (resource, init) => {
            if (init.headers) {
              init.headers["X-CSRFToken"] = authData.csrf_token;
            } else {
              init.headers = {
                "X-CSRFToken": authData.csrf_token,
              };
            }
            return fetch(resource, init);
          };
        });
        if (authData.current_user_id) {
          setCurrentUserId(authData.current_user_id);
        }
      }
      setLoading(false);
    }
    restoreCSRF();
  }, []);

  const AuthContextValue = {
    fetchWithCSRF,
    currentUserId,
    setCurrentUserId,
    logoutUser,
  };

  return loading ? null : (
    <AuthContext.Provider value={AuthContextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}
