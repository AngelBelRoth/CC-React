import { useState } from "react";
import { useSwipeable } from "react-swipeable";

const SwipeCard = ({ children, onSwipe, onCardLeftScreen }) => {
  const [swipedOut, setSwipedOut] = useState(false);
  const [direction, setDirection] = useState("");

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    trackMouse: true // allows mouse dragging
  });

  const handleSwipe = (dir) => {
    setDirection(dir);
    setSwipedOut(true);
    onSwipe(dir);
    setTimeout(() => {
      onCardLeftScreen?.();
    }, 300);
  };

  return (
    <div
      {...handlers}
      className="swipe-card"
      style={{
        transition: "transform 0.3s ease-out",
        transform:
          swipedOut
            ? direction === "right"
              ? "translateX(200%) rotate(20deg)"
              : "translateX(-200%) rotate(-20deg)"
            : "none"
      }}
    >
      {children}
    </div>
  );
};

export default SwipeCard;
