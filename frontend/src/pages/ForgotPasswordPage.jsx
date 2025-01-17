import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../contexts/authContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [serverError, setServerError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const formContainerRef = useRef(null);

  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

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
    <div className="flex items-start justify-center min-h-screen bg-inherit pt-10 px-4">
      <div
        ref={formContainerRef}
        className="w-full max-w-md bg-inherit p-8 rounded shadow-2xl mt-4 space-y-8 outline outline-indigo-900"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-100 mb-6">Forgot Password</h2>

        {/* Reserved space for server error */}
        <div className="text-center mb-6 min-h-[1.25rem]">
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
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-2 text-white rounded ${
                  isSubmitting ? 'bg-sky-300 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="flex flex-col items-center space-y-2">
          <p className="text-center text-gray-100 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-sky-500 hover:underline text-sm">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
