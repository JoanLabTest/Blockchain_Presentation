/**
 * SCROLL TO TOP - STANDALONE MODULE
 * Reusable component for all pages
 */

document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Toggle visibility based on scroll position
        window.addEventListener('scroll', () => {
            // Show after 300px of scrolling
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        // Click event to scroll smoothly to top
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
