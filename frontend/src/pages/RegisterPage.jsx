// src/pages/RegisterPage.jsx
import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AuthContext } from '../contexts/authContext';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

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

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 pt-10">
      <div className="w-full max-w-md bg-white p-8 rounded shadow mt-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {serverError && (
          <div className="mb-4 text-red-500 text-center">
            {serverError}
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">
                  Name
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-2 text-white rounded ${
                  isSubmitting
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

