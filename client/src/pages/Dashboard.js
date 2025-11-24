import axios from 'axios'
import SwipeCard from '../components/SwipeCard'
import ChatContainer from '../components/ChatContainer'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'

const Dashboard = () => {

    const [user, setUser] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [businessType, setBusinessType] = useState([])

    const [cookies] = useCookies(['UserId'])
    const userId = cookies.UserId

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8080/user', {
                params: { userId }
            })
            console.log(response.data)
            setUser(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getBusinessType = async () => {
        try {
            const response = await axios.get('http://localhost:8080/business-type', {
                params: { business: user?.business_interest }
            })
            console.log(response.data)
            setBusinessType(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    // Load user on mount
    useEffect(() => {
        getUser()
    }, [])

    // Load business type when user finished loading
    useEffect(() => {
        if (user && user.business_interest) {
            getBusinessType()
        }
    }, [user])

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8080/addmatch', {
                userId,
                matchedUserId
            })
            getUser()
        } catch (err) {
            console.log(err)
        }
    }

    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    const matchedUserIds = user?.matches
        ?.map(({ user_id }) => user_id)
        .concat(userId) || []

    const filteredBusinessType = businessType.filter(
        b => !matchedUserIds.includes(b.user_id)
    )

    return (
        <>
            {user &&
                <div className="dashboard">
                    <ChatContainer user={user} />
                    <div className="swipe-container">

                        {filteredBusinessType.length > 0 ? (
                            filteredBusinessType.map(b => (
                                <SwipeCard
                                    key={b.user_id}
                                    onSwipe={(dir) => swiped(dir, b.user_id)}
                                    onCardLeftScreen={() => outOfFrame(b.company_name)}
                                >
                                    <div
                                        style={{ backgroundImage: `url(${b.url})` }}
                                        className="card"
                                    >
                                        <h3>{b.company_name}</h3>
                                    </div>
                                </SwipeCard>
                            ))
                        ) : (
                            <p>No businesses to show</p>
                        )}

                        <div className='swipe-info'>
                            {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
                        </div>

                    </div>
                </div>
            }
        </>
    )
}

export default Dashboard
