// src/hooks/useAuth.ts
//
// Adapter hook: يوفّر نفس الـ shape القديم اللي الـ components بتعتمد عليه
// (user.userId, user.name, isAuthenticated, login, logout) لكن البيانات
// الفعلية بتيجي من الـ auth store الجديد بتاع features/auth.
//
// كده الـ Announcements components تكمل شغالة بدون أي تغيير، والمستخدم
// اللي عمل login من LoginPage الجديدة (useAuthStore) بيظهر هنا تلقائياً.

import { useAuthStore } from "@/features/auth";
import type { LoginEmailRequest } from "@/features/auth";

export interface CurrentUser {
  userId: string;
  email?: string;
  name?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

export interface AuthContextValue {
  user: CurrentUser | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginEmailRequest) => Promise<void>;
  logout: () => void;
}

export function useAuth(): AuthContextValue {
  const storeUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isStoreLoading = useAuthStore((state) => state.isLoading);
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail);
  const logoutFn = useAuthStore((state) => state.logout);

  // map من الـ shape الجديد إلى shape الـ legacy components
  const user: CurrentUser | null | undefined = storeUser
    ? {
        userId: storeUser.id,
        email: storeUser.email ?? undefined,
        name: `${storeUser.firstName ?? ""} ${storeUser.lastName ?? ""}`.trim(),
        role: storeUser.role,
        firstName: storeUser.firstName,
        lastName: storeUser.lastName,
      }
    : isHydrated
    ? null
    : undefined; // لسه بيحمّل

  return {
    user,
    isAuthenticated,
    // بنعتبره loading طول ما الـ store لسه ما عملش hydrate
    isLoading: !isHydrated || isStoreLoading,
    login: loginWithEmail,
    logout: logoutFn,
  };
}
