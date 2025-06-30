// Theme Toggle
const themeBtn = document.getElementById('theme-toggle');
const sunSVG = `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/></svg>`;
const moonSVG = `<svg viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" stroke-width="2"/></svg>`;

function setThemeIcon() {
  if (document.body.classList.contains('dark')) {
    themeBtn.innerHTML = sunSVG;
  } else {
    themeBtn.innerHTML = moonSVG;
  }
}
themeBtn.onclick = () => {
  document.body.classList.toggle('dark');
  setThemeIcon();
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
};
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
setThemeIcon();

// Scroll Animation for Cards and Sections
function animateOnScroll() {
  const animated = document.querySelectorAll('.animate');
  const trigger = window.innerHeight * 0.92;
  animated.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < trigger) el.classList.add('visible');
  });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('DOMContentLoaded', animateOnScroll);

// Navbar Active Link Highlight
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let fromTop = window.scrollY + 120;
  navLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

// Course details for modal
const courseDetails = {
  c: {
    title: "C/C++ Notes",
    icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" alt="C/C++" style="width:48px;height:48px;">',
    desc: `<ul>
      <li>Comprehensive notes covering C and C++ syntax, data types, pointers, memory management, OOP (for C++), STL, and more.</li>
      <li>Includes sample programs, common interview questions, and best practices.</li>
      <li>Great for beginners and those preparing for coding interviews or exams.</li>
    </ul>
    <a href="#" class="card-link" target="_blank">Download PDF →</a>`
  },
  python: {
    title: "Python Quick Guide",
    icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" style="width:48px;height:48px;">',
    desc: `<ul>
      <li>Essential Python concepts: variables, data structures, functions, OOP, modules, and file I/O.</li>
      <li>Handy tips, code snippets, and explanations for beginners and intermediates.</li>
      <li>Includes practice problems and solutions.</li>
    </ul>
    <a href="#" class="card-link" target="_blank">Download PDF →</a>`
  },
  java: {
    title: "Java Essentials",
    icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" style="width:48px;height:48px;">',
    desc: `<ul>
      <li>Object-Oriented Programming, collections, exception handling, multithreading, and more.</li>
      <li>Concise, exam-ready format with code examples and diagrams.</li>
      <li>Includes common interview questions and answers.</li>
    </ul>
    <a href="#" class="card-link" target="_blank">Download PDF →</a>`
  },
  web: {
    title: "Web Dev Crash Course",
    icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="Web" style="width:48px;height:48px;">',
    desc: `<ul>
      <li>HTML, CSS, JavaScript basics, responsive design, and project templates.</li>
      <li>Step-by-step guides for building your first website.</li>
      <li>Includes resources for further learning.</li>
    </ul>
    <a href="#" class="card-link" target="_blank">Download PDF →</a>`
  }
};

// Modal logic
document.querySelectorAll('.feature-card[data-course]').forEach(card => {
  card.style.cursor = "pointer";
  card.addEventListener('click', function() {
    const course = this.getAttribute('data-course');
    const modal = document.getElementById('course-modal');
    const body = document.getElementById('modal-body');
    if (courseDetails[course]) {
      body.innerHTML = `<div style="text-align:center">${courseDetails[course].icon}<h2 style="margin:12px 0 8px">${courseDetails[course].title}</h2></div>${courseDetails[course].desc}`;
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  });
});
document.getElementById('modal-close').onclick = function() {
  document.getElementById('course-modal').style.display = "none";
  document.body.style.overflow = "";
};
window.addEventListener('click', function(e) {
  const modal = document.getElementById('course-modal');
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
});