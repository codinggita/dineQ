import { useEffect, useState } from "react";

export const UserRole = {
  CUSTOMER: "customer",
  OWNER: "owner",
};

const KEY = "qt_role";

export function getStoredRole() {
  if (typeof window === "undefined") return "customer";
  const v = window.localStorage.getItem(KEY);
  return v === "owner" ? "owner" : "customer";
}

export function setStoredRole(role) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, role);
  window.dispatchEvent(new CustomEvent("qt-role-change"));
}

export function useRole() {
  const [role, setRole] = useState("customer");
  useEffect(() => {
    setRole(getStoredRole());
    const handler = () => setRole(getStoredRole());
    window.addEventListener("qt-role-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("qt-role-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return role;
}
