// src/pages/ForgotPasswordPage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [serverError, setServerError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const initialValues = {
    email: '',
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setServerError('');
    setMessage('');
    try {
      const response = await forgotPassword(values);
      setMessage(response.message);
      resetForm();
      // After a successful OTP send, navigate to reset password page
      // Pass the email along as a query parameter
      navigate(`/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      console.error('Forgot Password error:', err.response);
      setServerError(err.response?.data?.message || 'An unexpected error occurred.');
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Forgot Password</h2>
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
                  placeholder="Enter your registered email"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-2 text-white rounded ${
                  isSubmitting ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } transition-colors`}
              >
                {isSubmitting ? 'Sending...' : 'Send OTP'}
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

export default ForgotPasswordPage;
