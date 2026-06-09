document.addEventListener('DOMContentLoaded', () => {
    
    /* ======================================================== 
    Navigation Bar
    ======================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const topNavbar = document.querySelector('.top-navbar');

    if (menuToggle && menuOverlay && topNavbar) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuOverlay.classList.toggle('is-open');
            topNavbar.classList.toggle('is-open');
     
            // Scroll Lock [removing scrollbar & params] 
            document.documentElement.classList.toggle('no-scroll', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });
    }

    /* ======================================================== 
    Carousel
    ======================================================== */
    const dots = document.querySelectorAll('.carousel-pagination .dot');
    const cards = document.querySelectorAll('.carousel-card');

    if (dots.length > 0 && cards.length > 0) {
        const updateCarousel = (pageIndex) => {
            const itemsPerPage = 1;
            const startIndex = pageIndex * itemsPerPage;

            cards.forEach(card => {
                card.classList.remove('fade-in');
                card.classList.remove('visible');
            });

            cards.forEach((card, cardIndex) => {
                if (cardIndex >= startIndex && cardIndex < startIndex + itemsPerPage) {
                    card.classList.add('visible');
                    setTimeout(() => {
                        card.classList.add('fade-in');
                    }, 30);
                }
            });
        };

        updateCarousel(0);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                dots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                updateCarousel(index);
            });
        });
    }

    /* ======================================================== 
    Popup Display Manager [Gallery]
    ======================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const popupDisplay = document.getElementById('popupDisplay');
    const popupContent = document.getElementById('popupContent');
    const popupClose = document.getElementById('popupClose');

    if (galleryItems.length > 0 && popupDisplay && popupContent && popupClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                
                // If it's a YouTube item, bypass the popup entirely 
                // and let it open normal link settings
                if (item.classList.contains('youtube-bypass')) {
                    return; 
                }

                // Prevent default browser behavior for normal image/video popups
                e.preventDefault();

                const assetType = item.getAttribute('data-type');
                const targetUrl = item.getAttribute('data-fullsrc');

                // Clearing old resizing elements
                popupContent.innerHTML = '';
                popupContent.className = 'popup-content-box';
                
                let assetEl;

                if (assetType === 'video') {
                    // Video Elements
                    assetEl = document.createElement('video');
                    assetEl.src = targetUrl;
                    assetEl.controls = true;
                    assetEl.loop = true;
                    assetEl.autoplay = true;
                    assetEl.muted = false;
                    assetEl.setAttribute('playsinline', '');
                    
                    assetEl.addEventListener('loadedmetadata', () => {
                        if (assetEl.videoHeight > assetEl.videoWidth) {
                            popupContent.classList.add('is-portrait');
                        } else {
                            popupContent.classList.add('is-landscape');
                        }
                    });
                } else {
                    // Image/Display Assets Fallback
                    assetEl = document.createElement('img');
                    assetEl.src = targetUrl;
                    assetEl.alt = 'Expanded View';
                    
                    // Calculation for images width higher than 2000px
                    assetEl.addEventListener('load', () => {
                        if (assetEl.naturalWidth > 2000) {
                            popupContent.classList.add('is-large');
                        } else if (assetEl.naturalHeight > assetEl.naturalWidth) {
                            popupContent.classList.add('is-portrait');
                        } else {
                            popupContent.classList.add('is-landscape');
                        }
                    });
                }

                // NO scroll parameter (removing scrollbar controls)
                popupContent.appendChild(assetEl);
                popupDisplay.classList.add('is-active');
                document.body.classList.add('no-scroll');

                // Fallback for autoplay
                if (assetType === 'video') {
                    assetEl.play().catch(error => {
                        console.log("Autoplay Failure:", error);
                    });
                }
            });
        });

        // Close Controller 
        const closePopupView = () => {
            const videoEl = popupContent.querySelector('video');
            if (videoEl) {
                videoEl.pause();
                videoEl.src = "";
                videoEl.load();
            }
            popupDisplay.classList.remove('is-active');
            document.body.classList.remove('no-scroll');
            popupContent.innerHTML = '';
            popupContent.className = 'popup-content-box';
        };

        popupClose.addEventListener('click', closePopupView);
        popupDisplay.addEventListener('click', (e) => {
            if (e.target === popupDisplay) closePopupView();
        });
    }
}); 
