import { gsap } from "./animations";

export function initGlobalScrollSnap() {
  const sections = Array.from(
    document.querySelectorAll("[data-scroll-snap]"),
  ) as HTMLElement[];

  if (sections.length < 2) return;

  let isAnimating = false;
  let currentIndex = 0;
  // Nueva variable para saber si el usuario está actualmente posicionado sobre una sección con snap
  let isInsideSnapped = false; 

  document.documentElement.style.scrollBehavior = "auto";

  // FUNCIÓN AUXILIAR: Obtiene el contenedor real (incluyendo el pin-spacer de GSAP si existe)
  const getRealContainer = (sec: HTMLElement) => {
    return sec.parentElement?.classList.contains("pin-spacer") 
      ? sec.parentElement 
      : sec;
  };

  // 1. UPDATE INDEX (Detecta dinámicamente si estamos en zona snap o zona libre)
  const updateIndex = () => {
    const scrollY = window.scrollY;
    const viewportCenter = scrollY + window.innerHeight / 2;
    let found = false;

    sections.forEach((sec, i) => {
      const container = getRealContainer(sec);
      const rect = container.getBoundingClientRect();
      const top = scrollY + rect.top;
      const bottom = scrollY + rect.bottom;

      // Si el centro de la pantalla está dentro de esta sección con snap
      if (viewportCenter >= top && viewportCenter <= bottom) {
        currentIndex = i;
        found = true;
      }
    });

    isInsideSnapped = found;
  };

  updateIndex();

  window.addEventListener("scroll", () => {
    if (!isAnimating) updateIndex();
  });

  // 2. IR A LA SECCIÓN (Con salto firme y cálculo exacto)
  const goToSection = (index: number, fromBottom: boolean = false) => {
    if (index < 0 || index >= sections.length) return;

    isAnimating = true;
    currentIndex = index;

    const targetSection = sections[index];
    const container = getRealContainer(targetSection);
    const rect = container.getBoundingClientRect();
    
    let targetY = window.scrollY + rect.top;

    if (fromBottom) {
      targetY = window.scrollY + rect.bottom - window.innerHeight;
    }

    gsap.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        setTimeout(() => {
          isAnimating = false;
          updateIndex(); // Forzar actualización al terminar la animación
        }, 50);
      },
    });
  };

  // --- EVENTO RATÓN / TRACKPAD ---
  window.addEventListener(
    "wheel",
    (e) => {
      if (isAnimating) {
        e.preventDefault();
        return;
      }

      // SI NO ESTAMOS EN UNA SECCIÓN CON SNAP, dejamos que el scroll sea 100% nativo y normal
      if (!isInsideSnapped) return;

      const currentSection = sections[currentIndex];
      const container = getRealContainer(currentSection);
      const rect = container.getBoundingClientRect();
      
      const isFirst = currentIndex === 0;
      const isLast = currentIndex === sections.length - 1;

      const direction = e.deltaY > 0 ? "DOWN" : "UP";
      const delta = e.deltaY; 

      if (direction === "DOWN" && !isLast) {
        // ¿Llegamos al final de la sección actual?
        if (rect.bottom - delta <= window.innerHeight + 5) {
          const nextSection = sections[currentIndex + 1];
          const nextContainer = getRealContainer(nextSection);
          const nextRect = nextContainer.getBoundingClientRect();
          
          // Calculamos la distancia física entre el final de esta sección y el principio de la otra
          const distanceToNext = nextRect.top - rect.bottom;

          // Si están juntas (menos de 50px de diferencia), hacemos el salto magnético
          if (distanceToNext < 50) {
            e.preventDefault(); 
            goToSection(currentIndex + 1, false);
          } 
          // Si hay más distancia, significa que hay componentes normales en medio.
          // NO hacemos preventDefault y dejamos que el navegador haga scroll nativo hacia abajo.
        }
      } 
      else if (direction === "UP" && !isFirst) {
        // ¿Llegamos al inicio de la sección actual?
        if (rect.top - delta >= -5) {
          const prevSection = sections[currentIndex - 1];
          const prevContainer = getRealContainer(prevSection);
          const prevRect = prevContainer.getBoundingClientRect();
          
          // Calculamos la distancia hacia arriba
          const distanceToPrev = rect.top - prevRect.bottom;

          // Si están juntas, hacemos el salto magnético hacia arriba
          if (distanceToPrev < 50) {
            e.preventDefault();
            goToSection(currentIndex - 1, true);
          }
          // Si hay componentes en medio, dejamos que suba de manera nativa y normal
        }
      }
    },
    { passive: false },
  );

  // --- EVENTO TÁCTIL (MÓVILES) ---
  let touchStartY = 0;
  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: false },
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (isAnimating) {
        e.preventDefault();
        return;
      }

      // Si estamos en zona común/libre, permitimos el comportamiento táctil nativo
      if (!isInsideSnapped) return;

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY; 

      const currentSection = sections[currentIndex];
      const container = getRealContainer(currentSection);
      const rect = container.getBoundingClientRect();

      if (Math.abs(deltaY) < 30) return; // Umbral mínimo para detectar gesto

      const direction = deltaY > 0 ? "DOWN" : "UP";
      const isFirst = currentIndex === 0;
      const isLast = currentIndex === sections.length - 1;

      if (direction === "DOWN" && !isLast) {
        if (rect.bottom - deltaY <= window.innerHeight + 5) {
          const nextSection = sections[currentIndex + 1];
          const nextContainer = getRealContainer(nextSection);
          const nextRect = nextContainer.getBoundingClientRect();
          const distanceToNext = nextRect.top - rect.bottom;

          if (distanceToNext < 50) {
            e.preventDefault();
            goToSection(currentIndex + 1, false);
          }
        }
      } else if (direction === "UP" && !isFirst) {
        if (rect.top - deltaY >= -5) {
          const prevSection = sections[currentIndex - 1];
          const prevContainer = getRealContainer(prevSection);
          const prevRect = prevContainer.getBoundingClientRect();
          const distanceToPrev = rect.top - prevRect.bottom;

          if (distanceToPrev < 50) {
            e.preventDefault();
            goToSection(currentIndex - 1, true);
          }
        }
      }
    },
    { passive: false },
  );
}