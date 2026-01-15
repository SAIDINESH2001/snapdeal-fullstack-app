export const checkUserLogin = (input) => {
    if (!input) {
        return `Please enter mobile number or email address to login`;
    }

    const userInput = input.trim().toLowerCase();
    
    const mobileRegex = /^(\+[0-9]{10}|[0-9]{10})$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mobileRegex.test(userInput)) {
        return { type: 'phone', value: userInput };
    } else if (emailRegex.test(userInput)) {
        return { type: 'email', value: userInput };
    } else {
        return `Please provide a valid 10-digit mobile number or an email address.`;
    }
};
