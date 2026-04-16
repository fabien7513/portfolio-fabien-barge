const buttons = document.querySelectorAll(".open-modal");
const modal = document.getElementById("modal");
const title = document.getElementById("modal-title");
const description = document.getElementById("modal-description");
const image = document.getElementById("modal-image");
const close = document.querySelector(".close-modal");
const modalContent = modal?.querySelector(".modal-content");
const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
let lastFocusedElement = null;

if (buttons.length && modal && title && description && image && close && modalContent) {
  const getFocusableElements = () =>
    Array.from(modalContent.querySelectorAll(focusableSelector)).filter(
      (element) => !element.hasAttribute("hidden"),
    );

  const openModal = (button) => {
    lastFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    title.textContent = button.dataset.title || "";
    description.textContent = button.dataset.description || "";

    const imageSource = button.dataset.image || "";
    image.src = imageSource;
    image.alt = button.dataset.title || "Projet";
    image.hidden = !imageSource;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-modal-open");
    close.focus();
  };

  const closeModal = () => {
    if (!modal.classList.contains("active")) {
      return;
    }

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-modal-open");

    title.textContent = "";
    description.textContent = "";
    image.src = "";
    image.alt = "";
    image.hidden = true;

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal(btn);
    });
  });

  close.addEventListener("click", () => {
    closeModal();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) {
      return;
    }

    if (e.key === "Escape") {
      closeModal();
    }

    if (e.key === "Tab") {
      const focusableElements = getFocusableElements();

      if (!focusableElements.length) {
        e.preventDefault();
        close.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

const tiltCards = document.querySelectorAll(".js-tilt-card");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  tiltCards.forEach((card) => {
    const strength = Number(card.dataset.tiltStrength || 8);

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -strength;
      const rotateY = ((x - centerX) / centerX) * strength;
      const pointerX = `${(x / rect.width) * 100}%`;
      const pointerY = `${(y / rect.height) * 100}%`;

      card.style.setProperty("--rotate-x", `${rotateX}deg`);
      card.style.setProperty("--rotate-y", `${rotateY}deg`);
      card.style.setProperty("--pointer-x", pointerX);
      card.style.setProperty("--pointer-y", pointerY);
      card.style.setProperty("--glare-opacity", "1");
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rotate-x", "0deg");
      card.style.setProperty("--rotate-y", "0deg");
      card.style.setProperty("--pointer-x", "50%");
      card.style.setProperty("--pointer-y", "50%");
      card.style.setProperty("--glare-opacity", "0");
    });
  });
}
