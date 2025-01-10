import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../contexts/authContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// Font Awesome Imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// OTPInput Component
const OTPInput = React.forwardRef(({ index, value, onChange, onPaste, onKeyDown }, ref) => (
  <input
    ref={ref}
    type="text"
    maxLength="1"
    className="w-12 h-12 border rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
    value={value}
    onChange={onChange}
    onPaste={onPaste}
    onKeyDown={(e) => onKeyDown(e, index, value)}
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
  const confirmPasswordRef = useRef(null); // Reference for Confirm Password field
  const formContainerRef = useRef(null);

  // Unified Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const focusNextEmpty = (newDigits) => {
    const nextEmptyIndex = newDigits.findIndex(d => d === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex].current.focus();
    } else {
      // All filled, focus password field
      passwordRef.current.focus();
    }
  };

  const handleBackspaceOnEmpty = (index) => {
    // Move focus to previous box and clear it if possible
    if (index > 0) {
      const newDigits = [...otpDigits];
      newDigits[index - 1] = '';
      setOtpDigits(newDigits);
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handleBackspaceOnFilled = (index) => {
    const newDigits = [...otpDigits];
    newDigits[index] = ''; // Clear the current box
    setOtpDigits(newDigits);
    // Keep focus on this box so user can type a new number
    inputRefs.current[index].current.focus();
  };

  const handleKeyDown = (e, index, value) => {
    if (e.key === 'Backspace') {
      e.preventDefault(); // Prevent default to avoid navigation
      if (value) {
        // There is a digit here, just clear this box
        handleBackspaceOnFilled(index);
      } else {
        // Empty box, go to previous
        handleBackspaceOnEmpty(index);
      }
    }
  };

  const handleSingleCharInput = (char) => {
    // Find leftmost empty box
    const newDigits = [...otpDigits];
    const emptyIndex = newDigits.findIndex(d => d === '');

    if (emptyIndex !== -1) {
      newDigits[emptyIndex] = char;
      setOtpDigits(newDigits);
      focusNextEmpty(newDigits);
    }
    // If no empty box, ignore input
  };

  const handlePaste = (pastedValue) => {
    // Only if all boxes are empty
    if (otpDigits.every(d => d === '')) {
      const cleaned = pastedValue.replace(/\D/g, '');
      const newDigits = [...otpDigits];
      for (let i = 0; i < Math.min(cleaned.length, 6); i++) {
        newDigits[i] = cleaned[i];
      }
      setOtpDigits(newDigits);
      focusNextEmpty(newDigits);
    }
  };

  const handleOTPChange = (index, e) => {
    const inputVal = e.target.value;
    const cleanedVal = inputVal.replace(/\D/g, ''); // only digits

    if (cleanedVal.length > 1) {
      // Paste scenario from a single box
      // If all empty, handle full paste
      if (otpDigits.every(d => d === '')) {
        handlePaste(cleanedVal);
      } else {
        // If not all empty, just take the first char and fill normally
        const firstChar = cleanedVal.charAt(0);
        handleSingleCharInput(firstChar);
      }
    } else if (cleanedVal.length === 1) {
      // Single char typed
      handleSingleCharInput(cleanedVal);
    } else {
      // No valid digit input, do nothing
    }

    // Reset the input's displayed value since we're controlling the state
    // and placing characters where we want them, not necessarily this box.
    e.target.value = '';
  };

  const handleOTPBoxPaste = (index, e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text');
    // If all empty and more than one char pasted, handle paste
    if (otpDigits.every(d => d === '') && pastedData.length > 1) {
      handlePaste(pastedData);
    } else {
      // Otherwise just take the first character and input it normally
      const cleaned = pastedData.replace(/\D/g, '');
      if (cleaned.length > 0) {
        handleSingleCharInput(cleaned.charAt(0));
      }
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
      setOtpDigits(['', '', '', '', '', '']); // Reset OTP digits
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('Reset Password error:', err.response);
      setServerError(err.response?.data?.message || 'An unexpected error occurred.');
    }
    setSubmitting(false);
  };

  // Common field classes for uniform input size
  const fieldClasses = "p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-200 outline outline-slate-800 pr-10";

  return (
    <div className="flex items-start justify-center min-h-screen bg-inherit pt-10 px-4">
      <div
        ref={formContainerRef}
        className="w-full max-w-lg bg-inherit p-8 rounded shadow-2xl mt-4 space-y-8 outline outline-indigo-900" // Changed max-w-md to max-w-lg
      >
        <h2 className="text-3xl font-semibold text-center text-gray-100 mb-6">Reset Password</h2>

        {/* Unified space for success and error messages */}
        <div className="text-center mb-6 min-h-[1.5rem]">
          {(message || serverError) && (
            <span className={message ? 'text-green-500' : 'text-red-500'}>
              {message || serverError}
            </span>
          )}
        </div>

        <p className="text-center text-gray-100">
          Please enter the 6-digit OTP sent to <strong>{passedEmail}</strong>.
        </p>
        <div className="flex justify-center space-x-2">
          {otpDigits.map((digit, i) => (
            <OTPInput
              key={i}
              index={i}
              value={digit}
              onChange={(e) => handleOTPChange(i, e)}
              onPaste={(e) => handleOTPBoxPaste(i, e)}
              onKeyDown={handleKeyDown}
              ref={inputRefs.current[i]}
            />
          ))}
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* New Password Field with Visibility Toggle */}
              <div>
                <label htmlFor="newPassword" className="block text-gray-100 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    id="newPassword"
                    className={fieldClasses}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent p-0 m-0 cursor-pointer text-gray-800 hover:text-sky-500 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{ lineHeight: 0 }} // Ensures no extra space around the icon
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="w-5 h-5" />
                  </button>
                </div>
                <div className="min-h-[1.25rem] mt-1">
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              {/* Confirm Password Field with Visibility Toggle */}
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
                    onClick={() => setShowPassword((prev) => !prev)}
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
