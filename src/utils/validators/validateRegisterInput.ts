export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const validateRegisterInput = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
): { errors: RegisterInput; valid: boolean } => {
  const errors = {} as RegisterInput;

  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }

  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!regEx.exec(email)) {
      errors.email = "Email must be a valid email address";
    }
  }

  if (password === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
