// Toggle background active
const slideNavigator = name => {
    let slides = document.querySelectorAll('.bg-slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
        if (slide.classList.contains(name)) {
            slide.classList.add('active');
        }
    });
};

// Switch background
window.addEventListener('load', () => {
    const slideBtnList = document.querySelectorAll('.slide-btn');
    slideBtnList.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            slideBtnList.forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
            slideNavigator(this.getAttribute('data-target'));
        });
    });
});

// Activate section
const sectionNavigator = name => {
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('header');
    sections.forEach(section => {
        section.classList.remove('section-show');
        if (section.id === name) {
            section.classList.add('section-show');
            header.classList.add('active');
        }
    });
};

// Navigation to sections
window.addEventListener('load', () => {
    const navList = document.querySelectorAll('.nav-btn');
    navList.forEach(nav => {
        nav.addEventListener('click', function (e) {
            e.preventDefault();
            navList.forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
            sectionNavigator(this.getAttribute('data-target'));
            screen.width < 768 && toggleMenu();
        });
    });
});

// reset header to initail state
const resetHeader = () => {
    let header = document.querySelector('header');
    header.classList.remove('active');
};

// initial navigation
const initNavigation = () => {
    const navList = document.querySelectorAll('.nav-btn');
    navList.forEach(el => {
        el.classList.remove('active');
        if (el.getAttribute('data-target') === 'about') {
            el.classList.add('active');
        }
    });
    sectionNavigator('about');
}
