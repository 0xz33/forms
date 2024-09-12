import React, { useState, useEffect } from 'react';

const TextureControlPanel = React.memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setIsOpen(!mobile); // Open by default on desktop, closed on mobile
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const commonStyle = {
        background: 'none',
        border: '.5px solid white',
        color: 'white',
        borderColor: '#ffffff77',
        cursor: 'pointer',
        padding: '8px 16px',
        fontSize: '12px',
        width: '100%',
        marginBottom: '8px',
    } as const;

    const buttonStyle = {
        background: isOpen ? 'white' : 'none',
        color: isOpen ? 'black' : 'white',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 16px',
        fontSize: '12px',
        width: '100%',
        borderRadius: '5px',
        position: 'fixed' as const,
        zIndex: 1001,
        ...(isMobile
            ? { bottom: '10px', left: '10px', width: 'auto' }
            : { top: '10px', left: '10px', width: '200px' }),
    };

    const panelStyle = {
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        width: isMobile ? '100%' : '200px',
        position: 'fixed' as const,
        zIndex: 1000,
        ...(isMobile
            ? { bottom: isOpen ? '0' : '-100%', left: '0', transition: 'bottom 0.3s' }
            : { top: '50px', left: '10px' }),
    };

    const textureButtons = ['bronze', 'silver', 'gold', 'onyx', 'diamond', 'mythic', 'ethereal'];

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} style={buttonStyle}>
                {isOpen ? '◀ Hide Texture' : '▶ Show Texture'}
            </button>
            {isOpen && (
                <div style={panelStyle}>
                    <div style={{ marginTop: '8px' }}>
                        <ControlItem label="Fragment:">
                            <select style={commonStyle}>
                                <option>Option 1</option>
                                <option>Option 2</option>
                                <option>Option 3</option>
                            </select>
                        </ControlItem>

                        <ControlItem label="Filter:">
                            <select style={commonStyle}>
                                <option>Filter 1</option>
                                <option>Filter 2</option>
                                <option>Filter 3</option>
                            </select>
                        </ControlItem>

                        <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>Texture</h4>
                        {textureButtons.map((texture) => (
                            <button key={texture} style={commonStyle}>
                                {texture}
                            </button>
                        ))}

                        {isMobile && (
                            <button onClick={() => setIsOpen(false)} style={{ ...buttonStyle, position: 'static', marginTop: '16px' }}>
                                ◀ Hide Texture
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
});

interface ControlItemProps {
    label: string;
    children: React.ReactNode;
}

const ControlItem = React.memo(({ label, children }: ControlItemProps) => (
    <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
        {children}
    </div>
));

export default TextureControlPanel;