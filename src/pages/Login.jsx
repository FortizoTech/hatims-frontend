import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

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
        error: '#dc2626'
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
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
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const res = await API.post("/auth/login", {
                email: formData.email,
                password: formData.password
            });

            login(res.data.user, res.data.token);
            if (res.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
            setErrors({
                form: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

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
                        Welcome Back
                    </h1>

                    <p style={{
                        fontSize: '16px',
                        color: colors.grayText,
                        margin: 0,
                        fontWeight: '300'
                    }}>
                        Please enter your details to sign in
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleLogin}
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
                    <div style={{ marginBottom: '28px' }}>
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
                    </div>

                    {/* Forgot Password Link */}
                    <div style={{
                        textAlign: 'right',
                        marginBottom: '32px'
                    }}>
                        <Link
                            to="/forgot-password"
                            style={{
                                color: colors.grayText,
                                fontSize: '14px',
                                textDecoration: 'none',
                                transition: 'color 0.3s ease',
                                borderBottom: `1px solid transparent`
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = colors.text;
                                e.target.style.borderBottom = `1px solid ${colors.text}`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = colors.grayText;
                                e.target.style.borderBottom = `1px solid transparent`;
                            }}
                        >
                            Forgot password?
                        </Link>
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
                                SIGNING IN...
                            </>
                        ) : (
                            'SIGN IN'
                        )}
                    </button>

                    {/* Sign Up Link */}
                    <p style={{
                        textAlign: 'center',
                        fontSize: '15px',
                        color: colors.grayText,
                        margin: 0
                    }}>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
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
                            Create account
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
                            SECURE LOGIN
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