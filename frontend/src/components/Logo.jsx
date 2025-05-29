import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ position = 'top-left' }) => {
    const getPositionStyles = () => {
        switch (position) {
            case 'bottom-right':
                return {
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                };
            default: // top-left
                return {
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                };
        }
    };

    return (
        <Link to="/" style={{
            ...getPositionStyles(),
            zIndex: 1000,
            textDecoration: 'none'
        }}>
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
            }}>
                <img
                    src="/logo.png"
                    alt="Logo"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
        </Link>
    );
};

export default Logo; 