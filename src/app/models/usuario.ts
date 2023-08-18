export interface Usuario {
  rolId: number;
  email: string;
  passwordUser: string;
  statusUser: boolean;
  isAuthenticated: boolean;
  bearerToken: string;
}
