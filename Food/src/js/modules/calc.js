function calc() {
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
}

export default calc;