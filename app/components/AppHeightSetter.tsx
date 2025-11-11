import { useEffect } from "react";

export default function AppHeightSetter(): null {
  useEffect(() => {
    const setAppHeight = () => {
      try {
        document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
      } catch (e) {
        // noop
      }
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    return () => window.removeEventListener("resize", setAppHeight);
  }, []);

  return null;
}
