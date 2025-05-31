import * as React from "react";
import { useScrollState, useScrollValue } from "scrollex";
import { useAnimationFrame, useMotionValue, useTransform } from "framer-motion";

// Derive current scroll status from velocity
const useScrollStatus = () => {
  const status = useScrollState(({ velocity }) => {
    if (velocity > 0) {
      return "down";
    } else if (velocity < 0) {
      return "up";
    } else {
      return "static";
    }
  });
  return status || "static";
};

// This will never return to static, it will remember the last scroll direction
const useLastScrollDirection = () => {
  const [lastDirection, setLastDirection] = React.useState("down");
  const scrollStatus = useScrollStatus();
  React.useEffect(() => {
    if (scrollStatus === "up" || scrollStatus === "down") {
      setLastDirection(scrollStatus);
    }
  }, [scrollStatus]);
  return lastDirection;
};

// Get scroll position as MotionValue
const useScrollPosition = () => {
  return useScrollValue(({ position }) => position);
};

export const useClock = ({
  defaultValue = 0,
  reverse = false,
  speed = 1
} = {}) => {
  const clock = useMotionValue(defaultValue);
  const paused = React.useRef(false);
  useAnimationFrame((t, dt) => {
    if (paused.current) {
      return;
    }
    if (reverse) {
      clock.set(clock.get() - dt * speed);
    } else {
      clock.set(clock.get() + dt * speed);
    }
  });
  return {
    value: clock,
    stop: () => {
      paused.current = true;
    },
    start: () => {
      paused.current = false;
    }
  };
};
