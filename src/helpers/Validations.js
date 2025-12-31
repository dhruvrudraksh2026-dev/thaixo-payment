export const validateName = name => 
{
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
}

export const validateEmail = email =>
{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const validatePhoneNumber = phoneNumber =>
{
    const phoneRegex = /^\+?[1-9]\d{7,15}$/;
    return phoneRegex.test(phoneNumber);
}