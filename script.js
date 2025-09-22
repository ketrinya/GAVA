document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const burger = document.querySelector(".burger");
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll("nav a[href^='#']");
  const allAnchorLinks = document.querySelectorAll("a[href^='#']");
  const sections = document.querySelectorAll("section[id]");
  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;

  document.querySelector("nav li")?.classList.add("active");

  let openedByFocus = false;

  const toggleMenu = (forceState = null) => {
    const isOpen = forceState !== null ? forceState : !nav.classList.contains("open");

    nav.classList.toggle("open", isOpen);
    burger.classList.toggle("open", isOpen);
    body.classList.toggle("no-scroll", isOpen);
    burger.setAttribute("aria-expanded", isOpen);

    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    } else {
      document.body.style.removeProperty('--scrollbar-width');
    }
  };

  burger.addEventListener("click", () => {
    if (nav.classList.contains("open")) {

      if (openedByFocus) {
        openedByFocus = false;
        return;
      }
    }
    toggleMenu();
    openedByFocus = false;
  });

  burger.addEventListener("focus", () => {
    if (!nav.classList.contains("open")) {
      openedByFocus = true;
      toggleMenu(true);
    }
  });


  nav.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!nav.contains(document.activeElement) && document.activeElement !== burger) {
        if (openedByFocus) {
          toggleMenu(false);
          openedByFocus = false;
        }
      }
    }, 0);
  });

  const handleAnchorClick = (link, event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const targetId = href.slice(1);
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    event.preventDefault();

    const yOffset = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: yOffset, behavior: "smooth" });

    link.blur();

    const correspondingNavLink = document.querySelector(`nav a[href="#${targetId}"]`);
    const listItem = correspondingNavLink?.closest("li");

    if (listItem) {
      document.querySelectorAll("nav li").forEach(li => li.classList.remove("active"));
      listItem.classList.add("active");
    }

    toggleMenu(false);
    openedByFocus = false;
  };

  allAnchorLinks.forEach(link => {
    link.addEventListener("click", e => handleAnchorClick(link, e));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const active = document.activeElement;
      if (active && active.tagName === "A" && active.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        handleAnchorClick(active, e);
      }
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      toggleMenu(false);
      openedByFocus = false;
    }
  });

  window.addEventListener("scroll", () => {
    let currentId = '';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 180 && rect.bottom > 180) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.closest('li')?.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.closest('li')?.classList.add("active");
      }
    });
  });

  const photoStack = document.querySelector(".about_photo_stack");
  if (photoStack) {
    const photoObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            photoStack.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    photoObserver.observe(photoStack);
  }

  const revealElements = document.querySelectorAll('.scroll_animation');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    const target = document.getElementById('btn_slogan');
    const focusTarget = () => {
      const hadTabindex = target.hasAttribute('tabindex');
      if (!hadTabindex) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus();
      target.scrollIntoView({behavior: "smooth", block: "center"});
      if (!hadTabindex) {
        target.removeAttribute('tabindex');
      }
    };
    skipLink.addEventListener('click', (e) => {
      if (target) {
        e.preventDefault();
        setTimeout(focusTarget, 100);
      }
    });
    skipLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setTimeout(focusTarget, 100);
      }
    });
  }

});
