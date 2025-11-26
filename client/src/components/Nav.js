import redLogo from '../images/heart-red.png'
import blackLogo from '../images/heart-black.png'
import { useNavigate } from 'react-router-dom';

const Nav = ({ minimal, authToken, setShowModal, ShowModal, setIsSignUp }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        setShowModal(true)
        setIsSignUp(false)
    }

    // const authToken = true
    return (
        <nav>
            <div className="logo-container">
                <img className="logo" alt="" src={minimal ? blackLogo : redLogo} />
            </div>

            {!authToken && !minimal &&
                <div><button
                    className="nav-button"
                    onClick={handleClick}
                    disabled={ShowModal}
                >Log in</button>
                    <button style={{ marginTop: "20px", marginRight: "35px" }} className='nav-button' onClick={() => navigate('/adminPage')}>Admin Page</button></div>}
        </nav>
    )
}

export default Nav 