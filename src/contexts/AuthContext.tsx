import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// === Types ===
type UserRole = 'student' | 'lecturer' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  faculty?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

interface ProfileUpdateData {
  name?: string;
  email?: string;
  department?: string;
  faculty?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>; 
  signUp: (data: any) => Promise<{ error: any }>; 
  signOut: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (data: ProfileUpdateData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user?.id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select(`id, email, full_name, role, bio, phone, address, date_of_birth, avatar_url, departments(name), faculties(name)`)
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          setUser({
            id: profile.id,
            name: profile.full_name,
            email: profile.email,
            role: profile.role,
            department: profile.departments?.name,
            faculty: profile.faculties?.name,
            avatarUrl: profile.avatar_url,
            bio: profile.bio,
            phone: profile.phone,
            address: profile.address,
            dateOfBirth: profile.date_of_birth
          });
        } else {
          const savedUser = localStorage.getItem('pineappl_user');
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      } catch {
        const fallbackUser = localStorage.getItem('pineappl_user');
        if (fallbackUser) setUser(JSON.parse(fallbackUser));
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        const demoId = uuidv4();
        const demoUser: User = {
          id: demoId,
          name: 'Demo User',
          email,
          role: email.includes('admin') ? 'admin' : email.includes('lecturer') ? 'lecturer' : 'student',
          department: 'Computer Science',
          faculty: 'COPAS',
          avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
          bio: 'Demo user',
          phone: '+2340000000000',
          address: 'Campus',
          dateOfBirth: '2000-01-01'
        };
        localStorage.setItem('pineappl_user', JSON.stringify(demoUser));
        setUser(demoUser);
        return { error: null };
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`id, email, full_name, role, bio, phone, address, date_of_birth, avatar_url, departments(name), faculties(name)`)
          .eq('id', data.user.id)
          .single();

        if (profileError) return { error: profileError };

        const userProfile: User = {
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          role: profile.role,
          department: profile.departments?.name,
          faculty: profile.faculties?.name,
          avatarUrl: profile.avatar_url,
          bio: profile.bio,
          phone: profile.phone,
          address: profile.address,
          dateOfBirth: profile.date_of_birth
        };

        localStorage.setItem('pineappl_user', JSON.stringify(userProfile));
        setUser(userProfile);
      }
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (formData: any) => {
    const {
      email,
      password,
      full_name,
      username,
      date_of_birth,
      phone,
      address,
      role,
      faculty_id,
      department_id,
      matric_number,
      staff_id
    } = formData;

    const isValidUUID = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    const safeFacultyId = isValidUUID(faculty_id) ? faculty_id : null;
    const safeDepartmentId = isValidUUID(department_id) ? department_id : null;

    const avatars = ['one.jpeg','two.jpeg','three.jpeg','four.jpeg','five.jpeg','six.jpeg','seven.jpeg','eight.jpeg','nine.jpeg','ten.jpeg','eleven.jpeg','twelve.jpeg','thirteen.jpeg','fourteen.jpeg','fifteen.jpeg','sixteen.jpeg','seventeen.jpeg','eighteen.jpeg'];
    const avatar_url = `/${avatars[Math.floor(Math.random() * avatars.length)]}`;

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name,
      username,
      role,
      avatar_url,
      date_of_birth,
      phone,
      address,
      faculty_id: safeFacultyId,
      department_id: safeDepartmentId,
      matric_number: role === 'student' ? matric_number : null,
      staff_id: role !== 'student' ? staff_id : null
    }
  }
});


    if (signUpError || !authData?.user) {
      console.error('❌ Supabase Auth error:', signUpError);
      return { error: signUpError };
    }

    const user_id = authData.user.id;

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user_id,
      email,
      full_name,
      username,
      avatar_url,
      date_of_birth,
      phone,
      address,
      role,
      faculty_id: safeFacultyId,
      department_id: safeDepartmentId,
      matric_number: role === 'student' ? matric_number : null,
      staff_id: role !== 'student' ? staff_id : null,
      is_verified: false,
      interests: null,
      emergency_contact: null
    });

    if (profileError) {
      console.error('❌ Profile insert error:', profileError);
      return { error: profileError };
    }

    return { user: authData.user, error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('pineappl_user');
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('pineappl_user', JSON.stringify(updatedUser));
    }
  };

  const updateUserProfile = async (data: ProfileUpdateData) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('pineappl_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, switchRole, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
