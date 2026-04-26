const DEFAULT_JWT_SECRET = 'rahasia-super-kuat-ews-123';

// Gunakan satu sumber secret agar sign/verify selalu konsisten.
export const JWT_SECRET = process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET;
