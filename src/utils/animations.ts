// src/utils/animations.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 1. Registrar el plugin (Seguro para SSR)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 2. Exportar las herramientas por si las necesitas directamente
export { gsap, ScrollTrigger };

// 3. Tus funciones de animación centralizadas y reutilizables
export const initAnimations = () => {
  
  
  // Puedes agregar más inicializadores globales aquí abajo...
};

// 4. Función para inicializar animaciones de la sección Confidence
export const initConfidenceAnimations = () => {
  if (typeof window === 'undefined') return;

  // Buscar la sección Confidence (buscar por los elementos internos)
  const firstTitle = document.querySelector('.js-first-title');
  if (!firstTitle) return;

  // Obtener la sección padre
  const confidenceSection = firstTitle.closest('section');
  if (!confidenceSection) return;

  // Elementos de la animación
  const secondTitle = confidenceSection.querySelector('.js-second-title') as HTMLElement;
  const image = confidenceSection.querySelector('.js-image') as HTMLElement;
  const content = confidenceSection.querySelector('.js-content') as HTMLElement;

  // Estados iniciales
  if (firstTitle) {
    gsap.set(firstTitle, { y: 80, scale: 2, opacity: 0 });
  }
  if (secondTitle) {
    gsap.set(secondTitle, { opacity: 0 });
  }
  if (image) {
    gsap.set(image, { y: 200, width: '100%', opacity: 0 });
  }
  if (content) {
    gsap.set(content, { opacity: 0, y: 30 });
  }

  // Crear timeline con ScrollTrigger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: confidenceSection,
      start: 'top center',
      end: 'center center',
      scrub: 1,
      markers: false, // Cambiar a true para debug
    }
  });

  // Animación 1: Primera sección aparece (curtain rising effect)
  // La sección sube desde abajo
  tl.to(confidenceSection, {
    y: -100,
    duration: 1,
    opacity: 1
  }, 0);

  // Animación 2: Primer título se mueve hacia arriba y cambia escala de 2 a 1
  if (firstTitle) {
    tl.to(firstTitle, {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1
    }, 0);
  }

  // Crear segunda timeline para la continuación del scroll
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: confidenceSection,
      start: 'center center',
      end: 'bottom center',
      scrub: 1,
      markers: false,
    }
  });

  // Animación 3: Segundo título aparece (opacity 0 a 1)
  if (secondTitle) {
    tl2.to(secondTitle, {
      opacity: 1,
      duration: 0.8
    }, 0);
  }

  // Animación 4: Imagen se mueve desde abajo hacia arriba, cambiando tamaño
  if (image) {
    tl2.to(image, {
      y: -300,
      width: '30%',
      opacity: 1,
      duration: 1
    }, 0);

    // Continuar movimiento hacia arriba hasta desaparecer
    tl2.to(image, {
      y: -600,
      opacity: 0,
      duration: 0.6
    }, 0.4);
  }

  // Opcional: Animar el contenido
  if (content) {
    tl.to(content, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, 0.2);
  }
};