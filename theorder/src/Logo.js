import React from 'react';

const Logo = ({ size = 40, type = 'icon' }) => {
  const Icon = () => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="#FF6B6B"/>
      <path d="M12 36C12 33.7909 13.7909 32 16 32H48C50.2091 32 52 33.7909 52 36V46C52 48.2091 50.2091 50 48 50H16C13.7909 50 12 48.2091 12 46V36Z" fill="#FFF5F5"/>
      <path d="M12 42H52V46C52 48.2091 50.2091 50 48 50H16C13.7909 50 12 48.2091 12 46V42Z" fill="#FFE3E3"/>
      <path d="M12 36C12 33.7909 13.7909 32 16 32H48C50.2091 32 52 33.7909 52 36V38C52 38 49 41 46 38C43 35 41 38 41 38C41 38 38 41 35 38C32 35 29 38 29 38C29 38 26 41 23 38C20 35 17 38 17 38C17 38 12 38 12 36Z" fill="#FFFFFF"/>
      <path d="M32 20C34.7614 20 37 22.2386 37 25V32H27V25C27 22.2386 29.2386 20 32 20Z" fill="#FF4757"/>
      <path d="M32 20L34 17M32 20L30 17M32 20V16" stroke="#2ED573" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="32" cy="54" rx="18" ry="2" fill="#000" fillOpacity="0.1"/>
    </svg>
  );

  if (type === 'full') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Icon />
        <span style={{ 
            fontFamily: "sans-serif", 
            fontWeight: 'bold', 
            fontSize: `${size * 0.6}px`,
            color: '#333',
            letterSpacing: '-1px'
        }}>
          The Order
        </span>
      </div>
    );
  }
  return <Icon />;
};

export default Logo;