import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiPhone, FiBookOpen, FiHash, FiAlertCircle, FiCheckCircle, FiInfo, FiBriefcase } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { generateOTP, storeOTP, verifyOTP, sendOTPEmail } from '../services/emailService';
import { validateRollNumber, validateStudentName, validateDepartmentMatch, checkDuplicateRoll, getValidDepartments, getDepartmentFromRoll } from '../services/studentValidation';
import '../styles/auth.css';

export default function Signup() {
  // ===== ACCOUNT TYPE: 'student' or 'staff' =====
  const [accountType, setAccountType] = useState(null); // null = selection screen

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    studentId: '',
    phone: '',
    designation: '', // staff only
    languagePreference: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false); // eslint-disable-line no-unused-vars
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [rollValidation, setRollValidation] = useState(null);
  const [nameValidation, setNameValidation] = useState(null);
  const [deptMatch, setDeptMatch] = useState(null);
  const { signup, signupWithGoogle, language } = useAuth();
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  useEffect(() => {
    if (language) {
      setFormData(prev => ({ ...prev, languagePreference: language }));
    }
  }, [language]);

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signupWithGoogle(formData.designation, formData.phone);
      toast.success('Registration successful! Welcome to SmartCampus! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Google Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  const departments = getValidDepartments();

  // Total steps: student = 3, staff = 2
  const totalSteps = accountType === 'student' ? 3 : 2;

  // OTP Timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  // Auto-set department from roll number (student only)
  useEffect(() => {
    if (accountType === 'student' && formData.studentId.length >= 8) {
      const dept = getDepartmentFromRoll(formData.studentId);
      if (dept) {
        setFormData(prev => ({ ...prev, department: dept }));
        setDeptMatch({ valid: true, message: `Auto-detected: ${dept}` });
      }
    }
  }, [formData.studentId, accountType]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));

    // Live validation for roll number (student only)
    if (field === 'studentId' && value.length > 0) {
      const result = validateRollNumber(value);
      setRollValidation(result);
      if (result.valid && formData.department) {
        setDeptMatch(validateDepartmentMatch(value, formData.department));
      }
    } else if (field === 'studentId') {
      setRollValidation(null);
    }

    // Live validation for name
    if (field === 'name' && value.length > 0) {
      setNameValidation(validateStudentName(value));
    } else if (field === 'name') {
      setNameValidation(null);
    }

    // Department match check (student only)
    if (field === 'department' && formData.studentId) {
      setDeptMatch(validateDepartmentMatch(formData.studentId, value));
    }
  };

  // ===== STEP 1 VALIDATION (Account Details — shared) =====
  const validateStep1 = () => {
    const errs = {};
    if (accountType === 'student') {
      const nameResult = validateStudentName(formData.name);
      if (!nameResult.valid) errs.name = nameResult.message;
    } else {
      if (!formData.name || formData.name.trim().length < 2) errs.name = 'Name is required (min 2 characters)';
    }
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) errs.password = 'Must include uppercase, lowercase, and number';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ===== STEP 2 VALIDATION (College Info — student only) =====
  const validateStep2Student = async () => {
    const errs = {};
    const rollResult = validateRollNumber(formData.studentId);
    if (!rollResult.valid) {
      errs.studentId = rollResult.message;
    } else {
      const dupCheck = await checkDuplicateRoll(formData.studentId);
      if (dupCheck.duplicate) errs.studentId = dupCheck.message;
    }
    if (!formData.department) errs.department = 'Department is required';
    else if (rollResult.valid) {
      const matchResult = validateDepartmentMatch(formData.studentId, formData.department);
      if (!matchResult.valid) errs.department = matchResult.message;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ===== NAVIGATION =====
  const handleNext1 = async () => {
    if (!validateStep1()) return;
    if (accountType === 'student') {
      setStep(2);
    } else {
      // Staff: skip college info, go straight to OTP
      await handleSendOTP();
      setStep(2); // step 2 for staff = OTP
    }
  };

  const handleNext2Student = async () => {
    if (!(await validateStep2Student())) return;
    await handleSendOTP();
    setStep(3);
  };

  // ===== OTP HANDLING =====
  const handleSendOTP = async () => {
    setOtpLoading(true);
    const code = generateOTP();
    storeOTP(formData.email, code);
    const result = await sendOTPEmail(formData.email, formData.name, code);
    if (result.success) {
      setOtpSent(true);
      setOtpTimer(120);
      toast.success('OTP sent to your email! Check your inbox.');
    } else {
      toast.error(`Failed to send OTP: ${result.error || 'Unknown error'}`);
    }
    setOtpLoading(false);
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    await handleSendOTP();
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // ===== FINAL SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    const otpResult = verifyOTP(formData.email, otpCode);
    if (!otpResult.valid) {
      toast.error(otpResult.message);
      return;
    }
    setLoading(true);
    try {
      const signupData = {
        ...formData,
        role: accountType === 'student' ? 'student' : 'staff',
        emailVerified: true
      };
      if (accountType === 'student') {
        signupData.studentId = formData.studentId.toUpperCase();
      } else {
        signupData.studentId = '';
        signupData.designation = formData.designation || '';
      }
      await signup(signupData);
      toast.success('Registration successful! Welcome to SmartCampus! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { width: '0%', color: '#454655', label: '' };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { width: '20%', color: '#ef4444', label: 'Weak' },
      { width: '40%', color: '#f59e0b', label: 'Fair' },
      { width: '60%', color: '#eab308', label: 'Good' },
      { width: '80%', color: '#22c55e', label: 'Strong' },
      { width: '100%', color: '#5E6BFF', label: 'Very Strong' }
    ];
    return levels[Math.min(score, 4)];
  };

  const strength = getPasswordStrength();

  const selectAccountType = (type) => {
    setAccountType(type);
    setStep(1);
    setErrors({});
    setFormData({
      name: '', email: '', password: '', confirmPassword: '',
      department: '', studentId: '', phone: '', designation: '',
      languagePreference: ''
    });
    setOtp(['', '', '', '', '', '']);
    setRollValidation(null);
    setNameValidation(null);
    setDeptMatch(null);
  };

  // ===== ACCOUNT TYPE SELECTION SCREEN =====
  if (accountType === null) {
    return (
      <div className="min-h-screen bg-[#070708] dot-pattern flex items-center justify-center p-4 md:p-8 text-[#e5e2e3]">
        <motion.div
          className="w-full max-w-4xl bg-[#101112]/90 backdrop-blur-xl border border-white/[0.05] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 inner-glow shadow-2xl relative shadow-black/80"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left Side - Info */}
          <div className="md:col-span-5 bg-[#0d0e0f]/50 border-r border-white/[0.05] p-8 md:p-10 flex flex-col justify-between relative">
            <div>
              <Link className="flex items-center gap-3 mb-8 hover:opacity-85 transition-opacity" to="/">
                <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10 shadow-[0_0_12px_rgba(94,107,255,0.2)]">
                  <FiShield className="text-[15px] text-primary" />
                </div>
                <span className="font-h3 text-[20px] font-bold tracking-tight text-on-surface">SmartCampus</span>
              </Link>
              
              <h2 className="font-h2 text-[26px] leading-[1.2] text-on-surface font-bold tracking-tight mb-4">
                Join SmartCampus.
              </h2>
              <p className="text-body-md text-custom-text-muted leading-relaxed mb-8">
                Create your account to start reporting infrastructure anomalies, tracking department responses, and viewing analytics.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[14px]">
                  <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                  <span>OTP email verification</span>
                </div>
                <div className="flex items-center gap-3 text-[14px]">
                  <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                  <span>AI issue auto-routing</span>
                </div>
                <div className="flex items-center gap-3 text-[14px]">
                  <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                  <span>Real-time status updates</span>
                </div>
                <div className="flex items-center gap-3 text-[14px]">
                  <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                  <span>Open to students & workers</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/[0.05] text-[12px] text-custom-text-muted">
              Security verified signup pipeline.
            </div>
          </div>

          {/* Right Side - Account Selection Cards */}
          <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-transparent">
            <div className="w-full">
              <h1 className="font-h3 text-[28px] font-bold text-on-surface mb-2">Choose account type</h1>
              <p className="text-body-md text-custom-text-muted mb-8">Select how you want to register in the campus system</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Student Card */}
                <button
                  onClick={() => selectAccountType('student')}
                  className="bg-[#16171a] border border-white/[0.05] hover:border-primary/50 hover:bg-[#1c1d21] rounded-2xl p-6 text-left transition-all duration-300 flex flex-col justify-between h-[280px] group hover:shadow-lg hover:shadow-primary/5 cursor-pointer inner-glow"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-[22px] mb-4">🎓</div>
                    <h3 className="text-[18px] font-bold text-white mb-2 group-hover:text-primary transition-colors">Student Account</h3>
                    <p className="text-[13px] text-custom-text-muted leading-relaxed">For currently enrolled students with a valid college Roll Number.</p>
                  </div>
                  <span className="text-[12px] font-bold text-primary flex items-center gap-1 mt-4">
                    Register as Student
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </button>

                {/* Staff Card */}
                <button
                  onClick={() => selectAccountType('staff')}
                  className="bg-[#16171a] border border-white/[0.05] hover:border-secondary/50 hover:bg-[#1c1d21] rounded-2xl p-6 text-left transition-all duration-300 flex flex-col justify-between h-[280px] group hover:shadow-lg hover:shadow-secondary/5 cursor-pointer inner-glow"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-[22px] mb-4">🏢</div>
                    <h3 className="text-[18px] font-bold text-white mb-2 group-hover:text-secondary transition-colors">Campus Staff</h3>
                    <p className="text-[13px] text-custom-text-muted leading-relaxed">For faculty members, technicians, and campus workers.</p>
                  </div>
                  <span className="text-[12px] font-bold text-secondary flex items-center gap-1 mt-4">
                    Register as Staff
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </button>
              </div>

              <p className="mt-10 text-center text-body-md text-custom-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-white hover:text-primary font-semibold underline decoration-white/20 hover:decoration-primary transition-all">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===== MAIN SIGNUP FORM STEP DISPLAY =====
  const stepLabel = accountType === 'student'
    ? (step === 1 ? 'Account Details' : step === 2 ? 'College Information' : 'Email Verification')
    : (step === 1 ? 'Account Details' : 'Email Verification');

  const isOtpStep = accountType === 'student' ? step === 3 : step === 2;

  return (
    <div className="min-h-screen bg-[#070708] dot-pattern flex items-center justify-center p-4 md:p-8 text-[#e5e2e3]">
      <motion.div
        className="w-full max-w-4xl bg-[#101112]/90 backdrop-blur-xl border border-white/[0.05] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 inner-glow shadow-2xl relative shadow-black/80"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side - Info */}
        <div className="md:col-span-5 bg-[#0d0e0f]/50 border-r border-white/[0.05] p-8 md:p-10 flex flex-col justify-between relative">
          <div>
            <Link className="flex items-center gap-3 mb-8 hover:opacity-85 transition-opacity" to="/">
              <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10 shadow-[0_0_12px_rgba(94,107,255,0.2)]">
                <FiShield className="text-[15px] text-primary" />
              </div>
              <span className="font-h3 text-[20px] font-bold tracking-tight text-on-surface">SmartCampus</span>
            </Link>

            <h2 className="font-h2 text-[26px] leading-[1.2] text-on-surface font-bold tracking-tight mb-4">
              {accountType === 'student' ? 'Student Enrollment' : 'Staff Enrollment'}
            </h2>
            <p className="text-body-md text-custom-text-muted leading-relaxed mb-6">
              Complete your account creation. Your identity is verified securely via email OTP validation.
            </p>

            {/* Steps Visual checklist */}
            <div className="space-y-4 my-8">
              <div className="flex items-center gap-3 text-[14px]">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 1 ? 'bg-primary text-[#000469]' : 'border border-white/20 text-white'}`}>1</span>
                <span className={step === 1 ? 'text-white font-medium' : 'text-custom-text-muted'}>Account Credentials</span>
              </div>
              {accountType === 'student' && (
                <div className="flex items-center gap-3 text-[14px]">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > 2 ? 'bg-primary text-[#000469]' : step === 2 ? 'border border-primary text-primary bg-primary/10' : 'border border-white/20 text-white'}`}>2</span>
                  <span className={step === 2 ? 'text-white font-medium' : 'text-custom-text-muted'}>College Registry Details</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-[14px]">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${isOtpStep ? 'border border-primary text-primary bg-primary/10' : 'border border-white/20 text-white'}`}>{accountType === 'student' ? '3' : '2'}</span>
                <span className={isOtpStep ? 'text-white font-medium' : 'text-custom-text-muted'}>OTP Verification</span>
              </div>
            </div>

            {/* Custom Notice panel */}
            <div className="bg-[#16171a] border border-white/[0.05] rounded-2xl p-5 inner-glow flex items-start gap-3 mt-6">
              <FiInfo className="text-secondary mt-0.5 flex-shrink-0" />
              <div className="text-[12px] text-custom-text-muted leading-relaxed">
                <strong>Privacy Protocol</strong>
                <p className="mt-1">All student IDs are verified against college admissions. Password storage is salted and hashed in our database.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between">
            <button 
              onClick={() => setAccountType(null)}
              className="text-[12px] font-semibold text-custom-text-muted hover:text-white transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Change Role
            </button>
            <span className="text-[11px] text-custom-text-muted/50 font-mono">REG_V1.2</span>
          </div>
        </div>

        {/* Right Side - Multi-step Form */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-transparent">
          <div className="w-full">
            
            {/* Steps Progress Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="font-h3 text-[26px] font-bold text-on-surface">
                  {accountType === 'student' ? 'Create Student Profile' : 'Create Staff Profile'}
                </h1>
                <p className="text-body-md text-custom-text-muted mt-1">{stepLabel}</p>
              </div>
              <span className="text-[13px] font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-lg">
                Step {step}/{totalSteps}
              </span>
            </div>

            {/* Custom styled slider bar */}
            <div className="h-1 bg-white/[0.04] rounded-full w-full mb-8 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <AnimatePresence mode="wait">
                
                {/* STEP 1: General Credentials */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-text-muted" />
                        <input
                          type="text"
                          placeholder={accountType === 'student' ? "As on college ID" : "e.g., Prof. Sarah"}
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          className={`w-full bg-[#16171a] border ${errors.name ? 'border-red-500/50' : 'border-white/[0.08]'} focus:border-primary text-white rounded-xl px-4 py-3 pl-11 outline-none transition-all text-body-md inner-glow`}
                        />
                        {nameValidation && nameValidation.valid && accountType === 'student' && (
                          <FiCheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />
                        )}
                      </div>
                      {errors.name && <p className="text-red-400 text-[12px] font-medium flex items-center gap-1.5"><FiAlertCircle size={12} />{errors.name}</p>}
                      {!errors.name && nameValidation && !nameValidation.valid && accountType === 'student' && (
                        <p className="text-yellow-400 text-[12.5px] leading-relaxed flex items-start gap-1.5"><FiInfo size={12} className="mt-0.5 flex-shrink-0" />{nameValidation.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-text-muted" />
                        <input
                          type="email"
                          placeholder="e.g., student@college.edu"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className={`w-full bg-[#16171a] border ${errors.email ? 'border-red-500/50' : 'border-white/[0.08]'} focus:border-primary text-white rounded-xl px-4 py-3 pl-11 outline-none transition-all text-body-md inner-glow`}
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-[12px] font-medium flex items-center gap-1.5"><FiAlertCircle size={12} />{errors.email}</p>}
                    </div>

                    {/* Staff details */}
                    {accountType === 'staff' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider">Designation</label>
                          <div className="relative">
                            <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-text-muted" />
                            <input
                              type="text"
                              placeholder="e.g., Professor, Security"
                              value={formData.designation}
                              onChange={(e) => updateField('designation', e.target.value)}
                              className="w-full bg-[#16171a] border border-white/[0.08] focus:border-primary text-white rounded-xl px-4 py-3 pl-11 outline-none transition-all text-body-md inner-glow"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider">Phone (Optional)</label>
                          <div className="relative">
                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-text-muted" />
                            <input
                              type="tel"
                              placeholder="10 digits"
                              value={formData.phone}
                              onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))}
                              maxLength={10}
                              className="w-full bg-[#16171a] border border-white/[0.08] focus:border-primary text-white rounded-xl px-4 py-3 pl-11 outline-none transition-all text-body-md inner-glow"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-text-muted" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create strong password"
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          className={`w-full bg-[#16171a] border ${errors.password ? 'border-red-500/50' : 'border-white/[0.08]'} focus:border-primary text-white rounded-xl px-4 py-3 pl-11 outline-none transition-all text-body-md inner-glow pr-12`}
                        />
                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-custom-text-muted hover:text-white transition-colors" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      
                      {/* Password strength meter */}
                      {formData.password && (
                        <div className="space-y-1.5 pt-1">
                          <div className="h-1 bg-white/[0.04] rounded-full w-full overflow-hidden flex gap-1">
                            <div className="h-full rounded-full transition-all duration-300" style={{ width: strength.width, backgroundColor: strength.color }}></div>
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: strength.color }}>Strength: {strength.label}</span>
                        </div>
                      )}
                      {errors.password && <p className="text-red-400 text-[12px] font-medium flex items-center gap-1.5"><FiAlertCircle size={12} />{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider">Confirm Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-text-muted" />
                        <input
                          type="password"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={(e) => updateField('confirmPassword', e.target.value)}
                          className={`w-full bg-[#16171a] border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/[0.08]'} focus:border-primary text-white rounded-xl px-4 py-3 pl-11 outline-none transition-all text-body-md inner-glow`}
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-red-400 text-[12px] font-medium flex items-center gap-1.5"><FiAlertCircle size={12} />{errors.confirmPassword}</p>}
                    </div>

                    {/* Continue Button */}
                    <button 
                      type="button" 
                      onClick={handleNext1}
                      className="w-full bg-white text-black py-3.5 rounded-xl font-body-lg font-bold shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex justify-center items-center gap-2 mt-8"
                    >
                      Continue
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>

                    {accountType === 'staff' && (
                      <>
                        {/* Divider */}
                        <div className="flex items-center my-4">
                          <div className="flex-grow border-t border-white/[0.08]"></div>
                          <span className="mx-4 text-[10px] text-custom-text-muted font-bold tracking-widest uppercase">OR</span>
                          <div className="flex-grow border-t border-white/[0.08]"></div>
                        </div>

                        {/* Google Signup Button */}
                        <button 
                          type="button" 
                          onClick={handleGoogleSignup}
                          className="w-full bg-[#16171a]/50 hover:bg-[#16171a] border border-white/[0.08] text-white py-3.5 rounded-xl font-body-lg font-medium shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-3 inner-glow"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.486 0-6.313-2.827-6.313-6.313S10.505 5.888 13.99 5.888c1.558 0 3.007.575 4.137 1.637l3.057-3.057C19.294 2.72 16.793 1.8 13.99 1.8 8.163 1.8 3.44 6.523 3.44 12.35S8.163 22.9 13.99 22.9c5.887 0 10.63-4.148 10.63-10.457 0-.585-.054-1.16-.16-1.714H12.24z"/>
                          </svg>
                          Sign Up with Google
                        </button>
                      </>
                    )}
                  </motion.div>
                )}

                {/* STEP 2: Student College details */}
                {step === 2 && accountType === 'student' && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Roll Number */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider">Roll Number</label>
                      <div className="relative">
                        <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-text-muted" />
                        <input
                          type="text"
                          placeholder="e.g., 23881A0501"
                          value={formData.studentId}
                          onChange={(e) => updateField('studentId', e.target.value.toUpperCase())}
                          maxLength={10}
                          style={{ textTransform: 'uppercase' }}
                          className={`w-full bg-[#16171a] border ${errors.studentId ? 'border-red-500/50' : 'border-white/[0.08]'} focus:border-primary text-white rounded-xl px-4 py-3 pl-11 outline-none transition-all text-body-md inner-glow`}
                        />
                        {rollValidation && rollValidation.valid && (
                          <FiCheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />
                        )}
                      </div>
                      {errors.studentId && <p className="text-red-400 text-[12px] font-medium flex items-center gap-1.5"><FiAlertCircle size={12} />{errors.studentId}</p>}
                      {!errors.studentId && rollValidation && !rollValidation.valid && formData.studentId.length >= 3 && (
                        <p className="text-yellow-400 text-[12.5px] leading-relaxed flex items-start gap-1.5"><FiInfo size={12} className="mt-0.5 flex-shrink-0" />{rollValidation.message}</p>
                      )}
                      {rollValidation && rollValidation.valid && (
                        <div className="bg-[#121315] border border-white/[0.03] rounded-xl p-3 text-[12px] text-primary flex items-start gap-2 inner-glow">
                          <FiCheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Registry Match Found</strong>
                            <p className="mt-0.5">{rollValidation.parsed.department} - {rollValidation.parsed.branch} (Batch {rollValidation.parsed.admissionYear})</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Department dropdown */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider">Department</label>
                      <div className="relative">
                        <FiBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-text-muted" />
                        <select
                          value={formData.department}
                          onChange={(e) => updateField('department', e.target.value)}
                          className={`w-full bg-[#16171a] border ${errors.department ? 'border-red-500/50' : 'border-white/[0.08]'} focus:border-primary text-white rounded-xl px-4 py-3 pl-11 outline-none transition-all text-body-md inner-glow appearance-none`}
                        >
                          <option value="">Select Department</option>
                          {departments.map(d => <option key={d} value={d} className="bg-[#101112]">{d}</option>)}
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-custom-text-muted pointer-events-none text-[20px]">expand_more</span>
                      </div>
                      {errors.department && <p className="text-red-400 text-[12px] font-medium flex items-center gap-1.5"><FiAlertCircle size={12} />{errors.department}</p>}
                      {deptMatch && deptMatch.valid && formData.department && (
                        <p className="text-green-400 text-[12px] font-semibold flex items-center gap-1.5"><FiCheckCircle size={12} />{deptMatch.message}</p>
                      )}
                    </div>

                    {/* Phone optional */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider">Phone Number <span className="text-[11px] text-custom-text-muted/60 normal-case">(Optional)</span></label>
                      <div className="relative">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-text-muted" />
                        <input
                          type="tel"
                          placeholder="e.g., 9876543210"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))}
                          maxLength={10}
                          className="w-full bg-[#16171a] border border-white/[0.08] focus:border-primary text-white rounded-xl px-4 py-3 pl-11 outline-none transition-all text-body-md inner-glow"
                        />
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="bg-transparent border border-white/[0.1] text-white py-3.5 rounded-xl text-body-md font-bold hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back
                      </button>
                      <button 
                        type="button" 
                        onClick={handleNext2Student}
                        className="col-span-2 bg-white text-black py-3.5 rounded-xl text-body-md font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                      >
                        Verify Email
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* OTP VERIFICATION STEP */}
                {isOtpStep && (
                  <motion.div
                    key="stepOtp"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 text-center"
                  >
                    <div className="flex flex-col items-center py-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-[26px] mb-4 text-primary animate-pulse">📧</div>
                      <h3 className="text-[20px] font-bold text-white mb-2">Check your email</h3>
                      <p className="text-[14px] text-custom-text-muted max-w-sm">We have dispatched a 6-digit OTP code to</p>
                      <p className="text-[14px] text-primary font-bold mt-1 font-mono">{formData.email}</p>
                    </div>

                    {/* OTP 6-grid inputs */}
                    <div className="flex justify-center gap-3 md:gap-4 max-w-sm mx-auto" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => { otpRefs.current[i] = el; }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ''))}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="w-12 h-14 md:w-14 md:h-16 bg-[#16171a] border border-white/[0.08] focus:border-primary text-white rounded-xl text-center font-mono-data text-[24px] font-bold outline-none transition-all inner-glow"
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>

                    {/* Timer */}
                    <div className="text-[13px] text-custom-text-muted">
                      {otpTimer > 0 ? (
                        <span className="flex items-center justify-center gap-1.5"><span className="material-symbols-outlined text-[16px] animate-spin-slow">schedule</span>Resend OTP in <strong>{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</strong></span>
                      ) : (
                        <button 
                          type="button" 
                          onClick={handleResendOTP} 
                          disabled={otpLoading}
                          className="text-primary hover:text-white underline font-bold tracking-wide transition-all disabled:opacity-50"
                        >
                          {otpLoading ? 'Sending...' : 'Resend OTP'}
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-4 pt-6">
                      <button 
                        type="button" 
                        onClick={() => setStep(accountType === 'student' ? 2 : 1)}
                        className="bg-transparent border border-white/[0.1] text-white py-3.5 rounded-xl text-body-md font-bold hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back
                      </button>
                      <button 
                        type="submit" 
                        disabled={loading || otp.join('').length !== 6}
                        className="col-span-2 bg-primary text-[#000469] py-3.5 rounded-xl text-body-md font-bold hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none shadow-lg shadow-primary/20"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-[#000469] border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <>
                            Verify & Register
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <p className="mt-8 text-center text-body-md text-custom-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-primary font-semibold underline decoration-white/20 hover:decoration-primary transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
