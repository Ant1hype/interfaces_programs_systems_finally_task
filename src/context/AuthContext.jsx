import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { createUser, getUserByEmail, getUser, patchUser } from "../lib/api.js";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const SESSION_KEY = "syrnaya-palitra:session:v1";

// учебный проект
export function djb2(str) {
  let hash = 5381;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) + hash) + s.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Восстановление сессии при монтировании (GET /users/:id)
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const savedId = localStorage.getItem(SESSION_KEY);
        if (!savedId) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const restoredUser = await getUser(savedId);
        if (isMounted) {
          if (restoredUser && restoredUser.id) {
            setUser(restoredUser);
          } else {
            localStorage.removeItem(SESSION_KEY);
            setUser(null);
          }
        }
      } catch {
        if (isMounted) {
          try {
            localStorage.removeItem(SESSION_KEY);
          } catch (e) {
            // ignore
          }
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const register = useCallback(async (userData) => {
    const { name, email, phone, password, ...rest } = userData || {};
    const trimmedEmail = typeof email === "string" ? email.trim() : "";

    // Проверка уникальности email через GET /users?email=
    const existing = await getUserByEmail(trimmedEmail);
    if (existing) {
      throw new Error("EMAIL_TAKEN");
    }

    const newUser = {
      name,
      email: trimmedEmail,
      phone,
      ...rest,
      passHash: djb2(password),
      createdAt: new Date().toISOString(),
    };

    const created = await createUser(newUser);
    try {
      localStorage.setItem(SESSION_KEY, String(created.id));
    } catch (e) {
      console.error("Failed to save session to localStorage:", e);
    }
    setUser(created);
    return created;
  }, []);

  const login = useCallback(async (emailOrObj, maybePassword) => {
    let email = emailOrObj;
    let password = maybePassword;
    if (emailOrObj && typeof emailOrObj === "object") {
      email = emailOrObj.email;
      password = emailOrObj.password;
    }

    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const foundUser = await getUserByEmail(trimmedEmail);
    if (!foundUser) {
      throw new Error("USER_NOT_FOUND");
    }

    const hash = djb2(password);
    if (foundUser.passHash !== hash) {
      throw new Error("WRONG_PASSWORD");
    }

    try {
      localStorage.setItem(SESSION_KEY, String(foundUser.id));
    } catch (e) {
      console.error("Failed to save session to localStorage:", e);
    }
    setUser(foundUser);
    return foundUser;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error("Failed to clear session from localStorage:", e);
    }
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (patch) => {
      if (!user) {
        throw new Error("NOT_AUTHENTICATED");
      }

      const patchData = { ...patch };

      // Смена пароля только при верном текущем
      const wantsPasswordChange = "password" in patchData || "newPassword" in patchData;
      if (wantsPasswordChange) {
        const currentPass = patchData.currentPassword || patchData.oldPassword;
        const newPass = patchData.newPassword || patchData.password;

        if (!currentPass || djb2(currentPass) !== user.passHash) {
          throw new Error("WRONG_PASSWORD");
        }

        patchData.passHash = djb2(newPass);
        delete patchData.currentPassword;
        delete patchData.oldPassword;
        delete patchData.newPassword;
        delete patchData.password;
      }

      const updated = await patchUser(user.id, patchData);
      setUser(updated);
      return updated;
    },
    [user]
  );

  // DEV-хук для тестирования в консоли
  if (import.meta.env.DEV && typeof window !== "undefined") {
    window.__auth = {
      login,
      register,
      logout,
      updateProfile,
      get user() {
        return user;
      },
    };
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, loading, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
