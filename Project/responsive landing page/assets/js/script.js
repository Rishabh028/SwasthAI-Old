/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    if(this.scrollY >= 50) {
        header.classList.add('scroll-header')
    } else {
        header.classList.remove('scroll-header')
    }
}
window.addEventListener('scroll', scrollHeader)

/*=============== SHOW SCROLL UP ===============*/
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up')
    if(this.scrollY >= 200) {
        scrollUp.classList.add('show-scroll')
    } else {
        scrollUp.classList.remove('show-scroll')
    }
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 50,
              sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 1000, // Reduced from 2500 to 1000 for faster animations
    delay: 200,    // Reduced from 400 to 200
    reset: false,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    mobile: false
})

sr.reveal(`.home__header, .section__title`, {delay: 300})
sr.reveal(`.home__footer`, {delay: 400})
sr.reveal(`.home__img`, {delay: 500, origin: 'top'})

sr.reveal(`.sponsor__img, .products__card, .footer__logo, .footer__content, .footer__copy`, {
    origin: 'top',
    interval: 100,
    distance: '40px'
})

sr.reveal(`.specs__data, .discount__animate`, {
    origin: 'left',
    interval: 100,
    distance: '40px'
})

sr.reveal(`.specs__img, .discount__img`, {
    origin: 'right',
    distance: '40px'
})

sr.reveal(`.case__img`, {
    origin: 'top',
    distance: '40px'
})

sr.reveal(`.case__data`, {
    origin: 'bottom',
    distance: '40px'
})

/*=============== ADD HOVER EFFECTS TO PRODUCT CARDS ===============*/
const productCards = document.querySelectorAll('.products__card')

productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)'
        card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)'
    })
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = ''
        card.style.boxShadow = ''
    })
})

/*=============== SMOOTH SCROLLING ===============*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault()
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        })
    })
})