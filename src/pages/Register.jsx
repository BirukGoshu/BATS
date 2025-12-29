import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardBody, CardFooter } from '../components/ui/Card';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    group: '',
    companyname: '',
    license: null,
    portfolio: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const groupOptions = [
    { value: 'company', label: 'Company' },
    { value: 'agent', label: 'Agent' },
    { value: 'designer', label: 'Designer' },
    { value: 'client', label: 'Client' },
  ];

  // Check which additional field is required based on group
  const showCompanyName = formData.group === 'company';
  const showLicense = formData.group === 'agent';
  const showPortfolio = formData.group === 'designer';
  const requiresAdditionalFields = showCompanyName || showLicense || showPortfolio;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
    // Clear error when user selects a file
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Password confirmation validation
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    // Group validation
    if (!formData.group) {
      newErrors.group = 'Please select a group';
    }

    // Conditional fields validation based on group
    if (formData.group === 'company') {
      if (!formData.companyname.trim()) {
        newErrors.companyname = 'Company name is required';
      }
    }

    if (formData.group === 'agent') {
      if (!formData.license) {
        newErrors.license = 'License file is required';
      }
    }

    if (formData.group === 'designer') {
      if (!formData.portfolio) {
        newErrors.portfolio = 'Portfolio file is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      submitData.append('email', formData.email);
      submitData.append('username', formData.username);
      submitData.append('password', formData.password);
      submitData.append('password_confirmation', formData.password_confirmation);
      submitData.append('group', formData.group);

      // Add conditional fields based on group
      if (formData.group === 'company' && formData.companyname) {
        submitData.append('companyname', formData.companyname);
      }

      if (formData.group === 'agent' && formData.license) {
        submitData.append('license', formData.license);
      }

      if (formData.group === 'designer' && formData.portfolio) {
        submitData.append('portfolio', formData.portfolio);
      }

      await register(submitData);
      // Redirect to login after successful registration
      navigate('/login');
    } catch (error) {
      // Error is already handled by AuthContext with toast notification
      console.error('Registration error:', error);
      
      // Handle field-specific errors from backend
      if (error.response?.data) {
        const backendErrors = error.response.data;
        const fieldErrors = {};
        
        Object.keys(backendErrors).forEach((key) => {
          if (Array.isArray(backendErrors[key])) {
            fieldErrors[key] = backendErrors[key][0];
          } else {
            fieldErrors[key] = backendErrors[key];
          }
        });
        
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader>
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join BATS Fashion today
            </p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <Input
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={errors.email}
                required
                autoComplete="email"
              />

              {/* Username */}
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                error={errors.username}
                required
                autoComplete="username"
              />

              {/* Password */}
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                required
                autoComplete="new-password"
              />

              {/* Password Confirmation */}
              <Input
                label="Confirm Password"
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Confirm your password"
                error={errors.password_confirmation}
                required
                autoComplete="new-password"
              />

              {/* Group Selection */}
              <Select
                label="Account Type"
                name="group"
                value={formData.group}
                onChange={handleChange}
                options={groupOptions}
                error={errors.group}
                required
                placeholder="Select account type"
              />

              {/* Conditional Fields - Show specific field based on group */}
              {requiresAdditionalFields && (
                <div className="space-y-6 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Additional Information
                  </h3>

                  {/* Company Name - Only for Company */}
                  {showCompanyName && (
                    <Input
                      label="Company Name"
                      type="text"
                      name="companyname"
                      value={formData.companyname}
                      onChange={handleChange}
                      placeholder="Enter company name"
                      error={errors.companyname}
                      required
                    />
                  )}

                  {/* License File - Only for Agent */}
                  {showLicense && (
                    <div className="w-full">
                      <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                        License <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        id="license"
                        name="license"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.license ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.license && (
                        <p className="mt-1 text-sm text-red-600">{errors.license}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Accepted formats: PDF, DOC, DOCX, JPG, PNG
                      </p>
                    </div>
                  )}

                  {/* Portfolio File - Only for Designer */}
                  {showPortfolio && (
                    <div className="w-full">
                      <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
                        Portfolio <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        id="portfolio"
                        name="portfolio"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.portfolio ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.portfolio && (
                        <p className="mt-1 text-sm text-red-600">{errors.portfolio}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Accepted formats: PDF, DOC, DOCX, JPG, PNG
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Create Account
              </Button>
            </form>
          </CardBody>
          <CardFooter>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;


