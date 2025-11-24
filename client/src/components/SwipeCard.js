import { useSwipeable } from "react-swipeable";
import { useState } from "react";

const SwipeableCard = ({ data, onSwipe, index }) => {
    const [pos, setPos] = useState({ x: 0, y: 0, rot: 0, released: false });

    const handlers = useSwipeable({
        onSwiping: ({ deltaX, deltaY }) => {
            setPos({
                x: deltaX,
                y: deltaY,
                rot: deltaX / 10,
                released: false
            });
        },
        onSwiped: ({ deltaX }) => {
            const threshold = 140;

            if (deltaX > threshold) {
                // Right swipe
                setPos({
                    x: 500,
                    y: 0,
                    rot: 20,
                    released: true
                });
                setTimeout(() => onSwipe("right", data.user_id), 200);
            } else if (deltaX < -threshold) {
                // Left swipe
                setPos({
                    x: -500,
                    y: 0,
                    rot: -20,
                    released: true
                });
                setTimeout(() => onSwipe("left", data.user_id), 200);
            } else {
                // Snap back
                setPos({ x: 0, y: 0, rot: 0, released: false });
            }
        },
        trackMouse: true
    });

    const style = {
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rot}deg)`,
        transition: pos.released ? "all 0.3s ease-out" : "none",
        zIndex: 100 - index,
        position: "absolute"
    };

    return (
        <div {...handlers} style={style} className="swipe-card">
            <div
                className="card"
                style={{ backgroundImage: `url(${data.url})` }}
            >
                <h3>{data.company_name}</h3>
            </div>
        </div>
    );
};

export default SwipeableCard;
