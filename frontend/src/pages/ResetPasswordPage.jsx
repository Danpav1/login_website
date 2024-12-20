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
    className="w-12 h-12 border rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
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

  const params = new URLSearchParams(location.search);
  const passedEmail = params.get('email') || '';

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

  const inputRefs = useRef([]);
  inputRefs.current = Array.from({ length: 6 }, (_, i) => inputRefs.current[i] || React.createRef());

  const passwordRef = useRef(null);

  const handleOTPChange = (index, e) => {
    const inputVal = e.target.value;
    const cleanedVal = inputVal.replace(/\D/g, ''); // only digits

    if (cleanedVal.length > 1) {
      // Paste scenario
      const newDigits = [...otpDigits];
      let currentIndex = index;
      for (let char of cleanedVal) {
        if (currentIndex > 5) break;
        newDigits[currentIndex] = char;
        currentIndex++;
      }
      setOtpDigits(newDigits);

      let nextEmptyIndex = newDigits.findIndex(d => d === '');
      if (nextEmptyIndex === -1) {
        // All filled, focus password
        passwordRef.current.focus();
      } else {
        inputRefs.current[nextEmptyIndex].current.focus();
      }
    } else {
      // Single character scenario
      const newDigits = [...otpDigits];
      newDigits[index] = cleanedVal;
      setOtpDigits(newDigits);

      if (cleanedVal && index < 5) {
        inputRefs.current[index + 1].current.focus();
      } else if (index === 5 && cleanedVal) {
        passwordRef.current.focus();
      }
    }
  };

  const handleBackspace = (index) => {
    if (index > 0) {
      inputRefs.current[index - 1].current.focus();
      const newDigits = [...otpDigits];
      newDigits[index - 1] = '';
      setOtpDigits(newDigits);
    }
  };

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
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('Reset Password error:', err.response);
      setServerError(err.response?.data?.message || 'An unexpected error occurred.');
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-inherit pt-10 px-4">
      <div className="w-full max-w-md bg-inherit p-8 rounded shadow-2xl mt-4 space-y-8 outline outline-indigo-900">
        <h2 className="text-3xl font-semibold text-center text-gray-100 mb-6">Reset Password</h2>

        {message && (
          <div className="text-green-500 text-center mb-6">
            {message}
          </div>
        )}
        {serverError && (
          <div className="text-red-500 text-center mb-6">
            {serverError}
          </div>
        )}

        <p className="text-center text-gray-100">
          Please enter the 6-digit OTP sent to <strong>{passedEmail}</strong>.
        </p>
        <div className="flex justify-center space-x-2">
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
            <Form className="space-y-6">
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-gray-100 mb-1">
                  New Password
                </label>
                <Field
                  innerRef={passwordRef}
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-200 outline outline-slate-800"
                />
                <div className="min-h-[1.25rem] mt-1">
                  <ErrorMessage
                    name="newPassword"
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
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-200 outline outline-slate-800"
                />
                <div className="min-h-[1.25rem] mt-1">
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
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
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordPage;
