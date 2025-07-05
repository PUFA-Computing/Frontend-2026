export interface EventRegistration {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  event_id: string;
  event_title?: string;
  registration_date: string;
  status: string;
  file_count: number;
  file_path?: string;
  additional_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventRegistrationsResponse {
  event_title: string;
  registrations: EventRegistration[];
}
