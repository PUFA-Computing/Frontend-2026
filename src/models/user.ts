interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
password: string;
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
student_id_verified: boolean;
  file_path?: string;
  file_paths?: string[]; 
  twofa_enabled: boolean;
  twofa_image?: string;
  twofa_secret?: string;
}

export default User;
