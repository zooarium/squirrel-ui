export class NetworkError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

export class AuthError extends NetworkError {
  constructor() {
    super('Session expired. Please log in again.', 401);
    this.name = 'AuthError';
  }
}
