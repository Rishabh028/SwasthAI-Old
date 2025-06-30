// Navigation
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

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
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Project modal functionality
function openProjectModal(projectId) {
    const modal = document.getElementById(`${projectId}-modal`);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeModal(projectId) {
    const modal = document.getElementById(`${projectId}-modal`);
    modal.style.display = "none";
    document.body.style.overflow = "auto";
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

// Scroll reveal animations
const animateElements = document.querySelectorAll('[data-animate]');

const animateOnScroll = () => {
    animateElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        }
    });
};

// Run once on page load
animateOnScroll();

// Run on scroll
window.addEventListener('scroll', animateOnScroll);