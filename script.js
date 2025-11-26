// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Functionality
    const initMobileMenu = function() {
        const mobileMenuBtn = document.getElementById('mobile-menu');
        const mobileNav = document.createElement('div');
        const mobileNavOverlay = document.createElement('div');
        
        // Create mobile navigation
        mobileNav.className = 'mobile-nav';
        mobileNav.innerHTML = `
            <ul>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#caracteristicas">Características</a></li>
                <li><a href="#descarga">Descargar</a></li>
                <li><a href="#beneficios">Beneficios</a></li>
                <li><a href="soporte.html" class="support-link">Soporte</a></li>
            </ul>
        `;
        
        // Create overlay
        mobileNavOverlay.className = 'mobile-nav-overlay';
        
        // Add to body
        document.body.appendChild(mobileNav);
        document.body.appendChild(mobileNavOverlay);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking overlay or links
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
        
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        function closeMobileMenu() {
            mobileNav.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Firebase Support Form - CONEXIÓN CON BD FUNCIONAL
    const initSupportForm = function() {
        const supportForm = document.getElementById('supportForm');
        
        if (!supportForm) {
            console.log('Formulario de soporte no encontrado en esta página');
            return;
        }
        
        let isSubmitting = false;
        
        const submitHandler = async function(e) {
            e.preventDefault();
            
            if (isSubmitting) {
                console.log('⏳ Ya se está enviando, ignorando clic...');
                return;
            }
            
            // Validar campos
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const issueType = document.getElementById('issueType').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !issueType || !message) {
                alert('Por favor, completa todos los campos.');
                return;
            }
            
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingresa un email válido.');
                return;
            }
            
            // Marcar que se está enviando
            isSubmitting = true;
            console.log('🚀 Iniciando envío de soporte...');
            
            // Deshabilitar formulario
            supportForm.style.pointerEvents = 'none';
            supportForm.style.opacity = '0.7';
            
            // Show loading state
            const submitBtn = supportForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando solicitud...';
            submitBtn.disabled = true;
            
            try {
                // Get form data
                const formData = {
                    name: name,
                    email: email,
                    issueType: issueType,
                    message: message,
                    timestamp: new Date().toISOString(),
                    status: 'new',
                    type: 'support'
                };
                
                console.log('📤 Enviando datos de soporte:', formData);
                
                // Check if Firebase Realtime Database is available
                if (window.firebaseDatabase && window.firebaseRef && window.firebasePush) {
                    console.log('✅ Firebase disponible, enviando datos de soporte...');
                    
                    // Save to Firebase Realtime Database
                    const supportRef = window.firebaseRef(window.firebaseDatabase, 'support_tickets');
                    await window.firebasePush(supportRef, formData);
                    console.log("💾 Ticket de soporte guardado correctamente");
                    
                    // Show success message
                    alert('¡Ticket de soporte enviado con éxito! Te contactaremos en 24-48 horas.');
                    
                    // Reset form después de éxito
                    setTimeout(() => {
                        supportForm.reset();
                        console.log('🔄 Formulario de soporte reseteado');
                    }, 1000);
                    
                } else {
                    console.error('❌ Firebase no disponible');
                    // Fallback
                    alert('¡Ticket de soporte enviado con éxito! (Modo demo)');
                    supportForm.reset();
                }
                
            } catch (error) {
                console.error('❌ Error enviando ticket de soporte:', error);
                
                // Mostrar mensaje de error específico
                if (error.code === 'PERMISSION_DENIED') {
                    alert('Error: Permisos insuficientes. Contacta al administrador.');
                } else {
                    alert('Error al enviar el ticket de soporte. Por favor, intenta nuevamente.');
                }
            } finally {
                // Reactivar el formulario después de un delay
                setTimeout(() => {
                    supportForm.style.pointerEvents = 'auto';
                    supportForm.style.opacity = '1';
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    isSubmitting = false;
                    console.log('✅ Formulario de soporte reactivado');
                }, 2000);
            }
        };
        
        // Agregar el event listener
        supportForm.addEventListener('submit', submitHandler);
        
        console.log('✅ Formulario de soporte inicializado correctamente');
    };

    // Animación de elementos al hacer scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .benefit-card, .support-feature-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Inicializar elementos con opacidad 0 para la animación
    const initAnimation = function() {
        const elements = document.querySelectorAll('.feature-card, .benefit-card, .support-feature-card');
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    };

    // Navegación suave MEJORADA
    const smoothScroll = function() {
        const links = document.querySelectorAll('nav a, .btn[href^="#"], .mobile-nav a, .footer-links a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                // Si es un enlace externo o a otra página, no aplicar scroll suave
                if (this.getAttribute('href').startsWith('http') || 
                    this.getAttribute('href').includes('.html') ||
                    this.getAttribute('href') === '#') {
                    return;
                }
                
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar URL sin recargar la página
                    history.pushState(null, null, targetId);
                }
            });
        });
    };

    // Contador de descargas animado
    const animateDownloadCounter = function() {
        const counter = document.getElementById('download-count');
        if (!counter) return;
        
        let count = 0;
        const target = 2847;
        const duration = 2000;
        const increment = target / (duration / 16);
        
        const updateCounter = function() {
            count += increment;
            if (count < target) {
                counter.textContent = Math.floor(count).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    };

    // Funcionalidad del acordeón de FAQ
    const initFAQ = function() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', function() {
                // Cerrar otros items abiertos
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.querySelector('.faq-answer').classList.remove('active');
                        otherItem.querySelector('.faq-question i').classList.remove('fa-chevron-up');
                        otherItem.querySelector('.faq-question i').classList.add('fa-chevron-down');
                    }
                });
                
                // Alternar el item actual
                answer.classList.toggle('active');
                const icon = question.querySelector('i');
                icon.classList.toggle('fa-chevron-up');
                icon.classList.toggle('fa-chevron-down');
            });
        });
    };

    // Modal de descarga - ACTUALIZADO PARA DESCARGA DIRECTA
    const initDownloadModal = function() {
        const downloadBtn = document.getElementById('download-btn');
        const modal = document.getElementById('downloadModal');
        const closeModal = document.querySelector('.close-modal');
        const modalDownloadBtn = document.querySelector('.download-option .btn-primary');
        
        if (!downloadBtn || !modal) return;
        
        // Botón principal - abre modal
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // Botón dentro del modal - descarga directa
        if (modalDownloadBtn) {
            modalDownloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Iniciar descarga automáticamente
                console.log('🚀 Iniciando descarga del APK...');
                
                // Crear enlace temporal para descarga
                const downloadLink = document.createElement('a');
                downloadLink.href = 'CodeNest.apk';
                downloadLink.download = 'CodeNest.apk';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                // Cerrar modal después de iniciar descarga
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                    alert('¡Descarga iniciada! El archivo CodeNest.apk se está descargando.');
                }, 500);
            });
        }
        
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    };

    // Efecto de header al hacer scroll
    const initHeaderScroll = function() {
        const header = document.querySelector('header');
        
        if (!header) return;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(20, 20, 20, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'var(--primary-color)';
                header.style.backdropFilter = 'none';
            }
        });
    };

    // Interactividad para el teléfono
    const initInteractivePhone = function() {
        const interactivePhone = document.querySelector('.interactive-phone');
        
        if (!interactivePhone) return;
        
        interactivePhone.addEventListener('click', function() {
            this.classList.toggle('phone-tapped');
            
            setTimeout(() => {
                this.classList.remove('phone-tapped');
            }, 1000);
        });
        
        interactivePhone.addEventListener('mousemove', function(e) {
            const phoneRect = this.getBoundingClientRect();
            const centerX = phoneRect.left + phoneRect.width / 2;
            const centerY = phoneRect.top + phoneRect.height / 2;
            
            const moveX = (e.clientX - centerX) / 20;
            const moveY = (e.clientY - centerY) / 20;
            
            this.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
        });
        
        interactivePhone.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        });
    };

    // Verificar Firebase al cargar
    const checkFirebase = function() {
        setTimeout(() => {
            if (window.firebaseDatabase) {
                console.log('✅ Firebase Realtime Database está funcionando correctamente');
                console.log('📊 Analytics:', window.firebaseAnalytics ? 'Disponible' : 'No disponible');
            } else {
                console.log('❌ Firebase Realtime Database no se pudo inicializar');
            }
        }, 1000);
    };

    // Inicializar todas las funciones
    initMobileMenu();
    initAnimation();
    smoothScroll();
    animateDownloadCounter();
    initFAQ();
    initDownloadModal();
    initSupportForm(); // Inicializar formulario de soporte
    initHeaderScroll();
    initInteractivePhone();
    checkFirebase();
    
    // Ejecutar animación al cargar y al hacer scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
    
    // Debug info
    console.log('✅ Script.js cargado correctamente');
});