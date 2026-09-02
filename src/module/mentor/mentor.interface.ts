export interface IRegisterMentor {
  name: string;
  email: string;
  password: string;
}

export interface IVerifyMentor {
  email: string;
  otp: string;
}
