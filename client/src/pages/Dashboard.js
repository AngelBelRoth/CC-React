import axios from 'axios'
import TinderCard from 'react-tinder-card'
import ChatContainer from '../components/ChatContainer'
import { useCookies } from 'react-cookie'
import { useEffect, useLayoutEffect, useState } from 'react'


const Dashboard = () => {

    const [user, setUser] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [businessType, setBusinessType] = useState(null)
    const [cookies] = useCookies(['user'])
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
            setBusinessType(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUser()

    }, [])

    useLayoutEffect(() => {

        if (user && user.business_type) {
            getBusinessType()
            console.log('🌕', user.business_type)
        }

    }, [])
    console.log('user', user)
    console.log('businessType', businessType)



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
    console.log(user)

    const swiped = (direction, swipedUserId) => {

        if (direction === 'right') {
            updateMatches(swipedUserId)
        }

        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    const matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId)

    const filteredBusinessType = businessType?.filter(businessType => !matchedUserIds.includes(businessType.user_id))


    console.log('filteredBusinessType ', filteredBusinessType)

    return (
        <>
            {user &&
                <div className="dashboard">
                    <ChatContainer user={user} />
                    <div className="swipe-container">
                        <div className="card-container"></div>

                        {filteredBusinessType?.map((businessType) =>
                            <TinderCard
                                className='swipe' key={businessType.user_id}
                                onSwipe={(dir) => swiped(dir, businessType.user_id)}
                                onCardLeftScreen={() => outOfFrame(businessType.company_name)}>
                                <div style={{ backgroundImage: 'url(' + businessType.url + ')' }}
                                    className='card'>
                                    <h3>{businessType.company_name}</h3>
                                </div>
                            </TinderCard>
                        )}
                        <div className='swipe-info'>
                            {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default Dashboard