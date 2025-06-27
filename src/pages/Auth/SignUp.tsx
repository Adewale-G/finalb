import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, School, ArrowRight, Calendar, User, Mail, Phone, MapPin, GraduationCap, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Faculty {
  id: string;
  name: string;
  full_name: string;
}

interface Department {
  id: string;
  name: string;
  faculty_id: string;
}

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<any>({
    full_name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    date_of_birth: '',
    phone: '',
    address: '',
    role: 'student',
    faculty_id: '',
    department_id: '',
    matric_number: '',
    staff_id: ''
  });

  const { signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    if (formData.faculty_id) {
      fetchDepartments(formData.faculty_id);
    }
  }, [formData.faculty_id]);

  const fetchFaculties = async () => {
    const mockFaculties = [
      { id: '1', name: 'COPAS', full_name: 'College of Pure and Applied Sciences' },
      { id: '2', name: 'COLENSMA', full_name: 'College of Environmental Sciences and Management' },
      { id: '3', name: 'CASMAS', full_name: 'College of Art, Social, and Management Science' },
      { id: '4', name: 'COLAW', full_name: 'College of Law' },
      { id: '5', name: 'NURSING', full_name: 'College of Nursing and Basic Medical Sciences' }
    ];
    setFaculties(mockFaculties);
  };

  const fetchDepartments = async (facultyId: string) => {
    const mockDepartments: Record<string, Department[]> = {
      '1': [
        { id: '1', name: 'Computer Science', faculty_id: '1' },
        { id: '2', name: 'Biochemistry', faculty_id: '1' },
        { id: '3', name: 'Software Engineering', faculty_id: '1' }
      ],
      '2': [
        { id: '4', name: 'Architecture', faculty_id: '2' },
        { id: '5', name: 'Estate Management', faculty_id: '2' }
      ],
      '3': [
        { id: '6', name: 'Business Administration', faculty_id: '3' },
        { id: '7', name: 'Accounting', faculty_id: '3' },
        { id: '8', name: 'Economics', faculty_id: '3' }
      ],
      '4': [
        { id: '9', name: 'Public and Property Law', faculty_id: '4' },
        { id: '10', name: 'Private and International Law', faculty_id: '4' }
      ],
      '5': [
        { id: '11', name: 'Nursing Science', faculty_id: '5' },
        { id: '12', name: 'Human Physiology', faculty_id: '5' }
      ]
    };
    setDepartments(mockDepartments[facultyId] || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'faculty_id') {
      setFormData(prev => ({ ...prev, department_id: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.full_name || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all required fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        break;
      case 2:
        if (!formData.date_of_birth || !formData.phone) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 3:
        if (!formData.faculty_id || !formData.department_id) {
          setError('Please select faculty and department');
          return false;
        }
        if (formData.role === 'student' && !formData.matric_number) {
          setError('Matriculation number is required for students');
          return false;
        }
        if ((formData.role === 'lecturer' || formData.role === 'admin') && !formData.staff_id) {
          setError('Staff ID is required for lecturers and admins');
          return false;
        }
        break;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setLoading(true);
    setError('');

    const selectedFaculty = faculties.find(f => f.id === formData.faculty_id);
    const selectedDepartment = departments.find(d => d.id === formData.department_id);

    const avatarList = [
      'one.jpeg', 'two.jpeg', 'three.jpeg', 'four.jpeg', 'five.jpeg', 'six.jpeg',
      'seven.jpeg', 'eight.jpeg', 'nine.jpeg', 'ten.jpeg', 'eleven.jpeg', 'twelve.jpeg',
      'thirteen.jpeg', 'fourteen.jpeg', 'fifteen.jpeg', 'sixteen.jpeg', 'seventeen.jpeg', 'eighteen.jpeg'
    ];
    const randomAvatar = avatarList[Math.floor(Math.random() * avatarList.length)];
    const avatarUrl = `/${randomAvatar}`;

    const signupData = {
      ...formData,
      avatar_url: avatarUrl,
      faculty_name: selectedFaculty?.name,
      department_name: selectedDepartment?.name
    };

    const { error } = await signUp(signupData);
    if (error) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    } else {
      navigate('/', {
        state: {
          message: 'Account created successfully! Welcome to Pineappl.'
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 p-6 rounded-xl space-y-4 shadow-md"
      >
        <div className="text-center">
          <School className="mx-auto h-8 w-8 text-emerald-500" />
          <h1 className="text-2xl font-bold mt-2">Sign Up for Pineappl</h1>
          <p className="text-sm text-gray-400">Academic Performance Platform</p>
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        {currentStep === 1 && (
          <>
            <input name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="Full Name" className="input" />
            <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="input" />
            <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" className="input" />
            <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} placeholder="Password" className="input" />
            <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" className="input" />
          </>
        )}

        {currentStep === 2 && (
          <>
            <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleInputChange} className="input" />
            <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="input" />
            <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Address (Optional)" className="input" />
          </>
        )}

        {currentStep === 3 && (
          <>
            <select name="role" value={formData.role} onChange={handleInputChange} className="input">
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Admin</option>
            </select>
            <select name="faculty_id" value={formData.faculty_id} onChange={handleInputChange} className="input">
              <option value="">Select Faculty</option>
              {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <select name="department_id" value={formData.department_id} onChange={handleInputChange} className="input">
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {formData.role === 'student' && <input name="matric_number" value={formData.matric_number} onChange={handleInputChange} placeholder="Matric Number" className="input" />}
            {(formData.role === 'lecturer' || formData.role === 'admin') && <input name="staff_id" value={formData.staff_id} onChange={handleInputChange} placeholder="Staff ID" className="input" />}
          </>
        )}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <button type="button" onClick={handlePrevious} className="btn-secondary">Previous</button>
          )}
          {currentStep < 3 ? (
            <button type="button" onClick={handleNext} className="btn-primary">Next</button>
          ) : (
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
