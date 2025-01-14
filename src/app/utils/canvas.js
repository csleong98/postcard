/**
 * Canvas Utility Functions
 * 
 * This file contains helper functions for working with the canvas element.
 * These functions handle drawing, image processing, and canvas setup.
 */

// Convert a canvas to a compressed image
export const compressImage = (base64String) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      // Create a temporary canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions (reduce by 50%)
      const newWidth = img.width * 0.5;
      const newHeight = img.height * 0.5;
      
      // Set canvas size
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert to JPEG with 70% quality
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

// Draw static elements on the back of the postcard
export const drawPostcardBack = (canvas) => {
  const ctx = canvas.getContext('2d');
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set styles for lines and box
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  
  // Draw stamp box in top right
  ctx.strokeRect(canvas.width - 120 - 16, 16, 120, 160);
  
  // Draw vertical line in middle
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 16);
  ctx.lineTo(canvas.width / 2, canvas.height - 16);
  ctx.stroke();
};

// Generate a preview image of both sides of the postcard
export const generatePostcardPreview = (frontCanvas, backCanvas, uploadedImage) => {
  return new Promise((resolve) => {
    // Create a temporary canvas for the combined preview
    const previewCanvas = document.createElement('canvas');
    const padding = 16;
    const cardWidth = 879;
    const cardHeight = 591;
    const spacing = 40;
    const totalHeight = cardHeight * 2 + spacing * 3;
    
    // Set canvas size
    previewCanvas.width = cardWidth + (padding * 2);
    previewCanvas.height = totalHeight + (padding * 2);
    const ctx = previewCanvas.getContext('2d');

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Add title
    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.fillText('Hey, you got mail!', padding, spacing);

    // Load the background image
    const img = new Image();
    img.onload = () => {
      // Draw front card
      const frontY = spacing + padding;
      drawCardWithShadow(ctx, padding, frontY, cardWidth, cardHeight);
      drawFrontContent(ctx, img, frontCanvas, padding, frontY, cardWidth, cardHeight);

      // Draw back card
      const backY = frontY + cardHeight + spacing;
      drawCardWithShadow(ctx, padding, backY, cardWidth, cardHeight);
      drawBackContent(ctx, backCanvas, padding, backY, cardWidth, cardHeight);

      // Return the final preview
      resolve(previewCanvas.toDataURL());
    };
    img.src = uploadedImage;
  });
};

// Helper function to draw card shadow
const drawCardWithShadow = (ctx, x, y, width, height) => {
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, width, height);
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

// Helper function to draw front content
const drawFrontContent = (ctx, img, frontCanvas, x, y, width, height) => {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  
  // Fill white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, width, height);
  
  // Draw background image
  const imageInset = 16;
  ctx.drawImage(
    img, 
    x + imageInset, 
    y + imageInset, 
    width - (imageInset * 2), 
    height - (imageInset * 2)
  );
  
  // Draw any drawings on top
  ctx.drawImage(
    frontCanvas, 
    x + imageInset, 
    y + imageInset, 
    width - (imageInset * 2), 
    height - (imageInset * 2)
  );
  ctx.restore();
};

// Helper function to draw back content
const drawBackContent = (ctx, backCanvas, x, y, width, height) => {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, width, height);
  ctx.drawImage(backCanvas, x, y);
  ctx.restore();
}; 