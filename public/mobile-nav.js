document.addEventListener("DOMContentLoaded", () => {

    const nav = document.querySelector(".main-nav");

    if (!nav) return;

    const button = document.createElement("button");

    button.className = "mobile-nav-toggle";
    button.type = "button";
    button.innerHTML = "☰";
    button.setAttribute("aria-label", "Toggle navigation");

    nav.parentNode.insertBefore(button, nav);

    button.addEventListener("click", () => {

        nav.classList.toggle("mobile-nav-open");

        if (nav.classList.contains("mobile-nav-open")) {
            button.innerHTML = "✕";
        } else {
            button.innerHTML = "☰";
        }

    });

});
