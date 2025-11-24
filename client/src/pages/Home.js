import Nav from '../components/Nav'
import AuthModal from '../components/AuthModal'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)
    const [cookies, setCookie, removeCookie] = useCookies(['UserId', 'AuthToken'])


    const authToken = cookies.AuthToken

    const navigate = useNavigate()

    const handleClick = () => {
        if (authToken) {
            removeCookie('UserId', { path: '/' })
            removeCookie('AuthToken', { path: '/' })
            navigate('/')
            return
        }

        setShowModal(true)
        setIsSignUp(true)
    }

    // useEffect(() => {
    //     if (authToken) {
    //         removeCookie('UserId', { path: '/' })
    //         removeCookie('AuthToken', { path: '/' })
    //         navigate('/')
    //         return
    //     }
    // }, [])

    return (
        <div className="overlay">
            <Nav minimal={false}
                authToken={authToken}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp} />
            <div className="home">
                <h1 className="primary-title">Community Connect ®</h1>
                <button className="primary-button" onClick={handleClick}>
                    {authToken ? 'Signout' : 'Create Account'}
                </button>

                {showModal && (<AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />)}
            </div>
        </div>
    )
}

export default Home