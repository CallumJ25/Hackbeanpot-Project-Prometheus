import React, { useEffect, useRef } from 'react';


const Animation = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas not found');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    console.log('Canvas initialized');
    
    // Set canvas size to match parent container
    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        console.log('Canvas size:', canvas.width, 'x', canvas.height);
      }
    };
    
    updateCanvasSize();
    
    // If canvas has no size, stop here
    if (canvas.width === 0 || canvas.height === 0) {
      console.log('Canvas has no size');
      return;
    }
    
    // Stock symbols and other content
    const symbols = ['DIS', 'GOOGL', 'MCD', 'AMZN', 'WMT', 'NVDA', 'NKE', 'NFLX', 'JNJ', 'KO', 'AXP'];
    
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize) || 10;
    
    console.log('Columns:', columns);
    
    // Each column gets assigned content to display
    const columnContent = [];
    for (let i = 0; i < columns; i++) {
        // Show a company name
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        columnContent[i] = {
          type: 'symbol',
          text: symbol + ' ', // Add space after company name
          index: 0
        };
    }
    
    // Initialize drops with random starting positions
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }
    
    function draw() {
      // Black background with slight transparency for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${fontSize}px monospace`;
      
      // Draw each column
      for (let i = 0; i < drops.length; i++) {
        const content = columnContent[i];
        let char;
        
        if (content.type === 'symbol') {
          // Show company name letter by letter, then loop
          char = content.text[content.index % content.text.length];
          if (drops[i] > 0) {
            content.index++;
          }
        } else if (content.type === 'number') {
          char = content.text[Math.floor(Math.random() * content.text.length)];
        } else {
          char = content.text[Math.floor(Math.random() * content.text.length)];
        }
        
        // Varying shades of green
        const brightness = Math.floor(Math.random() * 156) + 100;
        ctx.fillStyle = `rgb(0, ${brightness}, 0)`;
        
        // Draw character
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        if (y > 0 && y < canvas.height) {
          ctx.fillText(char, x, y);
        }
        
        // Move drop down or reset to top
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          content.index = 0; // Reset symbol index
        }
        drops[i]++;
      }
    }
    
    console.log('Starting animation');
    // Draw at ~20fps
    const interval = setInterval(draw, 50);
    
    // Handle window resize
    const handleResize = () => {
      updateCanvasSize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      console.log('Animation stopped');
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
};

export default Animation;
