(function () {
    if (!window.matchMedia('(max-width: 768px)').matches) return;

    var items = document.querySelectorAll('.gallery-stage .item');
    var dots  = document.querySelectorAll('.gallery-dot');
    var stage = document.querySelector('.gallery-stage');
    if (!items.length || !dots.length || !stage) return;

    var current = 0;

    function goTo(index) {
        items[current].classList.remove('gallery-active');
        dots[current].classList.remove('active');
        current = ((index % items.length) + items.length) % items.length;
        items[current].classList.add('gallery-active');
        dots[current].classList.add('active');
    }

    // Signal to CSS that JS is in control (removes the no-JS fallback visibility)
    stage.classList.add('js-ready');
    goTo(0);

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { goTo(i); });
    });

    var startX = 0;
    stage.addEventListener('touchstart', function (e) {
        startX = e.changedTouches[0].screenX;
    }, { passive: true });

    stage.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].screenX - startX;
        if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });
})();
