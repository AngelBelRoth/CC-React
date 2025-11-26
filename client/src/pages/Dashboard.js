import axios from 'axios'
import ChatContainer from '../components/ChatContainer'
import SwipeableCard from '../components/SwipeCard'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import "../Dashboard.css"

const Dashboard = () => {

    const [user, setUser] = useState(null)
    const [chatUser, setChatUser] = useState(null)
    const [businessType, setBusinessType] = useState([])
    const [cards, setCards] = useState([])

    const [cookies] = useCookies(['UserId'])
    const userId = cookies.UserId

    const getUser = async () => {
        try {
            const res = await axios.get("http://localhost:8080/user", {
                params: { userId }
            });
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getChatUser = async () => {
        try {
            const res = await axios.get("http://localhost:8080/user", {
                params: { userId }
            });
            setChatUser(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getBusinessType = async () => {
        try {
            const res = await axios.get("http://localhost:8080/business-type", {
                params: { business: user?.business_interest }
            });
            setBusinessType(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUser();
        getChatUser();
    }, []);

    useEffect(() => {
        if (user?.business_interest) {
            getBusinessType();
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const matched = user.matches?.map(m => m.user_id) || [];
        const filtered = businessType.filter(b => !matched.includes(b.user_id) && b.user_id !== userId);

        setCards(filtered);
    }, [businessType, user]);

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put("http://localhost:8080/addmatch", {
                userId,
                matchedUserId
            });
            getChatUser();
        } catch (err) {
            console.log(err);
        }
    };

    const handleSwipe = (dir, swipedUserId) => {
        setCards(prev => {
            if (dir === "right") {
                updateMatches(swipedUserId);
                return prev.filter(c => c.user_id !== swipedUserId);
            }

            if (dir === "left") {
                const card = prev.find(c => c.user_id === swipedUserId);
                const rest = prev.filter(c => c.user_id !== swipedUserId);
                return [...rest, card];
            }

            return prev;
        });
    };
    return (
        chatUser && (
            <div className="dashboard">
                <ChatContainer user={chatUser} />

                <div className="swipe-container">
                    <div className="card-stack">
                        {cards.map((b, index) => (
                            <SwipeableCard
                                key={b.user_id}
                                data={b}
                                index={index}
                                onSwipe={handleSwipe}
                            />
                        ))}
                    </div>

                    {cards.length === 0 && <p>No more cards</p>}
                </div>
            </div>
        )
    );
};

export default Dashboard;
