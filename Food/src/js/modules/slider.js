function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
    const slidesItem = document.querySelectorAll(slide),
        slides = document.querySelector(container),
        nextItem = document.querySelector(nextArrow),
        prevItem = document.querySelector(prevArrow),
        total = document.querySelector(totalCounter),
        current = document.querySelector(currentCounter),
        slidesWrapper = document.querySelector(wrapper),
        slidesField = document.querySelector(field),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    if (slidesItem.length < 10) {
        total.textContent = `0${slidesItem.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slidesItem.length;
        current.textContent = slideIndex;
    }

    slidesField.style.cssText = `display: flex; transition: 0.5s all; width: ${100 * slidesItem.length}%;`;

    slidesWrapper.style.cssText = `overflow: hidden;`;
    slidesItem.forEach(item => item.style.width = width);

    slides.style.position = 'relative';

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

    slides.append(indicators);

    for (let i = 0; i < slidesItem.length; i++) {
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
        if (offset === deleteNoDigits(width) * (slidesItem.length - 1)) {
            offset = 0;
        } else {
            offset += deleteNoDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex >= slidesItem.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        addZero(slidesItem, slideIndex);

        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[slideIndex - 1].style.opacity = '1';
    });

    prevItem.addEventListener('click', () => {
        if (offset === 0) {
            offset = deleteNoDigits(width) * (slidesItem.length - 1);
        } else {
            offset -= deleteNoDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`

        if (slideIndex <= 1) {
            slideIndex = slidesItem.length;
        } else {
            slideIndex--;
        }

        addZero(slidesItem, slideIndex);

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

            addZero(slidesItem, slideIndex);

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
}

export default slider;