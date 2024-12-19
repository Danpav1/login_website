// src/pages/ResetPasswordPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/authContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const ResetPasswordPage = () => {
  const { resetPassword } = useContext(AuthContext);
  const [serverError, setServerError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from query param if available
  const params = new URLSearchParams(location.search);
  const passedEmail = params.get('email') || '';

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    otp: Yup.string().length(6, 'OTP must be exactly 6 digits').required('OTP is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match').required('Confirm password is required'),
  });

  const initialValues = {
    email: passedEmail,
    otp: '',
    newPassword: '',
    confirmPassword: '',
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setServerError('');
    setMessage('');
    try {
      const response = await resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      setMessage(response.message);
      resetForm();
      // After a successful reset, redirect to login after a short delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('Reset Password error:', err.response);
      setServerError(err.response?.data?.message || 'An unexpected error occurred.');
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Reset Password</h2>
        {message && <div className="text-green-500 text-center">{message}</div>}
        {serverError && <div className="text-red-500 text-center">{serverError}</div>}
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email Address
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* OTP Field */}
              <div className="mb-4">
                <label htmlFor="otp" className="block text-gray-700">
                  OTP
                </label>
                <Field
                  type="text"
                  name="otp"
                  id="otp"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="6-digit OTP"
                />
                <ErrorMessage name="otp" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* New Password Field */}
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-gray-700">
                  New Password
                </label>
                <Field
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your new password"
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
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
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm your new password"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-2 text-white rounded ${
                  isSubmitting ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } transition-colors`}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </Form>
          )}
        </Formik>
        <div className="mt-4 flex flex-col items-center">
          <p className="text-center text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-indigo-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
