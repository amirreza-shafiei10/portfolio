document.addEventListener("DOMContentLoaded", function () {

    // ============================================================
    // STATE
    // ============================================================
    let currentLang = localStorage.getItem('lang') || 'fr';
    let typingTimeout = null;

    // ============================================================
    // 1. DARK / LIGHT MODE
    // ============================================================
    const toggleBtn = document.getElementById('toggle-theme');
    const body = document.body;

    // Default dark unless user explicitly chose light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        toggleBtn.textContent = '🌙';
    } else {
        body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️';
    }

    toggleBtn.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            toggleBtn.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            toggleBtn.textContent = '🌙';
        }
    });

    // ============================================================
    // 2. TYPING ANIMATION
    // ============================================================
    const typingEl = document.getElementById('typing-prefix');
    const phrases = {
        fr: ['Développeur Web', 'Étudiant en Info', "Créateur d'Apps"],
        en: ['Web Developer', 'CS Student', 'App Builder']
    };

    let typingIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const list = phrases[currentLang];
        const current = list[typingIndex];

        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 55 : 95;

        if (!isDeleting && charIndex === current.length) {
            speed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            typingIndex = (typingIndex + 1) % list.length;
            speed = 400;
        }

        typingTimeout = setTimeout(type, speed);
    }

    function restartTyping() {
        clearTimeout(typingTimeout);
        typingIndex = 0;
        charIndex = 0;
        isDeleting = false;
        if (typingEl) typingEl.textContent = '';
        type();
    }

    // ============================================================
    // 3. LANGUAGE TOGGLE (FR / EN)
    // ============================================================
    const langToggle = document.getElementById('toggle-lang');

    function applyLanguage(lang) {
        // Update all elements with data-fr / data-en
        document.querySelectorAll('[data-fr]').forEach(function (el) {
            el.innerHTML = el.getAttribute('data-' + lang);
        });

        // Update placeholder attributes
        document.querySelectorAll('[data-placeholder-fr]').forEach(function (el) {
            el.placeholder = el.getAttribute('data-placeholder-' + lang);
        });

        document.documentElement.lang = lang;
        langToggle.textContent = lang === 'fr' ? 'EN' : 'FR';
        currentLang = lang;
        localStorage.setItem('lang', lang);

        restartTyping();
    }

    langToggle.addEventListener('click', function () {
        applyLanguage(currentLang === 'fr' ? 'en' : 'fr');
    });

    // Apply saved or default language on load
    applyLanguage(currentLang);

    // ============================================================
    // 4. PARTICLE BACKGROUND
    // ============================================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 55;
        const CONNECTION_DIST = 130;

        function resizeCanvas() {
            canvas.width  = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        function Particle() {
            this.x  = Math.random() * canvas.width;
            this.y  = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.r  = Math.random() * 1.8 + 0.8;
            this.a  = Math.random() * 0.45 + 0.15;
        }

        Particle.prototype.update = function () {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        };

        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,243,255,' + this.a + ')';
            ctx.fill();
        };

        function initParticles() {
            particles = [];
            for (var i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx   = particles[i].x - particles[j].x;
                    var dy   = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(0,243,255,' + (0.14 * (1 - dist / CONNECTION_DIST)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (p) { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        initParticles();
        animateParticles();

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () { resizeCanvas(); initParticles(); }, 200);
        });
    }

    // ============================================================
    // 5. SCROLL REVEAL
    // ============================================================
    var revealEls = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        var wh = window.innerHeight;
        revealEls.forEach(function (el) {
            if (el.getBoundingClientRect().top < wh - 150) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // ============================================================
    // 6. BACK TO TOP
    // ============================================================
    var backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================================
    // 7. CONTACT FORM — INLINE FEEDBACK
    // ============================================================
    var form     = document.getElementById('contactForm');
    var feedback = document.getElementById('form-feedback');
    var submitBtn = document.getElementById('submit-btn');

    function showFeedback(message, type) {
        feedback.textContent = message;
        feedback.className   = 'mb-3 ' + type;
        if (type === 'success') {
            setTimeout(function () { feedback.className = 'd-none mb-3'; }, 5000);
        }
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var nom     = document.getElementById('nom').value.trim();
            var email   = document.getElementById('email').value.trim();
            var message = document.getElementById('message').value.trim();
            var lang    = currentLang;

            if (!nom || !message) {
                showFeedback(
                    lang === 'fr'
                        ? '⚠️ Veuillez remplir tous les champs !'
                        : '⚠️ Please fill in all fields!',
                    'error'
                );
                return;
            }

            var emailRe = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRe.test(email)) {
                showFeedback(
                    lang === 'fr'
                        ? '⚠️ Veuillez entrer une adresse email valide !'
                        : '⚠️ Please enter a valid email address!',
                    'error'
                );
                return;
            }

            submitBtn.disabled     = true;
            submitBtn.textContent  = lang === 'fr' ? 'Envoi en cours…' : 'Sending…';

            fetch('https://formspree.io/f/mjknqkgn', {
                method:  'POST',
                body:    new FormData(form),
                headers: { 'Accept': 'application/json' }
            }).then(function (response) {
                if (response.ok) {
                    showFeedback(
                        lang === 'fr'
                            ? '✅ Merci ! Votre message a bien été envoyé.'
                            : '✅ Thank you! Your message has been sent.',
                        'success'
                    );
                    form.reset();
                } else {
                    showFeedback(
                        lang === 'fr'
                            ? "❌ Oups ! Un problème est survenu lors de l'envoi."
                            : '❌ Oops! Something went wrong.',
                        'error'
                    );
                }
            }).catch(function () {
                showFeedback(
                    lang === 'fr'
                        ? "❌ Oups ! Un problème est survenu lors de l'envoi."
                        : '❌ Oops! Something went wrong.',
                    'error'
                );
            }).finally(function () {
                submitBtn.disabled    = false;
                submitBtn.textContent = submitBtn.getAttribute('data-' + currentLang)
                    || (currentLang === 'fr' ? 'Envoyer le message' : 'Send Message');
            });
        });
    }

});
