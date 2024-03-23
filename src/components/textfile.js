import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import './blog_style.css'

function TextFile({ filePath }) {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
  
    const fetchMarkdown = async () => {
      console.log("Fetching filepath " + filePath)
      if (!filePath) return;
      try {
        const response = await fetch(filePath, { signal });
        const text = await response.text();
        setMarkdown(text);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted', filePath);
        } else {
          console.error('Failed to fetch markdown content', error);
          setMarkdown('Failed to load content.');
        }
      }
    };
  
    fetchMarkdown();
  
    return () => {
      controller.abort();
    };
  }, [filePath]);

  return (
    <div className='blog-background'>
      <div className="content-container"> {/* Add this wrapper */}
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default TextFile;