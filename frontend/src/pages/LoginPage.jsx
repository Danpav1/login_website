import React, { useContext, useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AuthContext } from '../contexts/authContext';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';

// Font Awesome Imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const formContainerRef = useRef(null);

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  // Smooth scroll into view on mount
  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  // Initial form values
  const initialValues = {
    email: '',
    password: '',
  };

  // Form submission handler
  const onSubmit = async (values, { setSubmitting }) => {
    setServerError('');
    const { email, password } = values;
    try {
      await login({ email, password });
      navigate('/dashboard'); // Redirect to dashboard upon successful login
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-inherit pt-10 px-4">
      <div
        ref={formContainerRef}
        className="w-full max-w-md bg-inherit p-8 rounded shadow-2xl mt-4 space-y-8 outline outline-indigo-900"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-100 mb-6">Login</h2>

        {/* Reserved space for server error */}
        <div className="text-center mb-6 min-h-[1.5rem]">
          {serverError && <span className="text-red-500">{serverError}</span>}
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-gray-100 mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-200 outline outline-slate-800"
                />
                <div className="min-h-[1.25rem] mt-1">
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              {/* Password Field with Icon Button */}
              <div>
                <label htmlFor="password" className="block text-gray-100 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    className="p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-200 outline outline-slate-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent p-0 m-0 cursor-pointer text-gray-800 hover:text-sky-500 focus:outline-none"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-2 text-white rounded shadow-2xl ${
                  isSubmitting
                    ? 'bg-sky-300 cursor-not-allowed'
                    : 'bg-sky-500 hover:bg-sky-600'
                }`}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="flex flex-col items-center space-y-2">
          <p className="text-center text-gray-100 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-500 hover:underline">
              Register
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className="text-sky-500 hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
