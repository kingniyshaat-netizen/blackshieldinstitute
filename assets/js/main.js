(() => {
  const navToggleButtons = document.querySelectorAll(".nav-toggle");

  navToggleButtons.forEach(button => {
    const controls = button.getAttribute("aria-controls");
    const target = controls ? document.getElementById(controls) : null;
    if (!target) return;

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      target.classList.toggle("open", !expanded);
console.log("Blackshield system loaded");    });
  });

  const yearTargets = document.querySelectorAll("[data-year]");
  yearTargets.forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();
