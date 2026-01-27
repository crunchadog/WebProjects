(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const listEl = document.getElementById('reviews-list');
        const preloaderEl = document.getElementById('reviews-preloader');
        const errorEl = document.getElementById('reviews-error');
        const reloadBtn = document.getElementById('reviews-reload');

        const commentsUrl = 'https://jsonplaceholder.typicode.com/comments';

        function pickFilterMode() {
            return Math.random() > 0.5 ? 'HIGH' : 'LOW'
        }

        async function loadReviews() {
            preloaderEl.style.display = 'flex';
            listEl.innerHTML = '';
            errorEl.textContent = '';

            const mode = pickFilterMode();
            console.log(mode);

            try {
                const response = await fetch(commentsUrl);

                const data = await response.json();

                let filtered;
                if (mode === 'HIGH') {
                    filtered = data.filter((item) => item.id >= 100);
                } else {
                    filtered = data.filter((item) => item.id <= 300);
                }

                const toRender = filtered.slice(0, 10);

                if (toRender.length === 0) {
                    listEl.innerHTML = '<p>Пока нет отзывов.</p>';
                    return;
                }

                toRender.forEach((item) => {
                    const card = document.createElement('article');
                    card.className = 'review-card';

                    card.innerHTML = `
            <div class="review-card__name">${item.name}</div>
            <div class="review-card__email">${item.email}</div>
            <div class="review-card__body">${item.body}</div>
          `;

                    listEl.appendChild(card);
                });
            } catch (err) {
                console.error(err);
                errorEl.textContent = '*-*';
            } finally {
                preloaderEl.style.display = 'none';
            }
        }

        loadReviews();

        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                loadReviews();
            });
        }
    });
})();
