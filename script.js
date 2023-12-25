'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window
const openModal = function (ev) {
	ev.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (ev) {
	if (ev.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function () {
	const s1coords = section1.getBoundingClientRect();

	section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation
document.querySelector('.nav__links').addEventListener('click', function (ev) {
	ev.preventDefault();

	if (ev.target.classList.contains('nav__link')) {
		const id = ev.target.getAttribute('href');
		document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
	}
});

///////////////////////////////////////
// Tabbed component
tabsContainer.addEventListener('click', function (ev) {
	const clicked = ev.target.closest('.operations__tab');

	// Guard clause
	if (!clicked) return;

	// Remove active classes
	tabs.forEach(t => t.classList.remove('operations__tab--active'));
	tabsContent.forEach(c => c.classList.remove('operations__content--active'));

	// Activate tab
	clicked.classList.add('operations__tab--active');

	// Activate content area
	document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (ev) {
	if (ev.target.classList.contains('nav__link')) {
		const link = ev.target;
		const siblings = link.closest('.nav').querySelectorAll('.nav__link');
		const logo = link.closest('.nav').querySelector('img');

		siblings.forEach(el => {
			if (el !== link) el.style.opacity = this;
		});
		logo.style.opacity = this;
	}
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
	const [entry] = entries;
	// console.log(entry);

	!entry.isIntersecting ? nav.classList.add('sticky') : nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	entry.target.classList.remove('section--hidden');
	observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

allSections.forEach(function (section) {
	sectionObserver.observe(section);
	section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	// Replace src with data-src
	entry.target.src = entry.target.dataset.src;

	entry.target.addEventListener('load', function () {
		entry.target.classList.remove('lazy-img');
	});

	observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0,
	rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
	const slides = document.querySelectorAll('.slide');
	const btnLeft = document.querySelector('.slider__btn--left');
	const btnRight = document.querySelector('.slider__btn--right');
	const dotContainer = document.querySelector('.dots');

	let curSlide = 0;
	const maxSlide = slides.length;

	// Functions
	const createDots = function () {
		slides.forEach(function (_, i) {
			dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
		});
	};

	const activateDot = function (slide) {
		document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

		document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
	};

	const goToSlide = function (slide) {
		slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
	};

	// Next slide
	const nextSlide = function () {
		curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++;

		goToSlide(curSlide);
		activateDot(curSlide);
	};

	const prevSlide = function () {
		curSlide === 0 ? (curSlide = maxSlide - 1) : curSlide--;

		goToSlide(curSlide);
		activateDot(curSlide);
	};

	const init = function () {
		goToSlide(0);
		createDots();
		activateDot(0);
	};
	init();

	// Event handlers
	btnRight.addEventListener('click', nextSlide);
	btnLeft.addEventListener('click', prevSlide);

	document.addEventListener('keydown', function (ev) {
		if (ev.key === 'ArrowLeft') prevSlide();
		if (ev.key === 'ArrowRight') nextSlide();
	});

	dotContainer.addEventListener('click', function (ev) {
		if (ev.target.classList.contains('dots__dot')) {
			const { slide } = ev.target.dataset;
			goToSlide(slide);
			activateDot(slide);
		}
	});
};
slider();
