import {getResourses} from '../services/services'

function cards() {
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

    getResourses('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });
}

export default cards;