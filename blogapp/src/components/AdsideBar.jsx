import { useEffect, useRef } from "react";

const AdSideBar = () => {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;

    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      atOptions = {
        'key' : '66f5a27be8ea2a7df844410785ad9444',
        'format' : 'iframe',
        'height' : 600,
        'width' : 160,
        'params' : {}
      };
    `;

    const script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src = "//www.highperformanceformat.com/66f5a27be8ea2a7df844410785ad9444/invoke.js";

    adRef.current.appendChild(script1);
    adRef.current.appendChild(script2);
  }, []);

  return <div ref={adRef} className="ad-box"></div>;
};

export default AdSideBar;
