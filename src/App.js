import React, { useState } from 'react';
import './App.css';
import './components/background/background.css';
import './components/buttons/icon-container.css';
import FileIconWithLabel from './components/buttons/icon-button';
import PopupWindow from './components/popup/popup';
import TextFile from './components/textfile';
import blogStructure from './blogStructure.json';
import about from './components/about/about.md';
import './components/directory_grid/directory_grid.css';

function App() {
  const [popupContent, setPopupContent] = useState({
    title: "/blog",
    isOpen: false,
    content: null,
    currentPath: "/blog", // Added currentPath to state
  });

  const [searchTerm, setSearchTerm] = useState('');

  const recursiveSearch = (items, searchLowerCase = '') => {
    return items.reduce((acc, item) => {
      if (item.name.toLowerCase().includes(searchLowerCase)) {
        acc.push(item);
      }
      if (item.type === 'folder' && item.children) {
        const filteredChildren = recursiveSearch(item.children, searchLowerCase);
        if (filteredChildren.length > 0) {
          acc.push({ ...item, children: filteredChildren });
        }
      }
      return acc;
    }, []);
  };

  const handleSearch = (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredStructure = trimmedSearchTerm ? recursiveSearch(blogStructure, trimmedSearchTerm) : blogStructure;

    updatePopupContent("/", filteredStructure, trimmedSearchTerm ? 'Search Results' : '/blog');
  };

  const updatePopupContent = (path, structure, title) => {
    setPopupContent({
      title,
      isOpen: true,
      currentPath: path, // Update currentPath here
      content: (
        <div className="directory-grid">
          {structure.map(item => (
            <FileIconWithLabel
              key={item.name}
              label={item.name}
              onClick={() => openItem(item)}
              isFile={item.type === 'file'}
            />
          ))}
        </div>
      ),
    });
  };

  const openItem = (item) => {
    setSearchTerm('');
    if (item.type === 'file') {
      setPopupContent({
        title: item.name,
        isOpen: true,
        content: <TextFile filePath={item.path} />,
        currentPath: item.path, // Ensure the path is updated for files as well
      });
    } else {
      updatePopupContent(item.path, item.children, item.path);
    }
  };

  const goBack = () => {
    if (popupContent.currentPath === "/blog") {
      // Already at the root, no action needed or maybe close the popup
      return;
    }
    // Use currentPath from state instead of title for path calculations
    const segments = popupContent.currentPath.split('/').filter(Boolean);
    segments.pop(); // Remove the last segment to go one level up
    const newPath = '/' + segments.join('/');
    const newStructure = newPath === '/blog' ? blogStructure : recursiveSearch(blogStructure, '').find(item => item.path === newPath)?.children || blogStructure;
    console.log("New path:" , newPath);
    console.log("New structure:", JSON.stringify(newStructure, null, 2));
    updatePopupContent(newPath, newStructure, newPath);
  };

  return (
    <div className='app-container'>
      <div className="wallpaper"/>
      <div className='desktop-container'>
        <FileIconWithLabel onClick={() => openItem({ type: 'file', name: 'About', path: about })} label="About" isFile={true}/>
        <FileIconWithLabel onClick={() => updatePopupContent("/blog", blogStructure, "/Blog")} label="Blog" isFile={false}/>
        {popupContent.isOpen && (
          <PopupWindow
            title={popupContent.title}
            isOpen={popupContent.isOpen}
            onClose={() => setPopupContent(prev => ({...prev, isOpen: false}))}
            navigateBack={goBack}
            onSearchChange={handleSearch}
          >
            {popupContent.content}
          </PopupWindow>
        )}
      </div>
    </div>
  );
}

export default App;
