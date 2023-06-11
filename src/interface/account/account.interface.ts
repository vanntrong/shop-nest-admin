export type UpdateMePayload = {
  full_name?: string;
  email?: string;
  picture?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: Date;
  phone?: string;
};
