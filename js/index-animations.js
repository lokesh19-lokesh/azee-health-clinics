/**
 * AZEEHEALTH CLINICS — GSAP & Three.js Animation Controller
 * High-performance 3D Medical DNA & Cellular Vital Matrix Stage + GSAP ScrollTriggers
 * Designed for visual excellence and responsive precision on mobile and desktop.
 */

(function () {
  'use strict';

  // Check user motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // PART 1: THREE.JS — 3D MEDICAL DNA STAGE WITH DRAG/TOUCH ORBIT
  // ==========================================================================
  function initThreeHeroScene() {
    const canvas = document.getElementById('heroThreeCanvas');
    const stage = document.getElementById('hero3dStage');
    if (!canvas || !stage || typeof THREE === 'undefined') return;

    // Check WebGL availability
    try {
      const glTest = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!glTest) return;
    } catch (e) {
      return;
    }

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 13);

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Lighting — Clear medical illumination with specular highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(6, 10, 12);
    scene.add(keyLight);

    const tealLight = new THREE.PointLight(0x0A8F82, 2.8, 30);
    tealLight.position.set(-6, -3, 8);
    scene.add(tealLight);

    const blueLight = new THREE.PointLight(0x082C4A, 2.2, 30);
    blueLight.position.set(6, -6, 8);
    scene.add(blueLight);

    // 4. DNA Double Helix Master Group
    const helixGroup = new THREE.Group();
    scene.add(helixGroup);
    window._azeeHelixGroup = helixGroup;

    // Dimensions
    const numPairs = 30;
    const helixRadius = 2.1;
    const helixPitch = 0.58;
    const sphereRadius = 0.23;

    // Shared Geometries
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 16, 16);
    const smallNodeGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const rungGeo = new THREE.CylinderGeometry(0.045, 0.045, 1, 8);

    // High-Contrast Shaded Materials (AzeeHealth Palette)
    const tealMat = new THREE.MeshPhongMaterial({
      color: 0x0A8F82,
      specular: 0x5EEAD4,
      shininess: 95
    });

    const sageMat = new THREE.MeshPhongMaterial({
      color: 0x3D704D,
      specular: 0xA7F3D0,
      shininess: 85
    });

    const navyMat = new THREE.MeshPhongMaterial({
      color: 0x082C4A,
      specular: 0x60A5FA,
      shininess: 90
    });

    const goldMat = new THREE.MeshPhongMaterial({
      color: 0xD97706,
      specular: 0xFDE68A,
      shininess: 95
    });

    const rungMat = new THREE.MeshPhongMaterial({
      color: 0x0284C7,
      transparent: true,
      opacity: 0.8,
      shininess: 70
    });

    // Assemble DNA Structure
    for (let i = 0; i < numPairs; i++) {
      const angle = (i * 0.4);
      const y = (i - numPairs / 2) * helixPitch;

      // Position Strand 1
      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;

      // Position Strand 2 (180 deg opposite)
      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;

      // Strand 1 node
      const node1 = new THREE.Mesh(sphereGeo, i % 2 === 0 ? tealMat : navyMat);
      node1.position.set(x1, y, z1);
      helixGroup.add(node1);

      // Strand 2 node
      const node2 = new THREE.Mesh(sphereGeo, i % 2 === 0 ? sageMat : goldMat);
      node2.position.set(x2, y, z2);
      helixGroup.add(node2);

      // Connecting Base Rung
      const p1 = new THREE.Vector3(x1, y, z1);
      const p2 = new THREE.Vector3(x2, y, z2);
      const dist = p1.distanceTo(p2);

      const rung = new THREE.Mesh(rungGeo, rungMat);
      rung.scale.set(1, dist, 1);
      rung.position.copy(p1).add(p2).multiplyScalar(0.5);
      rung.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      helixGroup.add(rung);

      // Center hydrogen bond sphere
      if (i % 2 === 0) {
        const centerNode = new THREE.Mesh(smallNodeGeo, goldMat);
        centerNode.position.copy(p1).add(p2).multiplyScalar(0.5);
        helixGroup.add(centerNode);
      }
    }

    // 5. Diagnostic Gyro Orbital Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x0A8F82,
      transparent: true,
      opacity: 0.4,
      wireframe: true
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.03, 8, 48), ringMat1);
    ring1.rotation.x = Math.PI / 3;
    helixGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x3D704D,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.9, 0.03, 8, 48), ringMat2);
    ring2.rotation.y = Math.PI / 4;
    helixGroup.add(ring2);

    // 6. Ambient Vitality Molecular Particles inside Stage
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Circular glowing particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(10, 143, 130, 0.95)');
    grad.addColorStop(0.5, 'rgba(61, 112, 77, 0.6)');
    grad.addColorStop(1, 'rgba(8, 44, 74, 0)');
    pCtx.fillStyle = grad;
    pCtx.beginPath();
    pCtx.arc(16, 16, 16, 0, Math.PI * 2);
    pCtx.fill();

    const pTex = new THREE.CanvasTexture(pCanvas);
    const pMat = new THREE.PointsMaterial({
      size: 0.48,
      map: pTex,
      transparent: true,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, pMat);
    scene.add(particles);

    // 7. Responsive Positioning Inside Stage
    function updateResponsiveScene() {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (width === 0 || height === 0) return;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      helixGroup.position.set(0, 0, 0);

      if (width >= 992) {
        // Desktop
        helixGroup.scale.set(0.88, 0.88, 0.88);
        helixGroup.rotation.z = -0.22;
        camera.position.z = 13;
      } else if (width >= 576) {
        // Tablet
        helixGroup.scale.set(0.78, 0.78, 0.78);
        helixGroup.rotation.z = -0.18;
        camera.position.z = 13.5;
      } else {
        // Mobile
        helixGroup.scale.set(0.68, 0.68, 0.68);
        helixGroup.rotation.z = -0.15;
        camera.position.z = 14;
      }
    }

    window.addEventListener('resize', updateResponsiveScene, { passive: true });
    updateResponsiveScene();

    // 8. Interactive Drag / Hover Interaction on Stage
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const canvasContainer = document.getElementById('heroCanvasContainer') || stage;

    function onPointerDown(e) {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      prevPointerX = clientX;
      prevPointerY = clientY;
    }

    function onPointerMove(e) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevPointerX;
        const deltaY = clientY - prevPointerY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.006;
        prevPointerX = clientX;
        prevPointerY = clientY;
      } else {
        // Subtle hover tilt
        const rect = stage.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetRotX = normY * 0.25;
      }
    }

    function onPointerUp() {
      isDragging = false;
    }

    canvasContainer.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);

    canvasContainer.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 9. Animation Loop with Intersection Observer
    let isVisible = true;
    let animationFrameId = null;
    let clock = new THREE.Clock();

    function animate() {
      if (!isVisible) return;

      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Continuous gentle auto-spin
      targetRotY += 0.007;

      // Smooth inertia damping
      helixGroup.rotation.y += (targetRotY - helixGroup.rotation.y) * 0.05;
      helixGroup.rotation.x += (targetRotX - helixGroup.rotation.x) * 0.05;

      // Rotate orbital rings
      ring1.rotation.z = elapsedTime * 0.22;
      ring2.rotation.z = -elapsedTime * 0.18;

      // Gentle vertical float
      helixGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;

      // Rotate ambient particles
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.06;

      renderer.render(scene, camera);
    }

    // 10. Pause rendering when out of viewport to save battery & GPU
    const heroSection = document.getElementById('heroHomeSection');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            clock.start();
            animate();
          }
        } else {
          isVisible = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      });
    }, { threshold: 0.05 });

    if (heroSection) observer.observe(heroSection);
    animate();
  }

  // ==========================================================================
  // PART 2: GSAP & SCROLLTRIGGER — CRISP ANIMATION TIMELINES
  // ==========================================================================
  function initGsapAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    document.body.classList.add('has-gsap');

    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-fade-up').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // ------------------------------------------------------------------------
    // 1. Hero Entrance Timeline
    // ------------------------------------------------------------------------
    const heroTl = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      }
    });

    heroTl
      .fromTo('.hero-content .section-eyebrow',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.55 }
      )
      .fromTo('.hero-heading',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3'
      )
      .fromTo('.hero-text',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.35'
      )
      .fromTo('.hero-cta-group .btn',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.55, ease: 'back.out(1.4)' },
        '-=0.3'
      )
      .fromTo('.hero-highlights-list .badge',
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, stagger: 0.08, duration: 0.45 },
        '-=0.25'
      )
      .fromTo('.hero-trust-badge',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      )
      .fromTo('#hero3dStage',
        { opacity: 0, scale: 0.94, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.7'
      )
      .fromTo('#floatingHeroCardTop',
        { opacity: 0, scale: 0.85, x: 20 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.55,
          ease: 'back.out(1.5)',
          onComplete: () => {
            gsap.to('#floatingHeroCardTop', {
              y: -8,
              duration: 2.8,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1
            });
          }
        },
        '-=0.3'
      )
      .fromTo('#floatingHeroCardBottom',
        { opacity: 0, scale: 0.85, x: -20 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.55,
          ease: 'back.out(1.5)',
          onComplete: () => {
            gsap.to('#floatingHeroCardBottom', {
              y: -7,
              duration: 3.2,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              delay: 0.4
            });
          }
        },
        '-=0.3'
      );

    if (typeof ScrollTrigger === 'undefined') return;

    // ------------------------------------------------------------------------
    // 2. Hero Scrub — 3D DNA rotation smoothly driven by page scroll
    // ------------------------------------------------------------------------
    ScrollTrigger.create({
      trigger: '#heroHomeSection',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        if (window._azeeHelixGroup) {
          window._azeeHelixGroup.rotation.y += self.getVelocity() * 0.00015;
        }
      }
    });

    // ------------------------------------------------------------------------
    // 3. Quick Services Cards (Section 2)
    // ------------------------------------------------------------------------
    gsap.fromTo('#quickServicesSection .quick-service-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#quickServicesSection',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Card icon hover micro-animation
    document.querySelectorAll('.quick-service-card').forEach(card => {
      const icon = card.querySelector('.card-icon-box');
      if (icon) {
        card.addEventListener('mouseenter', () => {
          gsap.to(icon, { scale: 1.12, rotate: 3, duration: 0.3, ease: 'back.out(2)' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(icon, { scale: 1, rotate: 0, duration: 0.25, ease: 'power2.out' });
        });
      }
    });

    // ------------------------------------------------------------------------
    // 4. Clinical Excellence / About Section (Section 3)
    // ------------------------------------------------------------------------
    gsap.fromTo('#aboutExcellenceSection .feature-pill-item',
      { opacity: 0, x: -25 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#aboutExcellenceSection',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Facility image parallax
    const excellenceImg = document.querySelector('#aboutExcellenceSection .hero-image-frame');
    if (excellenceImg) {
      gsap.to(excellenceImg, {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#aboutExcellenceSection',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    }

    // ------------------------------------------------------------------------
    // 5. Statistics / Trust Metrics Counters (Section 4)
    // ------------------------------------------------------------------------
    document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const counterObj = { val: 0 };

      gsap.to(counterObj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          counter.textContent = prefix + Math.floor(counterObj.val).toLocaleString() + suffix;
        }
      });
    });

    // ------------------------------------------------------------------------
    // 6. "Our Departments" Bento Grid (Section 5)
    // ------------------------------------------------------------------------
    gsap.fromTo('.dept-bento-grid .dept-card',
      { opacity: 0, y: 35, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#departmentsSection',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Department SVG illustration micro-animation on hover
    document.querySelectorAll('.dept-card').forEach(card => {
      const icon = card.querySelector('.dept-illustration');
      if (icon) {
        card.addEventListener('mouseenter', () => {
          gsap.to(icon, { scale: 1.12, rotate: 2, duration: 0.35, ease: 'back.out(2)' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' });
        });
      }
    });

    // ------------------------------------------------------------------------
    // 7. Why Choose Us (Section 6)
    // ------------------------------------------------------------------------
    gsap.fromTo('#whyChooseUsSection .why-choose-card',
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#whyChooseUsSection',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );

    // ------------------------------------------------------------------------
    // 8. Specialist Doctors (Section 7)
    // ------------------------------------------------------------------------
    gsap.fromTo('#doctorsSection .doctor-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#doctorsSection',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );

    // ------------------------------------------------------------------------
    // 9. Facilities & Technology (Section 8)
    // ------------------------------------------------------------------------
    gsap.fromTo('#facilitiesSection .facility-item',
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#facilitiesSection',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );

    // ------------------------------------------------------------------------
    // 10. Testimonials & FAQ (Section 9)
    // ------------------------------------------------------------------------
    gsap.fromTo('#testimonialsSection .testimonial-card',
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#testimonialsSection',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );

    // ------------------------------------------------------------------------
    // 11. Final Appointment CTA Banner (Section 10)
    // ------------------------------------------------------------------------
    const ctaBanner = document.querySelector('.cta-banner-wrapper');
    if (ctaBanner) {
      gsap.fromTo(ctaBanner,
        { opacity: 0, scale: 0.96, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaBanner,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Refresh ScrollTrigger after full window load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initThreeHeroScene();
      initGsapAnimations();
    });
  } else {
    initThreeHeroScene();
    initGsapAnimations();
  }
})();
