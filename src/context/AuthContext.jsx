import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { createUser, getUserByEmail, getUser, patchUser, getUsers } from "../lib/api.js";

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

function normalizeUser(u) {
  if (!u) return null;
  return {
    ...u,
    favorites: Array.isArray(u.favorites) ? u.favorites : [],
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Восстановление сессии при монтировании (GET /users/:id)
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const savedId = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
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
            setUser(normalizeUser(restoredUser));
          } else {
            localStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(SESSION_KEY);
            setUser(null);
          }
        }
      } catch {
        if (isMounted) {
          try {
            localStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(SESSION_KEY);
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
      favorites: [],
      passHash: djb2(password),
      createdAt: new Date().toISOString(),
    };

    const created = await createUser(newUser);
    try {
      localStorage.setItem(SESSION_KEY, String(created.id));
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error("Failed to save session to localStorage:", e);
    }
    setUser(normalizeUser(created));
    return created;
  }, []);

  const login = useCallback(async (emailOrObj, maybePassword, maybeRemember = true) => {
    let email = emailOrObj;
    let password = maybePassword;
    let remember = maybeRemember;
    if (emailOrObj && typeof emailOrObj === "object") {
      email = emailOrObj.email;
      password = emailOrObj.password;
      if ("remember" in emailOrObj) {
        remember = emailOrObj.remember;
      }
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
      if (remember) {
        localStorage.setItem(SESSION_KEY, String(foundUser.id));
        sessionStorage.removeItem(SESSION_KEY);
      } else {
        sessionStorage.setItem(SESSION_KEY, String(foundUser.id));
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.error("Failed to save session:", e);
    }
    setUser(normalizeUser(foundUser));
    return foundUser;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error("Failed to clear session:", e);
    }
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (patch) => {
      if (!user) {
        throw new Error("NOT_AUTHENTICATED");
      }

      const patchData = { ...patch };

      if (patchData.email !== undefined) {
        const trimmedEmail = typeof patchData.email === "string" ? patchData.email.trim() : "";
        patchData.email = trimmedEmail;
        if (trimmedEmail && trimmedEmail.toLowerCase() !== (user.email || "").toLowerCase()) {
          const existing = await getUserByEmail(trimmedEmail);
          if (existing && String(existing.id) !== String(user.id)) {
            throw new Error("EMAIL_TAKEN");
          }
        }
      }

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
      setUser(normalizeUser(updated));
      return updated;
    },
    [user]
  );

  const requestReset = useCallback(async (email) => {
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const foundUser = await getUserByEmail(trimmedEmail);
    if (!foundUser) {
      throw new Error("USER_NOT_FOUND");
    }

    const resetToken = String(Math.floor(100000 + Math.random() * 900000));
    await patchUser(foundUser.id, { resetToken });
    return resetToken;
  }, []);

  const resetPassword = useCallback(async (code, newPass) => {
    const trimmedCode = code !== undefined && code !== null ? String(code).trim() : "";
    if (!trimmedCode) {
      throw new Error("CODE_INVALID");
    }

    const users = await getUsers();
    const foundUser = Array.isArray(users)
      ? users.find((u) => u.resetToken && String(u.resetToken).trim() === trimmedCode)
      : null;

    if (!foundUser) {
      throw new Error("CODE_INVALID");
    }

    await patchUser(foundUser.id, {
      passHash: djb2(newPass),
      resetToken: null,
    });

    return true;
  }, []);

  const changePassword = useCallback(
    async (current, next) => {
      if (!user) {
        throw new Error("NOT_AUTHENTICATED");
      }
      if (djb2(current) !== user.passHash) {
        throw new Error("WRONG_CURRENT");
      }
      const updated = await patchUser(user.id, {
        passHash: djb2(next),
      });
      setUser(normalizeUser(updated));
      return updated;
    },
    [user]
  );

  const isFavorite = useCallback(
    (id) => {
      if (!user) return false;
      const favs = Array.isArray(user.favorites) ? user.favorites : [];
      return favs.some((favId) => String(favId) === String(id));
    },
    [user]
  );

  const toggleFavorite = useCallback(
    async (id) => {
      if (!user) return;
      const currentFavs = Array.isArray(user.favorites) ? user.favorites : [];
      const idStr = String(id);
      const exists = currentFavs.some((favId) => String(favId) === idStr);
      const nextFavorites = exists
        ? currentFavs.filter((favId) => String(favId) !== idStr)
        : [...currentFavs, id];

      const updated = await patchUser(user.id, { favorites: nextFavorites });
      setUser(normalizeUser(updated));
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
      requestReset,
      resetPassword,
      changePassword,
      isFavorite,
      toggleFavorite,
      get favorites() {
        return user?.favorites || [];
      },
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
      requestReset,
      resetPassword,
      changePassword,
      isFavorite,
      toggleFavorite,
    }),
    [user, loading, login, register, logout, updateProfile, requestReset, resetPassword, changePassword, isFavorite, toggleFavorite]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
