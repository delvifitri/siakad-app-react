import { useEffect, useState } from "react";

export default function AppHeightSetter(): null {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const setAppHeight = () => {
      try {
        // Set the CSS variable
        document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);

        // Also update all elements that use this variable
        const elements = document.querySelectorAll('[style*="min-height"]');
        elements.forEach((el) => {
          const element = el as HTMLElement;
          const style = element.style;
          if (style.minHeight === '100vh') {
            style.minHeight = `${window.innerHeight}px`;
          }
        });
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
