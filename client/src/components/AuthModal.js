import axios from 'axios'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

const AuthModal = ({ setShowModal, isSignUp }) => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [isForgotPassword, setIsForgotPassword] = useState(false)

    let navigate = useNavigate()

    console.log(email, password, confirmPassword)


    const handleClick = () => {
        setShowModal(false);
        setIsForgotPassword(false);
    }

    useEffect(() => {
        setIsForgotPassword(false);
    }, [isSignUp]);

    const onClickForgotPassword = () => {
        // Implement forgot password functionality here
        setIsForgotPassword(true)
        console.log("Forgot Password clicked");
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (isForgotPassword) {
                console.log("forgot-password");
                await axios.post("http://localhost:8080/forgot-password", { email });
                setError("Password reset link has been sent to your email.");
                return;
            }

            if (isSignUp && (password !== confirmPassword)) {
                setError('Passwords need to match!')
                return
            }

            const response = await axios.post(`http://localhost:8080/${isSignUp ? 'signup' : 'login'}`, { email, password })

            setCookie('AuthToken', response.data.token)
            setCookie('UserId', response.data.userId)

            const success = response.status === 201
            if (success && isSignUp) navigate('/onboarding')

            if (success && !isSignUp) navigate('/dashboard')

            if (response.status === 200) {
                console.log("User not approved yet.");
                window.alert("User not approved yet.")
                return;
            }

            window.location.reload()

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>
            {!isForgotPassword && <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>}
            {isForgotPassword && <h2>Forgot your password?</h2>}
            {!isForgotPassword && <p>By clicking Log In, you agree to our Terms. Learn how we process your data in our Privacy Policy, and Cookie Policy.</p>}
            {isForgotPassword && <p>Enter your email address and we’ll send you a link to reset it.</p>}
            {!isForgotPassword &&
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email"
                        required={true}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="password"
                        required={true}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {isSignUp && <input
                        type="password"
                        id="password-check"
                        name="password-check"
                        placeholder="confirm password"
                        required={true}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />}
                    <input className="secondary-button" type="submit" />
                    {!isSignUp &&
                        <div className="forgot-password" style={{ paddingTop: "10px", cursor: "pointer" }} onClick={onClickForgotPassword} >
                            <u>Forgot Password</u>
                        </div>}
                    <p>{error}</p>
                </form>
            }
            {
                isForgotPassword &&
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email"
                        required={true}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input className="secondary-button" type="submit" />
                </form>
            }
            <hr />
            <h2>GET THE APP</h2>

        </div>
    )
}

export default AuthModal