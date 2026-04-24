export function validatePassword(password) {
    const errors = [];

    if (!password) {
        errors.push("Password is required");
        return { isValid: false, errors };
    }

    if (typeof password !== "string") {
        errors.push("Password must be a string");
        return { isValid: false, errors };
    }

    if (password.length < 4) {
        errors.push("Password must be at least 4 characters long");
    }

    if (password.length > 128) {
        errors.push("Password must not exceed 128 characters");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function sanitizePassword(password) {
    // Trim whitespace
    return password?.trim() || "";
}
