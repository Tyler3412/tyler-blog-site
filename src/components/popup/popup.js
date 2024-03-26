import React, { useState } from 'react';
import './popup.css'; // Create and import CSS for styling

function PopupWindow({ title, isOpen, onClose, children, navigateBack, onSearchChange }) {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Closing the popup
    const handleClose = (e) => {
      e.stopPropagation(); // Prevent further propagation of the click event
      onClose(); // Call the onClose prop function
    };

    // Dragging the popup around the screen
    const startDrag = (e) => {
      // Only start drag if clicking on the titlebar but not on buttons or search bar
      if (e.target.className.includes('popup-titlebar') || e.target.className.includes('popup-title')) {
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
        setIsDragging(true);
      }
    };

    const onDrag = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };
  
    const endDrag = () => {
      setIsDragging(false);
    };

    if (!isOpen) {
      return null;
    }

    return (
      <div className="popup-overlay" onMouseMove={onDrag} onMouseUp={endDrag} onMouseLeave={endDrag}>
            <div className="popup-window" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
                <div className="popup-titlebar" onMouseDown={startDrag}>
                    <button className="back-button" onClick={navigateBack}>&lt;</button>
                    {/* Spacer to keep title centered */}
                    <div className="title-spacer"></div>
                    <div className="popup-title">{title}</div>
                    <div className="title-spacer">
                      <input
                        type="search"
                        placeholder="Search..."
                        className="search-bar"
                        onChange={(e) => onSearchChange(e.target.value)} // Assume onSearchChange is passed as prop
                      />
                    </div>
                    <div className="spacer"></div>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                <div className='popup-content'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default PopupWindow;