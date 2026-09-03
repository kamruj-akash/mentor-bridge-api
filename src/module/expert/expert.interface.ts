export interface IRegisterMentor {
  name: string;
  email: string;
  password: string;
}

export interface IVerifyMentor {
  email: string;
  otp: string;
  university: string;
  department: string;
  hourlyRate: number;
  bio: string;
}

export interface IApproveMentor {
  status: string;
  reason?: string;
  mentorId: string;
}
