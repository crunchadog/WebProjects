(() => {
    window.addEventListener("load", () => {
        setTimeout(() => {
            const nav = performance.getEntriesByType("navigation")[0];

            const seconds = (nav.loadEventEnd / 1000).toFixed(3);
            const box = document.getElementById("metrics");
            if (box) {
                box.textContent = `Page load time is ${seconds} Seconds`;
            }

        }, 1);
    });
})();

document.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelector('.nav__list');
    list.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;


        list.querySelectorAll('.nav__link.active').forEach(el => el.classList.remove('active'));
        a.classList.add('active');
    });
});