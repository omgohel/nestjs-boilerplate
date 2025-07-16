export const RESPONSE_MESSAGES = {
  USER: {
    CREATED: 'User created successfully',
    FETCHED: 'Users retrieved successfully',
    FOUND: 'User retrieved successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    RESTORED: 'User restored successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    NOT_FOUND: 'User not found',
    EMAIL_EXISTS: 'User with this email already exists',
    EMAIL_TAKEN: 'Email already taken',
    INVALID_OLD_PASSWORD: 'Old password is incorrect',
  },
  COMMON: {
    SUCCESS: 'Operation completed successfully',
    FAILURE: 'Operation failed',
    VALIDATION_ERROR: 'Validation failed',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    INTERNAL_ERROR: 'Internal server error',
  },
} as const;