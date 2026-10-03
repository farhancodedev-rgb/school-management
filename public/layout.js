/* layout.js - shared sidebar show/hide. Replaces /mobile-nav.js. Load at end of body. */
(function () {
    var nav = document.querySelector(".main-nav");
    var header = document.querySelector(".dashboard-header");
    if (!nav || !header) return;

    var btn = document.createElement("button");
    btn.id = "navToggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle menu");
    btn.textContent = "☰";
    header.insertBefore(btn, header.firstChild);

    var ov = document.createElement("div");
    ov.id = "navOverlay";
    document.body.appendChild(ov);

    function closeNav() {
        nav.classList.remove("open");
        ov.classList.remove("show");
    }

    btn.addEventListener("click", function () {
        if (window.innerWidth >= 900) {
            document.body.classList.toggle("collapsed");
        } else {
            nav.classList.toggle("open");
            ov.classList.toggle("show");
        }
    });

    ov.addEventListener("click", closeNav);
    nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) closeNav();
    });
    window.addEventListener("resize", closeNav);
})();
