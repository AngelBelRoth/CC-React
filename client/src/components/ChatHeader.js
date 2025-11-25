import { useCookies } from 'react-cookie'
import back_button from '../images/back_button.png'
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ user }) => {
    // const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [cookies, setCookie, removeCookie] = useCookies(['UserId', 'AuthToken'])
    const navigate = useNavigate()
    const logout = () => {
        removeCookie('UserId', { path: '/' })
        removeCookie('AuthToken', { path: '/' })
        navigate('/')
    }

    const goToOnBoarding = () => {
        navigate('/onboarding')
    }

    return (
        <div className="chat-container-header">
            <div className="profile" onClick={goToOnBoarding}>
                <div className="img-container">
                    <img src={user.url} alt={"photo of " + user.company_name} />
                </div>
                <h3>{user.company_name}</h3>
            </div>
            {/* <img className="log-out-icon" alt="" src={back_button} onClick={logout} /> */}
            <i className="log-out-icon" onClick={logout}>➜</i>
        </div>
    )
}

export default ChatHeader