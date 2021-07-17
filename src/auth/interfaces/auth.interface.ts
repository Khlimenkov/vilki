export interface JwtPayload {
  username: string;
}

export interface RegistrationStatus {
  succes: boolean;
  message: string;
}

export interface Token {
  expiresIn: string;
  accessToken: string;
  refreshToken: string;
}

export interface ResponseToken extends Token {
  username: string;
}
