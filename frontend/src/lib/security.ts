// Input validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

// Session management
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const hasRole = (requiredRole: string): boolean => {
  // In a real application, you would decode the JWT token to get the user role
  // For now, we'll simulate this by checking localStorage
  const userRole = localStorage.getItem('userRole') || 'customer';
  return userRole === requiredRole;
};

// Auto logout on token invalidation
export const setupAutoLogout = (logoutCallback: () => void): void => {
  // Set up token expiration check
  const token = localStorage.getItem('token');
  if (token) {
    // In a real app, you would decode the JWT to get expiration time
    // For now, we'll just set a timeout for demonstration
    setTimeout(() => {
      if (!localStorage.getItem('token')) {
        logoutCallback();
      }
    }, 30000); // Check every 30 seconds
  }
};

// Rate limiting for API calls
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.limit) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    
    return true;
  }
}

export const apiRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

// Error handling
export const handleApiError = (error: any): { message: string; shouldLogout: boolean } => {
  console.error('API Error:', error);
  
  let message = 'An unexpected error occurred';
  let shouldLogout = false;
  
  if (error?.message) {
    message = error.message;
  }
  
  // Handle specific error cases
  if (error?.status === 401 || error?.code === 'invalid_token') {
    message = 'Your session has expired. Please log in again.';
    shouldLogout = true;
  } else if (error?.status === 403) {
    message = 'You do not have permission to perform this action.';
  } else if (error?.status === 429) {
    message = 'Too many requests. Please try again later.';
  }
  
  return { message, shouldLogout };
};

// Image optimization
export const optimizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Could not convert image to blob'));
        }
      }, 'image/jpeg', 0.8);
    };
    
    reader.onerror = () => {
      reject(new Error('Could not read file'));
    };
    
    reader.readAsDataURL(file);
  });
};