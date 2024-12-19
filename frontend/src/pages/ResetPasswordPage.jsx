// src/pages/ResetPasswordPage.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../contexts/authContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const OTPInput = React.forwardRef(({ value, onChange, onBackspace }, ref) => (
  <input
    ref={ref}
    type="text"
    maxLength="1"
    className="w-12 h-12 border rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
    value={value}
    onChange={onChange}
    onKeyDown={(e) => {
      if (e.key === 'Backspace' && !value && onBackspace) {
        onBackspace();
      }
    }}
  />
));

const ResetPasswordPage = () => {
  const { resetPassword } = useContext(AuthContext);
  const [serverError, setServerError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from query param passed from forgot-password page
  const params = new URLSearchParams(location.search);
  const passedEmail = params.get('email') || '';

  // State for OTP digits
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

  // References to each OTP input
  const inputRefs = useRef([]);
  inputRefs.current = Array.from({ length: 6 }, (_, i) => inputRefs.current[i] || React.createRef());

  // Reference for password input to focus after OTP is complete
  const passwordRef = useRef(null);

  const handleOTPChange = (index, e) => {
    const inputVal = e.target.value;
    const cleanedVal = inputVal.replace(/\D/g, ''); // only digits

    // If user pasted multiple characters:
    if (cleanedVal.length > 1) {
      // Distribute characters across this and subsequent boxes
      const newDigits = [...otpDigits];
      let currentIndex = index;
      for (let char of cleanedVal) {
        if (currentIndex > 5) break; // no more boxes
        newDigits[currentIndex] = char;
        currentIndex++;
      }
      setOtpDigits(newDigits);

      // Focus next empty box if any
      let nextEmptyIndex = newDigits.findIndex(d => d === '');
      if (nextEmptyIndex === -1) {
        // All filled, focus password
        passwordRef.current.focus();
      } else {
        inputRefs.current[nextEmptyIndex].current.focus();
      }
    } else {
      // Single character input
      const newDigits = [...otpDigits];
      newDigits[index] = cleanedVal;
      setOtpDigits(newDigits);

      if (cleanedVal && index < 5) {
        // Move to next input if filled and not last box
        inputRefs.current[index + 1].current.focus();
      } else if (index === 5 && cleanedVal) {
        // If last box filled, focus password
        passwordRef.current.focus();
      }
    }
  };

  const handleBackspace = (index) => {
    if (index > 0) {
      // Move focus to previous input
      inputRefs.current[index - 1].current.focus();
      const newDigits = [...otpDigits];
      newDigits[index - 1] = '';
      setOtpDigits(newDigits);
    }
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const initialValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setServerError('');
    setMessage('');

    const otp = otpDigits.join('');
    if (otp.length < 6 || otpDigits.some(d => d === '')) {
      setServerError('Please enter all 6 digits of the OTP.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await resetPassword({
        email: passedEmail,
        otp,
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

        <p className="text-center text-gray-700 mb-4">
          Please enter the 6-digit OTP sent to <strong>{passedEmail}</strong>.
        </p>

        <div className="flex justify-center space-x-2 mb-4">
          {otpDigits.map((digit, i) => (
            <OTPInput
              key={i}
              value={digit}
              onChange={(e) => handleOTPChange(i, e)}
              onBackspace={() => handleBackspace(i)}
              ref={inputRefs.current[i]}
            />
          ))}
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              {/* New Password Field */}
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-gray-700">
                  New Password
                </label>
                <Field
                  innerRef={passwordRef}
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
