import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

let registered = false;

export function registerGSAP() {
  if (typeof window !== "undefined" && !registered) {
    gsap.registerPlugin(ScrollTrigger, Flip);
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
}

// Auto-register in browser environment
if (typeof window !== "undefined") {
  registerGSAP();
}

export { gsap, ScrollTrigger, Flip };

