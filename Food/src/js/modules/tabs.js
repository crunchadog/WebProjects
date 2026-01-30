function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    // Tabs
    const tabs = document.querySelectorAll(tabsSelector),
        tabContent = document.querySelectorAll(tabsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector);

    function hideContent() {
        tabs.forEach(tab => {
            tab.classList.remove(activeClass);
        })

        tabContent.forEach((item, i) => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        })
    }

    function showContent(i = 0) {
        tabContent[i].classList.add('show', 'fade');
        tabContent[i].classList.remove('hide');
        tabs[i].classList.add(activeClass);
    }

    hideContent();
    showContent();


    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideContent();
                    showContent(i);
                }
            })
        }
    });
}

export default tabs;