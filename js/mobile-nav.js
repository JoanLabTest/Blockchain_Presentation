/* DCM Core — mobile menu for the main navbar (.navbar-pro).
   Below 1024px the desktop pillars are hidden; this adds a menu button that
   opens them as a full-height panel, with tap-to-expand sections. */
(function () {
    'use strict';
    var MQ = window.matchMedia('(max-width: 1024px)');

    function init() {
        var nav = document.querySelector('nav.navbar-pro');
        if (!nav || nav.querySelector('.nav-burger')) return;
        var pillars = nav.querySelector('.nav-pillars');
        if (!pillars) return;

        var fr = (document.documentElement.lang || '').toLowerCase().indexOf('fr') === 0;
        if (!pillars.id) pillars.id = 'nav-pillars-menu';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-burger';
        btn.setAttribute('aria-controls', pillars.id);
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', fr ? 'Ouvrir le menu' : 'Open menu');
        btn.innerHTML = '<span></span><span></span><span></span>';

        var actions = nav.querySelector('.nav-actions');
        if (actions) nav.insertBefore(btn, actions); else nav.appendChild(btn);

        function setOpen(open) {
            nav.classList.toggle('mobile-open', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            btn.setAttribute('aria-label', open ? (fr ? 'Fermer le menu' : 'Close menu') : (fr ? 'Ouvrir le menu' : 'Open menu'));
            document.documentElement.classList.toggle('nav-locked', open);
        }

        btn.addEventListener('click', function () { setOpen(!nav.classList.contains('mobile-open')); });

        // first tap on a section title expands it instead of navigating
        pillars.querySelectorAll('.pillar-item').forEach(function (item) {
            var link = item.querySelector('.pillar-link');
            if (!link || !item.querySelector('.mega-dropdown')) return;
            link.addEventListener('click', function (e) {
                if (!MQ.matches) return;
                if (!item.classList.contains('open')) {
                    e.preventDefault();
                    pillars.querySelectorAll('.pillar-item.open').forEach(function (o) { if (o !== item) o.classList.remove('open'); });
                    item.classList.add('open');
                }
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('mobile-open')) { setOpen(false); btn.focus(); }
        });
        MQ.addEventListener && MQ.addEventListener('change', function (e) { if (!e.matches) setOpen(false); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
