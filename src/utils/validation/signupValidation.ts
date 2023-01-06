export const validateEmail = (email: string): boolean => {
  const regex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
  return regex.test(email);
}

export const validatePassword = (password: string): boolean => {
  // Minimum six characters,
  // at least one uppercase letter,
  // one lowercase letter,
  // one number
  // and one special character:
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return regex.test(password);
}