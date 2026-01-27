(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('menu-form');
        const result = document.getElementById('menu-result');
        const resetBtn = document.getElementById('reset-settings');

        const STORAGE_KEY = 'constructor';

        const daysMap = {
            ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        };

        const setNames = {
            ru: [
                'Сет Лосось & Величайший',
                'Классический соляра',
                'Сет Филадельфия',
                'Креветка и сиега',
                'Спайси пират',
                'Вегги',
                'Тунец огурец',
                'Карта Карта'
            ],
            en: [
                'Salmon & Arthas',
                'Classic solyara',
                'Philadelphia Set',
                'Shrimp and Siega',
                'Spicy Pirate',
                'Veggie',
                'Tuna Cucumber',
            ],
        };

        function loadSettings() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            try {
                return JSON.parse(raw);
            } catch {
                return null;
            }
        }

        function saveSettings(settings) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        }

        function applySettingsToForm(settings) {
            if (!settings) return;
            form.weekType.value = settings.weekType;
            form.maxSlots.value = settings.maxSlots;
            form.lang.value = settings.lang || 'ru';
            form.theme.value = settings.theme;
            form.autoNames.checked = Boolean(settings.autoNames);
        }

        function collectSettingsFromForm() {
            return {
                weekType: form.weekType.value,
                maxSlots: form.maxSlots.value,
                lang: form.lang.value,
                theme: form.theme.value,
                autoNames: form.autoNames.checked,
            };
        }

        function getRandomSetName(lang) {
            const arr = setNames[lang] || setNames.ru;
            const idx = Math.floor(Math.random() * arr.length);
            return arr[idx];
        }

        function generateTable(settings) {
            const {weekType, maxSlots, lang, theme, autoNames} = settings;
            const days = daysMap[lang].slice(0, Number(weekType));
            const slots = Number(maxSlots);

            result.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.className = `menu-table menu-table--${theme}`;
            wrapper.style.setProperty('--cols', days.length + 1);

            const headerRow = document.createElement('div');
            headerRow.className = 'menu-table__row menu-table__row--header';

            const corner = document.createElement('div');
            corner.className = 'menu-table__cell menu-table__cell--corner';
            corner.textContent = lang === 'ru' ? 'Сет' : 'Slot';
            headerRow.appendChild(corner);

            days.forEach((d) => {
                const cell = document.createElement('div');
                cell.className = 'menu-table__cell menu-table__cell--day';
                cell.textContent = d;
                headerRow.appendChild(cell);
            });

            wrapper.appendChild(headerRow);

            for (let i = 1; i <= slots; i++) {
                const row = document.createElement('div');
                row.className = 'menu-table__row';

                const slotCell = document.createElement('div');
                slotCell.className = 'menu-table__cell menu-table__cell--slot';
                slotCell.textContent = i;
                row.appendChild(slotCell);

                days.forEach(() => {
                    const cell = document.createElement('div');
                    cell.className = 'menu-table__cell menu-table__cell--editable';
                    cell.contentEditable = 'true';
                    cell.textContent = autoNames
                        ? getRandomSetName(lang)
                        : (lang === 'ru' ? 'Сет / ролл' : 'Set / roll');
                    row.appendChild(cell);
                });

                wrapper.appendChild(row);
            }

            result.appendChild(wrapper);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const settings = collectSettingsFromForm();
            saveSettings(settings);
            generateTable(settings);
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                localStorage.removeItem(STORAGE_KEY);
                form.reset();
                result.innerHTML = '';
            });
        }

        const settings = loadSettings();
        if (settings) {
            applySettingsToForm(settings);
            generateTable(settings);
        }
    });
})();
