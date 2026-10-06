/**
 * AZEEHEALTH CLINICS - Main Interactive JavaScript
 * Precision | Care | Well Being
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Current Year in Footer
  // ------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------------------------------
  // 2. Active Nav Link Detection
  // ------------------------------------------------------------------------
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Normalize and compare
      const linkFile = href.split('/').pop() || 'index.html';
      const currentFile = currentPath.split('/').pop() || 'index.html';
      
      if (linkFile === currentFile || (currentFile === '' && linkFile === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    }
  });

  // ------------------------------------------------------------------------
  // 3. Sticky Navbar & Background Change on Scroll
  // ------------------------------------------------------------------------
  const header = document.querySelector('.site-header') || document.querySelector('header');
  const navbar = document.querySelector('.navbar-custom');
  const backToTopBtn = document.getElementById('backToTopBtn');

  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;

    if (navbar) {
      if (scrollY > 20) {
        navbar.classList.add('scrolled');
        if (header) header.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
        if (header) header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. Mobile Navigation Auto-close on link click
  // ------------------------------------------------------------------------
  const navbarCollapse = document.getElementById('navbarMainMenu');
  const navItems = document.querySelectorAll('.navbar-nav .nav-link');
  
  if (navbarCollapse) {
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 5. Scroll Reveal Animations (Intersection Observer)
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Immediate check for elements already near viewport
    setTimeout(() => {
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 50) {
          el.classList.add('active');
        }
      });
    }, 50);
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ------------------------------------------------------------------------
  // 6. Animated Statistics Counters
  // ------------------------------------------------------------------------
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          const prefix = counter.getAttribute('data-prefix') || '';
          const duration = 1800; // ms
          const stepTime = 20; // ms
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = prefix + target.toLocaleString() + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
            }
          }, stepTime);

          observer.unobserve(counter);
        }
      });
    }, {
      threshold: 0.25
    });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ------------------------------------------------------------------------
  // 7. Structured Doctors Data & Filtering
  // ------------------------------------------------------------------------
  const doctorsData = [
    {
      id: 'dr-ananya-rao',
      name: 'Dr. Ananya Rao',
      specialty: "General Medicine",
      titleRole: "Consultant Physician & Preventive Medicine Specialist",
      qualification: 'MBBS, MD (General Medicine), Fellowship in Diabetes Care',
      experience: '12+ Years Experience',
      image: 'images/doctors/dr-ananya-rao.jpg',
      category: 'general-medicine',
      about: 'Dr. Ananya Rao is an experienced Consultant Physician specializing in internal medicine, comprehensive diabetes management, hypertension, and adult preventive healthcare. She believes in holistic, precision-guided patient evaluation to prevent chronic diseases.',
      expertise: ['Adult Internal Medicine', 'Diabetes & Hypertension Management', 'Preventive Health Assessments', 'Cardiometabolic Risk Profiling', 'Geriatric Care'],
      schedule: 'Mon, Wed, Fri: 9:00 AM – 2:00 PM | Tue, Thu, Sat: 3:00 PM – 7:00 PM'
    },
    {
      id: 'dr-rahul-varma',
      name: 'Dr. Rahul Varma',
      specialty: 'Surgery',
      titleRole: 'Senior Consultant General & Laparoscopic Surgeon',
      qualification: 'MBBS, MS (General Surgery), FMAS, FIAGES',
      experience: '15+ Years Experience',
      image: 'images/doctors/dr-rahul-varma.jpg',
      category: 'surgery',
      about: 'Dr. Rahul Varma has performed thousands of successful minimally invasive laparoscopic and day-care surgical procedures. His clinical approach focuses on rapid patient recovery, minimal postoperative discomfort, and patient-centered surgical counseling.',
      expertise: ['Advanced Laparoscopic Surgery', 'Hernia & Gallbladder Procedures', 'Day-Care Minor Surgery', 'Anorectal Surgery (Laser/Minimally Invasive)', 'Post-Operative Rehabilitation'],
      schedule: 'Mon to Sat: 10:00 AM – 4:00 PM'
    },
    {
      id: 'dr-priya-sharma',
      name: 'Dr. Priya Sharma',
      specialty: "Women's Health",
      titleRole: "Consultant Obstetrician & Women's Health Specialist",
      qualification: 'MBBS, MS (OBG), Fellowship in Reproductive Medicine',
      experience: '11+ Years Experience',
      image: 'images/doctors/dr-priya-sharma.jpg',
      category: 'womens-health',
      about: 'Dr. Priya Sharma provides personalized, compassionate clinical care across every phase of womanhood. She specializes in maternal health, adolescent gynecology, PCOS management, fertility counseling, and menopause wellness.',
      expertise: ['Maternal Wellness & Antenatal Care', 'PCOS & Hormonal Health', 'Adolescent & Menopause Care', 'Well-Woman Health Screening', 'Minimally Invasive Gynecological Procedures'],
      schedule: 'Mon, Wed, Thu, Sat: 10:00 AM – 3:30 PM | Fri: 4:00 PM – 7:00 PM'
    },
    {
      id: 'dr-arjun-reddy',
      name: 'Dr. Arjun Reddy',
      specialty: 'Orthopaedics',
      titleRole: 'Senior Consultant Orthopaedic & Joint Specialist',
      qualification: 'MBBS, MS (Orthopaedics), Fellowship in Joint Reconstruction',
      experience: '14+ Years Experience',
      image: 'images/doctors/dr-arjun-reddy.jpg',
      category: 'orthopaedics',
      about: 'Dr. Arjun Reddy has extensive clinical expertise in diagnosing and managing musculoskeletal conditions, sports injuries, arthritis, and spine health. He emphasizes conservative non-surgical rehabilitation alongside modern day-care interventions.',
      expertise: ['Arthritis & Joint Pain Management', 'Sports Injury Rehabilitation', 'Spine & Postural Disorders', 'Intra-articular Injections & PRP Therapy', 'Fracture & Trauma Care'],
      schedule: 'Tue, Thu, Sat: 10:00 AM – 2:00 PM | Mon, Wed, Fri: 4:00 PM – 7:30 PM'
    }
  ];

  // Doctors Filter Buttons Logic (on doctors.html)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const doctorCards = document.querySelectorAll('.doctor-item-col');

  if (filterButtons.length > 0 && doctorCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        doctorCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // Doctor Profile Modal Population
  const doctorModal = document.getElementById('doctorProfileModal');
  if (doctorModal) {
    doctorModal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      if (!button) return;
      const doctorId = button.getAttribute('data-doctor-id');
      const doctor = doctorsData.find(d => d.id === doctorId);

      if (doctor) {
        document.getElementById('modalDocName').textContent = doctor.name;
        document.getElementById('modalDocSpecialty').textContent = doctor.titleRole;
        document.getElementById('modalDocQual').textContent = doctor.qualification;
        document.getElementById('modalDocExp').textContent = doctor.experience;
        document.getElementById('modalDocAbout').textContent = doctor.about;
        document.getElementById('modalDocSchedule').textContent = doctor.schedule;
        
        const imgEl = document.getElementById('modalDocImg');
        imgEl.src = doctor.image;
        imgEl.alt = `${doctor.name} - ${doctor.specialty}`;

        // Populate expertise tags
        const expertiseContainer = document.getElementById('modalDocExpertise');
        expertiseContainer.innerHTML = '';
        doctor.expertise.forEach(item => {
          const tag = document.createElement('span');
          tag.className = 'expertise-tag';
          tag.textContent = item;
          expertiseContainer.appendChild(tag);
        });

        // Set appointment button link/param
        const modalBookBtn = document.getElementById('modalDocBookBtn');
        if (modalBookBtn) {
          modalBookBtn.setAttribute('data-preselect-doctor', doctor.name);
          modalBookBtn.setAttribute('data-preselect-dept', doctor.specialty);
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 8. Structured Services Data & Service Detail Modal
  // ------------------------------------------------------------------------
  const servicesData = {
    'medical-consultation': {
      title: 'Medical Consultation',
      icon: 'bi-clipboard2-pulse',
      tagline: 'Comprehensive primary care focused on your individual health needs',
      overview: 'Our Medical Consultation service offers in-depth clinical evaluations by experienced physicians. We address acute illnesses, chronic lifestyle conditions, and general wellness with scientific precision and compassionate care.',
      offer: [
        'Detailed medical history review and head-to-toe physical examination',
        'Diagnosis and evidence-based management of acute and chronic health conditions',
        'Preventive health counseling and cardiovascular risk profiling',
        'Personalized health roadmaps and prescription optimization'
      ],
      who: 'Adults, seniors, and families seeking professional, patient-centered diagnosis and continuous primary medical supervision.',
      whyAzee: 'Unrushed consultations with experienced doctors who listen thoroughly, accurate diagnostic coordination, and clear personalized treatment plans.'
    },
    'specialist-consultation': {
      title: 'Specialist Consultation',
      icon: 'bi-person-badge',
      tagline: 'Direct access to senior medical specialists across core disciplines',
      overview: 'AzeeHealth Clinics brings specialized clinical expertise under one roof, connecting patients with experienced surgeons, gynecologists, orthopaedic specialists, and physicians without hospital queues.',
      offer: [
        'Advanced specialist consultations in Surgery, Gynecology, and Orthopaedics',
        'Second medical opinions and detailed surgical pre-operative evaluations',
        'Non-invasive therapy planning and specialized medication protocols',
        'Collaborative multidisciplinary care review for complex medical cases'
      ],
      who: 'Patients needing targeted evaluation for specific health disorders, joint pains, surgical consultations, or women’s reproductive health.',
      whyAzee: 'Renowned specialists with 10+ years experience, dedicated consultation suites, and seamless continuity between diagnosis and treatment.'
    },
    'preventive-healthcare': {
      title: 'Preventive Healthcare',
      icon: 'bi-shield-check',
      tagline: 'Proactive health screenings designed to protect your long-term vitality',
      overview: 'Preventive healthcare is at the very core of AzeeHealth Clinics. We believe the best healthcare identifies potential health vulnerabilities before symptoms emerge.',
      offer: [
        'Age and gender-tailored comprehensive health checkup packages',
        'Cardiovascular, diabetes, lipid, and metabolic risk assessments',
        'Cancer screening markers and lifestyle risk audits',
        'Nutritional guidance and chronic condition prevention roadmaps'
      ],
      who: 'Proactive individuals, working professionals, and seniors seeking to safeguard their wellness and detect medical conditions early.',
      whyAzee: 'Precision diagnostics, physician-led result interpretation, and practical lifestyle modifications tailored to your life.'
    },
    'clinical-procedures': {
      title: 'Clinical Procedures',
      icon: 'bi-bandaid',
      tagline: 'Safe, professionally managed minor and day-care clinical procedures',
      overview: 'Our sterile minor procedure suites are equipped for safe, day-care clinical procedures performed under strict hygiene protocols and clinical safety standards.',
      offer: [
        'Minor surgical excisions, suturing, and wound care management',
        'Joint injections, aspiration, and orthopaedic day procedures',
        'Sterile dressing changes, abscess drainage, and biopsy sampling',
        'Post-procedure monitoring in comfortable recovery bays'
      ],
      who: 'Patients requiring immediate or scheduled minor interventions without the delay or stress of prolonged hospital admission.',
      whyAzee: 'NABH-aligned sterile protocols, compassionate surgical team, painless administration techniques, and rapid discharge.'
    },
    'pharmacy': {
      title: 'Pharmacy Services',
      icon: 'bi-capsule',
      tagline: 'Trusted dispensary ensuring authentic medications and pharmacist guidance',
      overview: 'Our in-house pharmacy ensures prompt, seamless access to 100% genuine medications, prescription drugs, clinical consumables, and wellness supplements directly after your doctor’s appointment.',
      offer: [
        'Comprehensive inventory of genuine prescription and OTC pharmaceuticals',
        'Pharmacist medication reviews and dosage counseling',
        'Medication refilling reminders and personalized medicine organizers',
        'Temperature-controlled storage ensuring optimal drug efficacy'
      ],
      who: 'Clinic patients, neighborhood residents, and families needing reliable medicine dispensing and clear usage guidance.',
      whyAzee: 'Certified medications sourced directly from verified manufacturers, zero counterfeit risk, and personalized pharmacist counseling.'
    },
    'day-care': {
      title: 'Day Care Services',
      icon: 'bi-hospital',
      tagline: 'Restorative clinical observation and day procedures in comfort',
      overview: 'AzeeHealth Day Care provides comfortable, observation suites equipped with electronic vital monitoring and dedicated nursing care for short-stay treatments.',
      offer: [
        'Intravenous fluid infusions, antibiotic administration, and pain therapies',
        'Post-procedural recovery in quiet, ergonomic patient bays',
        'Continuous vital sign telemetry and dedicated nurse assistance',
        'Same-day discharge with clear recovery protocols'
      ],
      who: 'Patients needing intravenous therapy, post-minor procedure recovery, or medical observation during acute illness.',
      whyAzee: 'Tranquil boutique ambiance, high nurse-to-patient ratio, attentive clinical monitoring, and no overnight hospital stay required.'
    },
    'health-checkups': {
      title: 'Health Checkups',
      icon: 'bi-heart-pulse',
      tagline: 'Customized wellness packages for proactive well-being',
      overview: 'Structured health screening packages designed for every life stage, combining pathology tests, physical examination, and doctor consultation.',
      offer: [
        'Basic, Comprehensive, and Senior Citizen Health Screening Packages',
        'Executive Health Assessments with liver, kidney, cardiac, and lipid profiles',
        'Women’s Wellness Screening including hormonal and bone health',
        'Doctor consultation included with every package to explain findings'
      ],
      who: 'Individuals and corporate teams looking for regular annual health audits.',
      whyAzee: 'Clear, easy-to-understand reports, fast turnaround, and practical medical advice.'
    },
    'diagnostic-support': {
      title: 'Diagnostic Support',
      icon: 'bi-activity',
      tagline: 'Accurate clinical diagnostics underpinning precision treatments',
      overview: 'High-precision diagnostic testing that forms the backbone of reliable medical decision-making at AzeeHealth Clinics.',
      offer: [
        'Complete pathology, haematology, and biochemistry blood work',
        'Digital ECG and cardiac risk screening',
        'Urine and stool routine clinical diagnostics',
        'Rapid sample turnaround and digital report delivery'
      ],
      whyAzee: 'Quality-controlled diagnostic partner laboratories, clinical verification by senior doctors, and seamless digital record storage.'
    }
  };

  // Service Detail Modal Population
  const serviceModal = document.getElementById('serviceDetailModal');
  if (serviceModal) {
    serviceModal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      if (!button) return;
      const serviceKey = button.getAttribute('data-service-key');
      const service = servicesData[serviceKey];

      if (service) {
        document.getElementById('modalServiceTitle').textContent = service.title;
        document.getElementById('modalServiceTagline').textContent = service.tagline;
        document.getElementById('modalServiceOverview').textContent = service.overview;
        
        const offersList = document.getElementById('modalServiceOffers');
        offersList.innerHTML = '';
        if (service.offer && service.offer.length > 0) {
          service.offer.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="bi bi-check-circle-fill text-sage me-2"></i> ${item}`;
            offersList.appendChild(li);
          });
        }

        const whoEl = document.getElementById('modalServiceWho');
        if (whoEl) {
          whoEl.textContent = service.who || 'Individuals seeking expert, focused medical care.';
        }

        const whyEl = document.getElementById('modalServiceWhy');
        if (whyEl) {
          whyEl.textContent = service.whyAzee;
        }

        const bookBtn = document.getElementById('modalServiceBookBtn');
        if (bookBtn) {
          bookBtn.setAttribute('data-preselect-dept', service.title);
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 9. Global Appointment Modal & Pre-selection Triggers
  // ------------------------------------------------------------------------
  const appointmentModal = document.getElementById('appointmentModal');
  if (appointmentModal) {
    appointmentModal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      if (!button) return;

      const preselectDoc = button.getAttribute('data-preselect-doctor');
      const preselectDept = button.getAttribute('data-preselect-dept');

      const doctorSelect = document.getElementById('modalAppointmentDoctor');
      const deptSelect = document.getElementById('modalAppointmentDept');

      if (doctorSelect && preselectDoc) {
        for (let i = 0; i < doctorSelect.options.length; i++) {
          if (doctorSelect.options[i].text.toLowerCase().includes(preselectDoc.toLowerCase())) {
            doctorSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (deptSelect && preselectDept) {
        for (let i = 0; i < deptSelect.options.length; i++) {
          if (deptSelect.options[i].text.toLowerCase().includes(preselectDept.toLowerCase())) {
            deptSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 10. Form Validation & Submission Handling (Accessible & Robust)
  // ------------------------------------------------------------------------
  const setupFormValidation = (formId, alertSuccessId, alertErrorId) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const successAlert = document.getElementById(alertSuccessId);
      const errorAlert = document.getElementById(alertErrorId);

      // Hide prior alerts
      if (successAlert) successAlert.classList.add('d-none');
      if (errorAlert) errorAlert.classList.add('d-none');

      let isValid = true;
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

      inputs.forEach(input => {
        // Validate each required input
        if (!input.checkValidity()) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          // Additional custom phone check if type is tel
          if (input.type === 'tel') {
            const phoneVal = input.value.trim().replace(/[^0-9+]/g, '');
            if (phoneVal.length < 8) {
              input.classList.add('is-invalid');
              isValid = false;
              return;
            }
          }
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }

        // Live validation on blur/input
        input.addEventListener('input', () => {
          if (input.checkValidity()) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
          }
        }, { once: true });
      });

      if (!isValid) {
        form.classList.add('was-validated');
        if (errorAlert) {
          errorAlert.classList.remove('d-none');
          errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      // Simulate successful submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing Request...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        form.reset();
        form.classList.remove('was-validated');
        form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

        if (successAlert) {
          successAlert.classList.remove('d-none');
          successAlert.focus();
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // If inside modal, keep visible or close after gentle delay
      }, 750);
    });
  };

  // Initialize validation on contact form and modal appointment form
  setupFormValidation('appointmentContactForm', 'contactSuccessAlert', 'contactErrorAlert');
  setupFormValidation('modalAppointmentForm', 'modalSuccessAlert', 'modalErrorAlert');

  // Set min date for date inputs to today
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(dateInput => {
    dateInput.setAttribute('min', today);
  });
});
