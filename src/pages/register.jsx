import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Color palette matching the design system
    const colors = {
        background: '#FFFFFF',
        text: '#282829',
        accent: '#FAEAC6',
        accentDark: '#E5D5B5',
        grayLight: '#F5F5F5',
        grayMedium: '#E0E0E0',
        grayText: '#6B6B6B',
        error: '#dc2626',
        success: '#10b981'
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name) {
            newErrors.name = "Name is required";
        } else if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password must contain uppercase, lowercase and number";
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Terms validation
        if (!acceptedTerms) {
            newErrors.terms = "You must accept the terms and conditions";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setAcceptedTerms(checked);
            // Clear terms error when checked
            if (errors.terms) {
                setErrors(prev => ({
                    ...prev,
                    terms: null
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            // Clear error for this field when user starts typing
            if (errors[name]) {
                setErrors(prev => ({
                    ...prev,
                    [name]: null
                }));
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const res = await API.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            login(res.data.user, res.data.token);
            navigate("/");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";

            // Handle specific field errors from server
            if (err.response?.data?.field) {
                setErrors({
                    [err.response.data.field]: err.response.data.message
                });
            } else {
                setErrors({
                    form: errorMessage
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Password strength indicator
    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, text: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/(?=.*[a-z])/.test(password)) strength++;
        if (/(?=.*[A-Z])/.test(password)) strength++;
        if (/(?=.*\d)/.test(password)) strength++;

        const strengthMap = {
            1: { text: 'Weak', color: colors.error },
            2: { text: 'Fair', color: '#f59e0b' },
            3: { text: 'Good', color: '#3b82f6' },
            4: { text: 'Strong', color: colors.success }
        };

        return {
            strength,
            ...strengthMap[strength] || { text: '', color: colors.grayMedium }
        };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div style={{
            backgroundColor: colors.background,
            color: colors.text,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            minHeight: 'calc(100vh - 200px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
        }}>
            <div style={{
                maxWidth: '440px',
                width: '100%'
            }}>
                {/* Decorative element */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        width: '60px',
                        height: '1px',
                        backgroundColor: colors.grayMedium,
                        margin: '0 auto 30px auto'
                    }} />

                    <h1 style={{
                        fontSize: 'clamp(28px, 5vw, 32px)',
                        fontWeight: '400',
                        fontFamily: '"Times New Roman", serif',
                        margin: '0 0 12px 0',
                        color: colors.text,
                        letterSpacing: '1px'
                    }}>
                        Create Account
                    </h1>

                    <p style={{
                        fontSize: '16px',
                        color: colors.grayText,
                        margin: 0,
                        fontWeight: '300'
                    }}>
                        Join us to start your journey
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleRegister}
                    style={{
                        backgroundColor: colors.background,
                        width: '100%'
                    }}
                >
                    {/* Form Error Message */}
                    {errors.form && (
                        <div style={{
                            backgroundColor: '#fee',
                            color: colors.error,
                            padding: '12px 16px',
                            marginBottom: '24px',
                            fontSize: '14px',
                            borderLeft: `3px solid ${colors.error}`,
                            textAlign: 'left'
                        }}>
                            {errors.form}
                        </div>
                    )}

                    {/* Name Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label
                            htmlFor="name"
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: colors.text,
                                letterSpacing: '0.5px'
                            }}
                        >
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: `1px solid ${errors.name ? colors.error : colors.grayMedium}`,
                                backgroundColor: colors.background,
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                if (!errors.name) {
                                    e.target.style.borderColor = colors.text;
                                }
                            }}
                            onBlur={(e) => {
                                if (!errors.name) {
                                    e.target.style.borderColor = colors.grayMedium;
                                }
                            }}
                        />
                        {errors.name && (
                            <p style={{
                                color: colors.error,
                                fontSize: '13px',
                                margin: '6px 0 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <span style={{ fontSize: '16px' }}>⚠️</span>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label
                            htmlFor="email"
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: colors.text,
                                letterSpacing: '0.5px'
                            }}
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: `1px solid ${errors.email ? colors.error : colors.grayMedium}`,
                                backgroundColor: colors.background,
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                if (!errors.email) {
                                    e.target.style.borderColor = colors.text;
                                }
                            }}
                            onBlur={(e) => {
                                if (!errors.email) {
                                    e.target.style.borderColor = colors.grayMedium;
                                }
                            }}
                        />
                        {errors.email && (
                            <p style={{
                                color: colors.error,
                                fontSize: '13px',
                                margin: '6px 0 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <span style={{ fontSize: '16px' }}>⚠️</span>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label
                            htmlFor="password"
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: colors.text,
                                letterSpacing: '0.5px'
                            }}
                        >
                            Password
                        </label>
                        <div style={{
                            position: 'relative',
                            width: '100%'
                        }}>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    paddingRight: '50px',
                                    border: `1px solid ${errors.password ? colors.error : colors.grayMedium}`,
                                    backgroundColor: colors.background,
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    if (!errors.password) {
                                        e.target.style.borderColor = colors.text;
                                    }
                                }}
                                onBlur={(e) => {
                                    if (!errors.password) {
                                        e.target.style.borderColor = colors.grayMedium;
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    color: colors.grayText,
                                    fontSize: '14px'
                                }}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && passwordStrength.strength > 0 && (
                            <div style={{ marginTop: '8px' }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '4px',
                                    marginBottom: '4px'
                                }}>
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            style={{
                                                height: '4px',
                                                flex: 1,
                                                backgroundColor: level <= passwordStrength.strength
                                                    ? passwordStrength.color
                                                    : colors.grayLight,
                                                borderRadius: '2px',
                                                transition: 'background-color 0.3s ease'
                                            }}
                                        />
                                    ))}
                                </div>
                                <p style={{
                                    fontSize: '12px',
                                    color: passwordStrength.color,
                                    margin: '4px 0 0 0'
                                }}>
                                    Password strength: {passwordStrength.text}
                                </p>
                            </div>
                        )}

                        {errors.password && (
                            <p style={{
                                color: colors.error,
                                fontSize: '13px',
                                margin: '6px 0 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <span style={{ fontSize: '16px' }}>⚠️</span>
                                {errors.password}
                            </p>
                        )}

                        <p style={{
                            fontSize: '12px',
                            color: colors.grayText,
                            margin: '8px 0 0 0'
                        }}>
                            Must be at least 8 characters with uppercase, lowercase and number
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div style={{ marginBottom: '28px' }}>
                        <label
                            htmlFor="confirmPassword"
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: colors.text,
                                letterSpacing: '0.5px'
                            }}
                        >
                            Confirm Password
                        </label>
                        <div style={{
                            position: 'relative',
                            width: '100%'
                        }}>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    paddingRight: '50px',
                                    border: `1px solid ${errors.confirmPassword ? colors.error : colors.grayMedium}`,
                                    backgroundColor: colors.background,
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    if (!errors.confirmPassword) {
                                        e.target.style.borderColor = colors.text;
                                    }
                                }}
                                onBlur={(e) => {
                                    if (!errors.confirmPassword) {
                                        e.target.style.borderColor = colors.grayMedium;
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    color: colors.grayText,
                                    fontSize: '14px'
                                }}
                            >
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p style={{
                                color: colors.error,
                                fontSize: '13px',
                                margin: '6px 0 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <span style={{ fontSize: '16px' }}>⚠️</span>
                                {errors.confirmPassword}
                            </p>
                        )}
                        {formData.confirmPassword &&
                            formData.password &&
                            formData.confirmPassword === formData.password &&
                            !errors.confirmPassword && (
                                <p style={{
                                    color: colors.success,
                                    fontSize: '13px',
                                    margin: '6px 0 0 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <span style={{ fontSize: '16px' }}>✓</span>
                                    Passwords match
                                </p>
                            )}
                    </div>

                    {/* Terms and Conditions */}
                    <div style={{
                        marginBottom: '32px'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={handleChange}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    marginTop: '2px',
                                    cursor: 'pointer',
                                    accentColor: colors.text
                                }}
                            />
                            <span style={{
                                fontSize: '14px',
                                color: colors.grayText,
                                lineHeight: '1.5'
                            }}>
                                I agree to the{' '}
                                <Link
                                    to="/terms"
                                    style={{
                                        color: colors.text,
                                        textDecoration: 'none',
                                        borderBottom: `1px solid ${colors.text}`,
                                        paddingBottom: '1px'
                                    }}
                                >
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link
                                    to="/privacy"
                                    style={{
                                        color: colors.text,
                                        textDecoration: 'none',
                                        borderBottom: `1px solid ${colors.text}`,
                                        paddingBottom: '1px'
                                    }}
                                >
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>
                        {errors.terms && (
                            <p style={{
                                color: colors.error,
                                fontSize: '13px',
                                margin: '8px 0 0 28px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <span style={{ fontSize: '16px' }}>⚠️</span>
                                {errors.terms}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            backgroundColor: loading ? colors.grayLight : colors.text,
                            color: loading ? colors.grayText : colors.background,
                            border: `1px solid ${colors.text}`,
                            padding: '16px 24px',
                            fontSize: '16px',
                            fontWeight: '500',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            cursor: loading ? 'default' : 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginBottom: '24px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = colors.background;
                                e.target.style.color = colors.text;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = colors.text;
                                e.target.style.color = colors.background;
                            }
                        }}
                    >
                        {loading ? (
                            <>
                                <span style={{
                                    display: 'inline-block',
                                    width: '16px',
                                    height: '16px',
                                    border: `2px solid ${colors.grayMedium}`,
                                    borderTopColor: colors.text,
                                    borderRadius: '50%',
                                    animation: 'spin 0.6s linear infinite'
                                }} />
                                CREATING ACCOUNT...
                            </>
                        ) : (
                            'CREATE ACCOUNT'
                        )}
                    </button>

                    {/* Sign In Link */}
                    <p style={{
                        textAlign: 'center',
                        fontSize: '15px',
                        color: colors.grayText,
                        margin: 0
                    }}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            style={{
                                color: colors.text,
                                textDecoration: 'none',
                                fontWeight: '500',
                                borderBottom: `1px solid ${colors.text}`,
                                paddingBottom: '2px',
                                transition: 'opacity 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                            Sign in
                        </Link>
                    </p>
                </form>

                {/* Decorative Footer */}
                <div style={{
                    marginTop: '48px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        marginBottom: '24px'
                    }}>
                        <span style={{
                            width: '30px',
                            height: '1px',
                            backgroundColor: colors.grayMedium
                        }} />
                        <span style={{
                            color: colors.grayText,
                            fontSize: '13px',
                            letterSpacing: '1px'
                        }}>
                            SECURE REGISTRATION
                        </span>
                        <span style={{
                            width: '30px',
                            height: '1px',
                            backgroundColor: colors.grayMedium
                        }} />
                    </div>

                    {/* Trust Badges */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '24px',
                        color: colors.grayText,
                        fontSize: '12px'
                    }}>
                        <span>🔒 256-bit SSL</span>
                        <span>✓ Secure Checkout</span>
                        <span>🛡️ Privacy Protected</span>
                    </div>
                </div>
            </div>

            {/* Global Styles */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                input::placeholder {
                    color: ${colors.grayMedium};
                    font-weight: 300;
                }
                
                input:focus {
                    border-color: ${colors.text} !important;
                }
                
                @media (max-width: 480px) {
                    div[style*="padding: 40px 20px"] {
                        padding: 20px 16px !important;
                    }
                }
            `}</style>
        </div>
    );
}