// Mobile menu toggle
const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');
        
navToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    navToggle.classList.toggle('active');
});
        
// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
        navToggle.classList.remove('active');
    });
});
        
// Change header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.classList.toggle('scroll-header', window.scrollY > 50);
            
    // Show/hide scroll to top button
    const scrollTop = document.querySelector('.scroll-top');
    scrollTop.classList.toggle('active', window.scrollY > 300);
});
        
// Scroll to top functionality
document.querySelector('.scroll-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
        
// Animate elements when they come into view
const animateElements = document.querySelectorAll('[data-animate]');
        
const animateOnScroll = () => {
    animateElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
                
        if (elementPosition < windowHeight - 100) {
            element.style.animationPlayState = 'running';
        }
    });
};
        
// Run once on page load
animateOnScroll();
        
// Run on scroll
window.addEventListener('scroll', animateOnScroll);
        
// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
                
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
                
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
        
// Active link highlighting
const sections = document.querySelectorAll('section');
        
window.addEventListener('scroll', () => {
    let current = '';
            
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
                
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
            
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
/* ===== PROJECT MODAL FUNCTIONS ===== */
function openProjectModal(projectId) {
    const modal = document.getElementById(`${projectId}-modal`);
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling
}

function closeModal(projectId) {
    const modal = document.getElementById(`${projectId}-modal`);
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
}

// Close modal when clicking outside content
window.onclick = function(event) {
    if (event.target.className === 'project-modal') {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Close with ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const modals = document.querySelectorAll('.project-modal');
        modals.forEach(modal => {
            if (modal.style.display === "block") {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }
});
// Enhanced Marksheet Tab Functionality with Animation
function openMarksheetTab(tabName) {
    const tabContents = document.querySelectorAll('.marksheet-content');
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Animate out current content
    const activeContent = document.querySelector('.marksheet-content[style*="display: block"]');
    if (activeContent) {
        activeContent.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            activeContent.style.display = 'none';
            activeContent.style.animation = '';
        }, 300);
    }
    
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Animate in new content
    const newContent = document.getElementById(`${tabName}-marksheet`);
    newContent.style.display = 'block';
    newContent.style.animation = 'fadeIn 0.5s ease forwards';
    event.currentTarget.classList.add('active');
    
    // Add pulse animation to active tab
    event.currentTarget.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
        event.currentTarget.style.animation = '';
    }, 500);
}

// Enhanced PDF Viewer with Better Animation
function openPdfViewer(pdfUrl, title) {
    const modal = document.getElementById('pdf-viewer-modal');
    const pdfEmbed = document.getElementById('pdf-embed');
    const pdfTitle = document.getElementById('pdf-viewer-title');
    const downloadLink = document.getElementById('modal-download-link');
    
    pdfTitle.textContent = title;
    pdfEmbed.src = `https://docs.google.com/gview?url=${encodeURIComponent(window.location.origin + '/' + pdfUrl)}&embedded=true`;
    
    // Set appropriate download filename
    let downloadFilename = '';
    if (pdfUrl.includes('class10')) {
        downloadFilename = 'Rishabh_Rajak_Class10_Marksheet.pdf';
    } else if (pdfUrl.includes('class12')) {
        downloadFilename = 'Rishabh_Rajak_Class12_Marksheet.pdf';
    } else if (pdfUrl.includes('ug-grade')) {
        downloadFilename = 'Rishabh_Rajak_IITG_UG_Grade_Card.pdf';
    }
    
    downloadLink.href = pdfUrl;
    downloadLink.download = downloadFilename;
    downloadLink.setAttribute('data-pdf', pdfUrl);
    
    // Animation
    modal.style.display = "block";
    setTimeout(() => {
        modal.style.opacity = "1";
        modal.querySelector('.modal-content').style.transform = "translateY(0)";
    }, 10);
    document.body.style.overflow = "hidden";
}
// Add this to your existing JavaScript
function animateDownloadButton(button) {
    // Add pulse animation
    button.style.animation = 'pulse 0.5s ease';
    
    // Reset animation after it completes
    setTimeout(() => {
        button.style.animation = '';
    }, 500);
    
    // Optional: Add click confirmation
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Downloading...';
    
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 2000);
}
// Make download buttons work with animation
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Trigger animation
        this.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
        
        // Visual feedback
        const originalHtml = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Downloading...';
        
        setTimeout(() => {
            this.innerHTML = originalHtml;
        }, 1500);
    });
});

// Close modal when clicking outside content
window.onclick = function(event) {
    if (event.target.className === 'pdf-modal') {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}
// Close with ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const modals = document.querySelectorAll('.pdf-modal');
        modals.forEach(modal => {
            if (modal.style.display === "block") {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }
});
// Add this function to handle closing the PDF modal
function closePdfModal() {
    const modal = document.getElementById('pdf-viewer-modal');
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// Add event listener for the PDF modal close button
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing initialization code ...
    
    // Add this for the PDF modal close button
    const pdfCloseBtn = document.querySelector('.pdf-modal .close-button');
    if (pdfCloseBtn) {
        pdfCloseBtn.addEventListener('click', closePdfModal);
    }
});
// Enhanced Education Card Hover Effects
function setupEducationCards() {
    const educationCards = document.querySelectorAll('.education-card');
    
    educationCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const img = card.querySelector('.education-img');
            img.style.transform = 'scale(1.1) rotate(5deg)';
            card.style.boxShadow = '0 15px 30px rgba(182, 87, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            const img = card.querySelector('.education-img');
            img.style.transform = 'scale(1) rotate(0)';
            card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
    });
}
// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    setupEducationCards();
    
    // Add click animation to marksheet previews
    document.querySelectorAll('.marksheet-preview').forEach(preview => {
        preview.addEventListener('click', function() {
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
});

// Scroll-triggered animation for .education-card, .project-card, etc.
document.addEventListener("DOMContentLoaded", function () {
  const animatedEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated-in')) {
        entry.target.style.animationPlayState = 'running';
        entry.target.classList.add('animated-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedEls.forEach(el => {
    // Set animation-delay if specified
    const delay = el.getAttribute('data-animate-delay');
    if (delay) el.style.animationDelay = `${parseInt(delay, 10) / 1000}s`;
    // Pause animation initially
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
});