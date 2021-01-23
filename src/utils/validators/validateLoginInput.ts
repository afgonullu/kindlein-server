interface LoginInput {
  username: string;
  password: string;
  general: string;
}

export const validateLoginInput = (username: string, password: string): { errors: LoginInput; valid: boolean } => {
  const errors = {} as LoginInput;

  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }

  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
