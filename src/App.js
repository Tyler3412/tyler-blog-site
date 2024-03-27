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

  function findItemAndParent(items, path, parent = null) {
    for (const item of items) {
      if (item.path === path) {
        return { item, parent }; // Found the item, return it along with its parent
      }
      if (item.children) {
        const found = findItemAndParent(item.children, path, item);
        if (found) {
          return found; // If the item is found in a deeper level, return it
        }
      }
    }
    return null; // Return null if the item is not found
  }

  const goBack = () => {
    if (popupContent.currentPath === "/blog") {
      // Already at the root, so maybe close the popup or do nothing
      return;
    }
  
    // Use the findItemAndParent function to find the current item and its parent based on the current path
    const { parent } = findItemAndParent(blogStructure, popupContent.currentPath) || {};
  
    // If there's no parent (which means we are at the root or an error occurred), default to the root
    if (!parent) {
      updatePopupContent("/blog", blogStructure, "/blog");
      return;
    }
  
    // Update the popup content to show the parent directory
    updatePopupContent(parent.path || "/blog", parent.children || [], parent.path || "/blog");
  };
  

  return (
    <div className='app-container'>
      <div className="wallpaper"/>
      <div className='desktop-container'>
        <FileIconWithLabel onClick={() => openItem({ type: 'file', name: 'About', path: about })} label="About" isFile={true}/>
        <FileIconWithLabel onClick={() => updatePopupContent("/blog", blogStructure, "/blog")} label="Blog" isFile={false}/>
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
