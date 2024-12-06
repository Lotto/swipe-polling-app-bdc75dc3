export interface Survey {
  id: string;
  title: string;
  questions: string[];
  created_at: string;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  question_index: number;
  is_liked: boolean;
  created_at: string;
}