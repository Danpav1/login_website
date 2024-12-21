import React, { useContext, useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AuthContext } from '../contexts/authContext';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';

// Font Awesome Imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const formContainerRef = useRef(null);

  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Form submission handler
  const onSubmit = async (values, { setSubmitting }) => {
    setServerError('');
    const { name, email, password } = values;
    try {
      await register({ name, email, password });
      navigate('/dashboard'); // Redirect to dashboard upon successful registration
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    }
    setSubmitting(false);
  };

  // Common field classes for uniform input size
  const fieldClasses =
    'p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-200 outline outline-slate-800 pr-10';

  // Unified toggle handler
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-inherit pt-10 px-4">
      <div
        ref={formContainerRef}
        className="w-full max-w-3xl bg-inherit p-8 md:p-12 rounded shadow-2xl mt-4 space-y-12 outline outline-indigo-900"
      >
        <h2 className="text-4xl font-semibold text-center text-gray-100">Register</h2>

        {/* Reserved space for server error */}
        <div className="text-center min-h-[1.5rem]">
          {serverError && <span className="text-red-500">{serverError}</span>}
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-12">
                {/* Left Column: Name & Email */}
                <div className="space-y-10">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-gray-100 mb-1">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className={fieldClasses}
                    />
                    <div className="min-h-[1.25rem] mt-1">
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-gray-100 mb-1">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className={fieldClasses}
                    />
                    <div className="min-h-[1.25rem] mt-1">
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider - Hidden on Small Screens */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="border-l border-slate-600 shadow shadow-2xl mx-6 h-full"></div>
                </div>

                {/* Right Column: Password & Confirm Password */}
                <div className="space-y-10">
                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-gray-100 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        id="password"
                        className={fieldClasses}
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent p-0 m-0 cursor-pointer text-gray-800 hover:text-sky-500 focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        style={{ lineHeight: 0 }} // Ensures no extra space around the icon
                      >
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="min-h-[1.25rem] mt-1">
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-gray-100 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        id="confirmPassword"
                        className={fieldClasses}
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent p-0 m-0 cursor-pointer text-gray-800 hover:text-sky-500 focus:outline-none"
                        aria-label={showPassword ? 'Hide confirm password' : 'Show confirm password'}
                        style={{ lineHeight: 0 }} // Ensures no extra space around the icon
                      >
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="min-h-[1.25rem] mt-1">
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-2 text-white rounded text-lg ${
                  isSubmitting
                    ? 'bg-sky-300 cursor-not-allowed'
                    : 'bg-sky-500 hover:bg-sky-600'
                }`}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>

              {/* Bottom Link */}
              <p className="text-center text-gray-100 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-sky-500 hover:underline">
                  Login
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterPage;
