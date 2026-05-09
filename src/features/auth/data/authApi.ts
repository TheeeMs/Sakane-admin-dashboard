import { httpClient } from "@/lib/api/httpClient";
import type {
  AuthResponse,
  AuthUser,
  LoginEmailRequest,
  LoginPhoneRequest,
  RefreshRequest,
  RegisterRequest,
  SendOtpRequest,
} from "../domain/types";

export const authApi = {
  register(payload: RegisterRequest) {
    return httpClient.post<AuthResponse>("/v1/auth/register", payload);
  },

  sendOtp(payload: SendOtpRequest) {
    return httpClient.post<{ message: string; phoneNumber: string; otpCode?: string }>(
      "/v1/auth/send-otp",
      payload,
    );
  },

  loginWithPhone(payload: LoginPhoneRequest) {
    return httpClient.post<AuthResponse>("/v1/auth/login/phone", payload);
  },

  loginWithEmail(payload: LoginEmailRequest) {
    return httpClient.post<AuthResponse>("/v1/auth/login/email", payload);
  },

  refresh(payload: RefreshRequest) {
    return httpClient.post<AuthResponse>("/v1/auth/refresh", payload);
  },

  me() {
    return httpClient.get<AuthUser>("/v1/auth/me");
  },
};
