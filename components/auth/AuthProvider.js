'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// إنشاء Context للمصادقة
const AuthContext = createContext({
  user: null,
  merchant: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  refreshSession: async () => {}
});

/**
 * مزود المصادقة
 */
export function AuthProvider({ children, initialSession = null }) {
  const [user, setUser] = useState(initialSession?.user || null);
  const [merchant, setMerchant] = useState(initialSession?.merchant || null);
  const [isLoading, setIsLoading] = useState(!initialSession);
  const router = useRouter();

  // التحقق من الجلسة عند التحميل
  useEffect(() => {
    if (!initialSession) {
      refreshSession();
    }
  }, []);

  /**
   * تحديث الجلسة
   */
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/session');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user || null);
        setMerchant(data.merchant || null);
      } else {
        setUser(null);
        setMerchant(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setUser(null);
      setMerchant(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * تسجيل الدخول
   */
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل تسجيل الدخول');
      }

      // تحديث الجلسة
      await refreshSession();

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * تسجيل الخروج
   */
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setMerchant(null);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    user,
    merchant,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook لاستخدام المصادقة
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * مكون حماية الصفحات
 */
export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return children;
}

export default AuthContext;
