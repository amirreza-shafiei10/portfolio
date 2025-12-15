document.addEventListener("DOMContentLoaded", function() {

    // --- 1. DARK MODE LOGIC ---
    const toggleButton = document.getElementById('toggle-theme');
    const body = document.body;

    // Check if user previously chose dark mode
    if(localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        toggleButton.textContent = '☀️';
    }

    toggleButton.addEventListener('click', function() {
        body.classList.toggle('dark-mode');

        if(body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            toggleButton.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            toggleButton.textContent = '🌙';
        }
    });


    // --- 2. SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = function() {
        const windowHeight = window.innerHeight;
        const elementVisible = 150; 

        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load


    // --- 3. FORM VALIDATION ---
    const form = document.getElementById('contactForm');
    if (form) { // Only run if form exists
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            let nom = document.getElementById('nom').value;
            let email = document.getElementById('email').value;
            let message = document.getElementById('message').value;

            if (nom === "" || message === "") {
                alert("Veuillez remplir tous les champs !");
                return;
            }

            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email)) {
                alert("Veuillez entrer une adresse email valide !");
                return;
            }

            alert("Message envoyé avec succès ! (Simulation)");
            form.reset();
        });
    }
});