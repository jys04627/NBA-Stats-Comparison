import React, { useState, useEffect, useRef } from 'react';

const DraggableImage = ({ src, alt, className, onError }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;

            setPosition({ x: dx, y: dy });
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setPosition({ x: 0, y: 0 }); // Snap back
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    const handleMouseDown = (e) => {
        e.preventDefault(); // Prevent default image drag behavior
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    return (
        <img
            ref={imageRef}
            src={src}
            alt={alt}
            className={className}
            onError={onError}
            onMouseDown={handleMouseDown}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Spring-like snap back
                userSelect: 'none',
                touchAction: 'none'
            }}
        />
    );
};

export default DraggableImage;
