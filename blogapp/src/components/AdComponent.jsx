import { useEffect, useRef } from 'react';

const AdBanner = () => {
  const adRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (window.adsbygoogle && adRef.current && !initialized.current) {
      try {
        window.adsbygoogle.push({});
        initialized.current = true;
      } catch (err) {
        console.error("AdsbyGoogle error:", err);
      }
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-2197482294942971"
      data-ad-slot="7284477469"
      data-ad-format="auto"
      data-full-width-responsive="true"
      ref={adRef}
    />
  );
};

export default AdBanner;