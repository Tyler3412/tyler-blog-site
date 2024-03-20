import React, { useState } from 'react';

import './App.css'

import './components/background/background.css';

import './components/buttons/icon-container.css'
import FileIconWithLabel from './components/buttons/icon-button';

import PopupWindow from './components/popup/popup';

// Contents of each popup
import ReactMarkdown from 'react-markdown';
import about from './components/about/about.md'
import Technical from './components/technical_blog/technical';
import CTF from './components/ctf/ctf';
import Blog from './components/blog/blog';

function App() {
  const [popupContent, setPopupContent] = useState({isOpen: false, content: null});

  // Function to fetch markdown content asynchronously
  const fetchMarkdown = async (markdownPath) => {
    const response = await fetch(markdownPath);
    const text = await response.text();
    setPopupContent({isOpen: true, content: <ReactMarkdown>{text}</ReactMarkdown>});
  };

  // Handling different buttons
  const handleAboutClick = () => fetchMarkdown(about);
  const handleTechnicalBlogClick = () => setPopupContent({isOpen: true, content: <Technical />});
  const handleBlogClick = () => setPopupContent({isOpen: true, content: <Blog />});
  const handleCTFWriteupsClick = () => setPopupContent({isOpen: true, content: <CTF />});

  const togglePopup = () => setPopupContent(prev => ({...prev, isOpen: !prev.isOpen}));

  return (
    <div className='app-container'>
      <div className="wallpaper"/>
      <div className='desktop-container'>
        <FileIconWithLabel onClick={handleAboutClick} label="About" isFile={1}/>
        <FileIconWithLabel onClick={handleTechnicalBlogClick} label="Technical Blog" isFile={0}/>
        <FileIconWithLabel onClick={handleBlogClick} label="Blog" isFile={0}/>
        <FileIconWithLabel onClick={handleCTFWriteupsClick} label="CTF Writeups" isFile={0}/>
        <PopupWindow isOpen={popupContent.isOpen} onClose={togglePopup}>
          {popupContent.content}
        </PopupWindow>
      </div>
    </div>
  );
}

export default App;