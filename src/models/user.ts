interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  student_id: string;
  major: string;
  profile_picture: string;
  date_of_birth: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  year: string;
  institution_name?: string;
  gender: string;
  additional_notes?: string;
  file_path?: string;
  twofa_enabled: boolean;
  twofa_image?: string;
  twofa_secret?: string;
}

export default User;
