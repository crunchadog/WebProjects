document.addEventListener('DOMContentLoaded', () => {

    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideContent() {
        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        })

        tabContent.forEach((item, i) => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        })
    }

    function showContent(i = 0) {
        tabContent[i].classList.add('show', 'fade');
        tabContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideContent();
    showContent();


    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideContent();
                    showContent(i);
                }
            })
        }
    });

    // Timer
    const deadline = '2026-05-20';

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const now = Date.parse(endtime) - Date.parse(new Date());

        if (now <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(now / (1000 * 60 * 60 * 24));
            hours = Math.floor(now / (1000 * 60 * 60) % 24);
            minutes = Math.floor((now / (1000 / 60)) % 60);
            seconds = Math.floor((now / 1000) % 60);
        }

        return {
            'total': now,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) clearInterval(timeInterval);
        }
    }

    setClock('.timer', deadline)

    // Modal
    const modal = document.querySelector('.modal'),
        showModal = document.querySelectorAll('[data-modal]');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    showModal.forEach(item => {
        item.addEventListener('click', () => {
            openModal();
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 60000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);


    class MenuCard {
        #src;
        #alt;
        #title;
        #descr;
        #price;
        #transfer;
        #parent;
        #classes

        constructor(src, alt, title, descr, price, selectorParent, ...classes) {
            this.#src = src;
            this.#alt = alt;
            this.#title = title;
            this.#descr = descr;
            this.#price = price;
            this.#classes = classes;
            this.#transfer = 89.27;
            this.#parent = document.querySelector(selectorParent);
            this.#changeMoneyToRub();
        }

        #changeMoneyToRub() {
            this.#price *= this.#transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.#classes.length === 0) {
                this.#classes = 'menu__item';
                element.classList.add(this.#classes);
            } else {
                this.#classes.forEach(itemClass => {
                    element.classList.add((itemClass))
                })
            }
            element.innerHTML =
                `
                   <img src="${this.#src}" alt="${this.#alt}">
                    <h3 class="menu__item-subtitle">${this.#title}</h3>
                    <div class="menu__item-descr">${this.#descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.#price.toFixed(2)}</span> руб/день</div>
                   </div>
                `

            this.#parent.append(element);
        }
    }

    const getResourses = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Что-то пошло не так ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getResourses('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // Forms
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'icons/spinner.svg',
        success: 'Success',
        failure: 'Failure',
    }

    forms.forEach(form => {
        bindPostData(form);
    })

    const postData = async (url, data) => {
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        });

        return await result.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        })
    }

    function showThanksModal(message) {
        const previousModalDialog = document.querySelector('.modal__dialog');

        previousModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML =
            `
                <div class="modal__content">
                    <div class="modal__close" data-close>&times;</div>
                    <div class="modal__title">${message}</div>
                </div>
            `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            previousModalDialog.classList.add('show');
            previousModalDialog.classList.remove('hide');
            closeModal();
        }, 3000);
    }

    // fetch('../db.json')
    //     .then(data => data.json())
    //     .then(data => console.log(data))

    // Slider

    const sliderItem = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider');
    nextItem = document.querySelector('.offer__slider-next'),
        prevItem = document.querySelector('.offer__slider-prev'),
        total = document.querySelector('#total'),
        current = document.querySelector("#current"),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    if (sliderItem.length < 10) {
        total.textContent = `0${sliderItem.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = sliderItem.length;
        current.textContent = slideIndex;
    }

    slidesField.style.cssText = `display: flex; transition: 0.5s all; width: ${100 * sliderItem.length}%;`;

    slidesWrapper.style.cssText = `overflow: hidden;`;
    sliderItem.forEach(item => item.style.width = width);

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText =
        `
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 15;
            display: flex;
            justify-content: center;
            margin-right: 15%;
            margin-left: 15%;
            list-style: none;
        `;

    slider.append(indicators);

    for (let i = 0; i < sliderItem.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText =
            `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;

        if (i === 0) {
            dot.style.opacity = 1;
        }

        indicators.appendChild(dot);
        dots.push(dot);
    }

    nextItem.addEventListener('click', () => {
        if (offset === deleteNoDigits(width) * (sliderItem.length - 1)) {
            offset = 0;
        } else {
            offset += deleteNoDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex >= sliderItem.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        addZero(sliderItem, slideIndex);

        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[slideIndex - 1].style.opacity = '1';
    });

    prevItem.addEventListener('click', () => {
        if (offset === 0) {
            offset = deleteNoDigits(width) * (sliderItem.length - 1);
        } else {
            offset -= deleteNoDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`

        if (slideIndex <= 1) {
            slideIndex = sliderItem.length;
        } else {
            slideIndex--;
        }

        addZero(sliderItem, slideIndex);

        dots.forEach(dot => dot.style.opacity = '.65');
        dots[slideIndex - 1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const target = e.target;

            // const slideTo = target.getAttribute('data-slide-to');
            slideIndex = target.getAttribute('data-slide-to');
            offset = deleteNoDigits(width) * (slideIndex - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            addZero(sliderItem, slideIndex);

            dots.forEach(dot => dot.style.opacity = '.65');
            dots[slideIndex - 1].style.opacity = 1;
        })
    });

    function deleteNoDigits(item) {
        return +item.replace(/\D/ig, '');
    }

    function addZero(item, val) {
        if (item.length < 10) {
            current.textContent = `0${val}`;
        } else {
            current.textContent = val;
        }
    }

    // Calc

    const result = document.querySelector('.calculating__result span');
    let gender, height, weight, age, ratio;

    if (localStorage.getItem('gender')) {
        gender = localStorage.getItem('gender') ?? 'female';
    } else {
        localStorage.setItem('gender', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375
        localStorage.setItem('ratio', '1.375');
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass)

        if (elem.getAttribute('id') === localStorage.getItem('gender')) {
            elem.classList.add(activeClass);
        }

        if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
            elem.classList.add(activeClass);
        }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!gender || !height || !weight || !age || !ratio) {
            result.textContent = `____`;
            return;
        }

        if (gender === 'female') {
            result.textContent = ((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio).toFixed().toString();
        } else {
            result.textContent = ((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio).toFixed().toString();
        }
    }

    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector)

        elements.forEach((el) => {
            el.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                } else {
                    gender = e.target.getAttribute('id');
                    localStorage.setItem('gender', gender);
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass)
                });
                e.target.classList.add(activeClass);

                calcTotal();
            })
        })
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active')
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active')

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);
        input.addEventListener('input', () => {
            if (input.value.match(/\D/ig)) {
                input.style.cssText = `
                    border: 1px solid red;
                    transition: 0.3s;
                `;
            } else {
                input.style.cssText = `
                    border: 1px solid transparent;
                    transition: 0.5s;
                `;
            }
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value
            }

            calcTotal();

        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});