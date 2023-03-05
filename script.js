document.addEventListener("DOMContentLoaded", function () {
    const storedStylesheet = localStorage.getItem("stylesheet");
    if (storedStylesheet) {
        const stylesheet = document.getElementById("stylesheet");
        stylesheet.setAttribute("href", storedStylesheet);
        const button = document.getElementById("toggleBtn");
        if (storedStylesheet.endsWith("style.css")) {
            button.textContent = "LM";
        } else {
            button.textContent = "DM";
        }
    }
});
function switchCss() {
    const stylesheet = document.getElementById("stylesheet");
    const button = document.getElementById("toggleBtn");
    if (stylesheet.getAttribute("href") === "style.css") {
        stylesheet.setAttribute("href", "dark.css");
        button.textContent = "DM";
    } else {
        stylesheet.setAttribute("href", "style.css");
        button.textContent = "LM";
    }
    localStorage.setItem("stylesheet", stylesheet.getAttribute("href"));
}
