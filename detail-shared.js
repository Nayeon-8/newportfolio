document.addEventListener('DOMContentLoaded', function () {
  // 1. Gather all project images and videos
  const mediaElements = Array.from(document.querySelectorAll('.main-content > .project-image, .main-content > .project-video'));
  
  if (mediaElements.length > 0) {
    // Create carousel wrapper elements
    const container = document.createElement('div');
    container.className = 'media-carousel-container';
    
    const track = document.createElement('div');
    track.className = 'media-carousel-track';
    
    // Insert the container right before the first media element
    const firstElement = mediaElements[0];
    firstElement.parentNode.insertBefore(container, firstElement);
    container.appendChild(track);
    
    // Move all media elements into the track
    mediaElements.forEach(el => {
      const card = document.createElement('div');
      card.className = 'media-carousel-card';
      
      // If video, ensure standard properties
      if (el.tagName === 'VIDEO') {
        el.setAttribute('autoplay', '');
        el.setAttribute('muted', '');
        el.setAttribute('loop', '');
        el.setAttribute('playsinline', '');
        el.muted = true;
        el.play().catch(err => console.log('Autoplay prevented:', err));
      }
      
      card.appendChild(el);
      track.appendChild(card);
    });
    
    // Enable dragging on mouse/touch
    let isDown = false;
    let startX;
    let scrollLeft;
    let dragStartX = 0;
    let dragStartY = 0;
    
    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('active');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });
    
    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('active');
    });
    
    container.addEventListener('mouseup', (e) => {
      isDown = false;
      container.classList.remove('active');
      
      // Determine if it was a quick click rather than a drag
      const dist = Math.sqrt(Math.pow(e.clientX - dragStartX, 2) + Math.pow(e.clientY - dragStartY, 2));
      if (dist < 8) {
        const clickedCard = e.target.closest('.media-carousel-card');
        if (clickedCard) {
          const media = clickedCard.querySelector('.project-image, .project-video');
          if (media) {
            openLightbox(media);
          }
        }
      }
    });
    
    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // scroll speed multiplier
      container.scrollLeft = scrollLeft - walk;
    });
    
    // Mobile Touch Dragging
    container.addEventListener('touchstart', (e) => {
      isDown = true;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
      isDown = false;
      
      if (e.changedTouches.length > 0) {
        const dist = Math.sqrt(Math.pow(e.changedTouches[0].clientX - dragStartX, 2) + Math.pow(e.changedTouches[0].clientY - dragStartY, 2));
        if (dist < 8) {
          const clickedCard = e.target.closest('.media-carousel-card');
          if (clickedCard) {
            const media = clickedCard.querySelector('.project-image, .project-video');
            if (media) {
              openLightbox(media);
            }
          }
        }
      }
    });
    
    container.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    }, { passive: true });
  }

  // Lightbox overlay display function
  function openLightbox(el) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close Lightbox');
    
    let clone;
    if (el.tagName === 'VIDEO') {
      clone = document.createElement('video');
      clone.src = el.src;
      clone.controls = true;
      clone.autoplay = true;
      clone.muted = false; // Enable audio for detail viewing
      clone.loop = true;
      clone.playsInline = true;
    } else {
      clone = document.createElement('img');
      clone.src = el.src;
      clone.alt = el.alt || 'Project Detail';
    }
    clone.className = 'lightbox-media';
    
    overlay.appendChild(clone);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden'; // Lock scroll
    
    // Custom cursor integration if present
    const cursor = document.getElementById('cursor');
    if (cursor) {
      cursor.classList.remove('hover');
    }
    
    const close = () => {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
      }, 300);
    };
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === closeBtn) {
        close();
      }
    });
    
    const escClose = (e) => {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', escClose);
      }
    };
    document.addEventListener('keydown', escClose);
  }

  // 2. Integrate custom cursor hover states for details pages
  const cursor = document.getElementById('cursor');
  if (cursor) {
    const cards = document.querySelectorAll('.media-carousel-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursor.textContent = 'VIEW';
        cursor.style.color = '#ffffff';
        cursor.style.fontSize = '10px';
        cursor.style.fontWeight = 'bold';
        cursor.style.display = 'flex';
        cursor.style.alignItems = 'center';
        cursor.style.justifyContent = 'center';
      });
      card.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursor.textContent = '';
      });
    });
    
    const interactiveElements = document.querySelectorAll('a, button, .menu-toggle');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });
  }
});
