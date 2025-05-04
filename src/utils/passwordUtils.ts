
export function generateStrongPassword(): string {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  // Ensure at least one of each required character type
  password += charset.match(/[A-Z]/)[0]; // Uppercase
  password += charset.match(/[a-z]/)[0]; // Lowercase
  password += charset.match(/[0-9]/)[0]; // Number
  password += charset.match(/[!@#$%^&*]/)[0]; // Special character
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
