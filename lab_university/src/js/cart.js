(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const addToCartButtons = document.querySelectorAll('.js-add-to-cart');
        const cartCountEl = document.getElementById('cart-count');
        if (!addToCartButtons.length) return;
        const cart = [];

        function updateCartCount() {
            if (!cartCountEl) return;
            const total = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountEl.textContent = total;
        }

        addToCartButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.food__card');
                if (!card) return;

                const nameEl = card.querySelector('.food__descr');
                const priceEl = card.querySelector('.new__price');
                const imgEl = card.querySelector('.food__img');

                const productName = nameEl ? nameEl.textContent.trim() : 'Сет';
                const productPrice = priceEl ? priceEl.textContent.trim() : '';
                const productImg = imgEl ? imgEl.getAttribute('src') : '';

                // модалка
                Swal.fire({
                    title: 'Добавить в корзину?',
                    theme: 'dark',
                    html: `
                        <div class="cart-modal">
                          <p class="cart-modal__name">${productName}</p>
                          <p class="cart-modal__price">Цена: <strong>${productPrice}</strong></p>
                          <label class="cart-modal__label">
                            Количество:
                            <input id="cart-qty-input" type="number" min="1" value="1" class="cart-modal__input">
                          </label>
                        </div>
                    `,
                    confirmButtonText: 'Добавить',
                    cancelButtonText: 'Отмена',
                    showCancelButton: true,
                    focusConfirm: false,
                    icon: 'info',
                    preConfirm: () => {
                        const input = document.getElementById('cart-qty-input');
                        const value = Number(input.value);

                        if (!value || value < 1) {
                            Swal.showValidationMessage('nigger took more then 0');
                            return false;
                        }

                        return { quantity: value };
                    }
                }).then((result) => {
                    if (result.isConfirmed && result.value) {
                        const quantity = result.value.quantity;
                        cart.push({
                            name: productName,
                            price: productPrice,
                            img: productImg,
                            quantity
                        });

                        updateCartCount();

                        // тостик
                        Toastify({
                            text: `Добавлено в корзину: ${productName} - ${quantity}`,
                            duration: 1500,
                            close: true,
                            gravity: 'top',
                            position: 'right',
                            className: 'toast-cart'
                        }).showToast();
                    }
                });
            });
        });
    });
})();
