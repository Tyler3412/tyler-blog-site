import React, { useState } from 'react';
import './App.css';
import './components/background/background.css';
import './components/buttons/icon-container.css';
import FileIconWithLabel from './components/buttons/icon-button';
import PopupWindow from './components/popup/popup';
import TextFile from './components/textfile';
import blogStructure from './blogStructure.json';
import about from './components/about/about.md'
import './components/directory_grid/directory_grid.css';

function App() {
  const [popupContent, setPopupContent] = useState({
    title: "Blog",
    isOpen: false,
    content: null,
    isFolderMode: false,
    currentPath: "/",
  });
  const [currentPath, setCurrentPath] = useState("/");

  const handleClose = () => {
    setPopupContent(prev => ({...prev, isOpen: false}));
  };

  const openItem = (item) => {
    if (item.type === 'file') {
      // Assume filePath is a path to the markdown file to be displayed
      setPopupContent({
        ...popupContent,
        isOpen: true,
        content: <TextFile filePath={item.path} />,
        isFolderMode: false,
      });
    } else if (item.type === 'folder') {
      // Update the popup to show the contents of the folder in a grid layout
      setPopupContent(prevState => ({
        ...prevState,
        isOpen: true,
        isFolderMode: true,
        currentPath: item.path,
        content: (
          <div className="directory-grid">
            {item.children.map(child => (
              <FileIconWithLabel
                key={child.name}
                label={child.name}
                onClick={() => openItem(child)}
                isFile={child.type === 'file'}
              />
            ))}
          </div>
        ),
      }));
    }
  };

  const updatePopupContent = (newPath) => {
    if (newPath === "/") {
      // Handle the root path specifically
      // Example: Resetting to the initial state or listing all top-level folders
      setPopupContent(current => ({
        ...current,
        content: (
          <div className='directory-grid'>
            {blogStructure.map(item => (
              <FileIconWithLabel
                key={item.name}
                label={item.name}
                onClick={() => openItem(item)}
                isFile={item.type === 'file'}
              />
            ))}
          </div>
        ),
        isFolderMode: true,
        currentPath: newPath,
      }));
      return;
    }

    const findItemByPath = (items, path) => {
      for (let item of items) {
        if (item.path === path) return item;
        if (item.children) {
          const found = findItemByPath(item.children, path);
          if (found) return found;
        }
      }
      return null; // Item not found
    };
  
    // Adjust the initial path for the root directory
    const adjustedPath = newPath === '/' ? '/' : newPath;
    const item = findItemByPath(blogStructure, adjustedPath);
  
    if (item && item.type === 'folder') {
      // Set state for folder
      setPopupContent(prev => ({
        ...prev,
        isOpen: true,
        isFolderMode: true,
        currentPath: newPath,
        title: item.name,
        content: (
          <div className='directory-grid'>
            {item.children.map(child => (
              <FileIconWithLabel
                key={child.name}
                label={child.name}
                onClick={() => openItem(child)}
                isFile={child.type === 'file' ? 1 : 0}
              />
            ))}
          </div>
        ),
      }));
    } else {
      // Handle path not found or go to default view
      console.log("Path not found or default view:", newPath);
      // Potentially close the popup or set a default state
    }
  };

    const goBack = () => {
      const segments = currentPath.split('/').filter(Boolean);
      segments.pop(); // Remove the last segment
      const newPath = '/' + (segments.length > 0 ? segments.join('/') : '');
      console.log("New Path:", newPath); // Debugging
      setCurrentPath(newPath);
      updatePopupContent(newPath);
  };

  const handleBlogClick = () => {
    // Initially open the blog root
    openItem({
      type: 'folder',
      path: '/',
      children: blogStructure, // Assuming blogStructure is the root
    });
  };

  return (
    <div className='app-container'>
      <div className="wallpaper"/>
      <div className='desktop-container'>
        <FileIconWithLabel onClick={() => setPopupContent({title: "About", isOpen: true, content: <TextFile filePath={about}/>})} label="About" isFile={1}/>
        <FileIconWithLabel onClick={handleBlogClick} label="Blog" isFile={0}/>
        {popupContent.isOpen && (
          <PopupWindow
            title={popupContent.title}
            isOpen={popupContent.isOpen}
            onClose={handleClose}
            isFolderMode={popupContent.isFolderMode}
            navigateBack={goBack}
          >
            {popupContent.content}
          </PopupWindow>
        )}
      </div>
    </div>
  );
}

export default App;