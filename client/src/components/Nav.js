import redLogo from '../images/heart-red.png'
import blackLogo from '../images/heart-black.png'

const Nav = ({ minimal, authToken, setShowModal, ShowModal, setIsSignUp }) => {

    const handleClick = () => {
        setShowModal(true)
        setIsSignUp(false)
    }

    // const authToken = true
    return (
        <nav>
            <div className="logo-container">
                <img className="logo" alt="" src={minimal ? blackLogo : redLogo}/>
            </div>

            {!authToken && !minimal && <button 
            className="nav-button" 
            onClick={handleClick}
            disabled={ShowModal}
            >Log in</button>}
        </nav>
    )
}

export default Nav 