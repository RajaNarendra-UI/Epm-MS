export const validateField = (name, value, employee = null) => {
    switch (name) {
        case 'name':
            if (!value.trim()) {
                return 'Name is required';
            } else if (!/^[A-Za-z\s]+$/.test(value)) {
                return 'Name should contain only alphabets';
            }
            break;

        case 'email':
            if (!value) {
                return 'Email is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(com|co)$/i.test(value)) {
                return 'Invalid email format (must end with .com or .co)';
            }
            break;

        case 'salary':
            if (!value) {
                return 'Salary is required';
            } else if (!/^[1-9]\d*$/.test(value)) {
                return 'Salary must be a positive integer and not start with 0';
            }
            break;

        case 'address':
            if (!value.trim()) {
                return 'Address is required';
            }
            break;

        case 'image':
            if (!value && (!employee || !employee.existing_image)) {
                return 'Image is required';
            } else if (value) {
                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
                if (!validTypes.includes(value.type)) {
                    return 'Invalid image format (must be jpeg, png, or gif)';
                }
                if (value.size > 5 * 1024 * 1024) {
                    return 'Image size must be less than 5MB';
                }
            }
            break;

        default:
            return '';
    }
    return '';
};

export const validateEmployee = (employee) => {
    const errors = {};
    
    const nameError = validateField('name', employee.name);
    if (nameError) errors.name = nameError;

    const emailError = validateField('email', employee.email);
    if (emailError) errors.email = emailError;

    const salaryError = validateField('salary', employee.salary);
    if (salaryError) errors.salary = salaryError;

    const addressError = validateField('address', employee.address);
    if (addressError) errors.address = addressError;

    const imageError = validateField('image', employee.image, employee);
    if (imageError) errors.image = imageError;

    return errors;
}; 