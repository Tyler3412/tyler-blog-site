import React from 'react';
import './icon-button.css';
import fileIcon from '../icons/file.png';
import folderIcon from '../icons/folder.png'

function FileIconWithLabel({ onClick, label, size = 64, isFile }) {
  const buttonStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const iconSrc = isFile ? fileIcon : folderIcon;

  return (
    <div className="icon-container">
      <button className="icon-button" onClick={onClick} style={buttonStyle}>
        <img src={iconSrc} alt="Icon" className="icon-image" />
      </button>
      <div className="icon-label">{label}</div>
    </div>
  );
}

export default FileIconWithLabel;
