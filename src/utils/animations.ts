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