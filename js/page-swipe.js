/**
 * Page Swipe Transition
 * Creates a swipe effect when navigating to another page
 */

function initPageSwipe() {
  // Find all buttons with the swipe class or the backImage button
  const swipeButtons = document.querySelectorAll('.backImage-btn[href]');
  
  if (swipeButtons.length === 0) {
    // Buttons not loaded yet, try again after a short delay
    setTimeout(initPageSwipe, 100);
    return;
  }
  
  swipeButtons.forEach((button) => {
    // Remove existing listeners to prevent duplicates
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetUrl = this.getAttribute('href');
      if (!targetUrl) return;
      
      // Add swipe class to body to move current screen to the left
      document.body.classList.add('swipe-page-left');
      
      // Force reflow to ensure transition starts
      void document.body.offsetWidth;
      
      // Navigate after transition completes
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 1500); // Match the CSS transition duration (0.7s)
    });
  });
}

// Export function for use in other scripts
window.initPageSwipe = initPageSwipe;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageSwipe);
} else {
  // DOM is already ready
  initPageSwipe();
}

