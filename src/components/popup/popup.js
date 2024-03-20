import React, { useState } from 'react';
import './popup.css'; // Create and import CSS for styling

function PopupWindow({ isOpen, onClose, children }) {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
    const startDrag = (e) => {
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      setIsDragging(true);
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
        <div
          className="popup-window"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          onMouseDown={startDrag}
        >
          <div className="popup-titlebar">
            {/* Title text or empty if you just want the close button */}
            <div className="popup-title">My Popup Title</div>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div>
            {/* Your popup content here */}
            {children}
          </div>
        </div>
      </div>
    );
  }

export default PopupWindow;
