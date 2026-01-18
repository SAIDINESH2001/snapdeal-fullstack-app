exports.userInputValidation = ({ name, email, phone, password, dob }) => {
  if (!name || !email || !phone || !password || !dob) {
    return { success: false, message: "All fields are required" };
  }
  if (typeof name !== "string" || !name.trim()) {
    return { success: false, message: "Name cannot be empty" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Invalid email" };
  }
  const phoneRegex = /^\+?[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return { success: false, message: "Invalid phone number" };
  }
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    return {
      success: false,
      message: "Password must be 6+ chars with 1 letter and 1 number",
    };
  }
  const parsedDate = new Date(dob);
  if (isNaN(parsedDate.getTime())) {
    return { success: false, message: "Invalid date of birth" };
  }
  return {
    success: true,
    parsedDate,
  };
};