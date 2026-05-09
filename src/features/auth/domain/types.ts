export type LoginMethod = "EMAIL" | "PHONE" | string;

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  password?: string;
  type?: string;
  unitId?: string;
  loginMethod: LoginMethod;
};

export type LoginEmailRequest = {
  email: string;
  password: string;
};

export type LoginPhoneRequest = {
  phoneNumber: string;
  otpCode: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type SendOtpRequest = {
  phoneNumber: string;
};

export type AuthResponse = {
  userId: string | null;
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string | null;
  role: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  loginMethod: LoginMethod;
};

export type AuthTokens = Pick<AuthResponse, "accessToken" | "refreshToken">;
