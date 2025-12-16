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


    // --- 3. FORM VALIDATION & SENDING (FORMSPREE) ---
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop page reload

            // 1. Get Values
            let nom = document.getElementById('nom').value;
            let email = document.getElementById('email').value;
            let message = document.getElementById('message').value;

            // 2. Validation Checks
            if (nom === "" || message === "") {
                alert("Veuillez remplir tous les champs !");
                return;
            }

            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email)) {
                alert("Veuillez entrer une adresse email valide !");
                return;
            }

            // 3. SEND TO FORMSPREE (The Real Email Part)
            // Replace the URL below with YOUR unique Formspree URL
            const formspreeURL = "https://formspree.io/f/mjknqkgn";

            const formData = new FormData(form);

            fetch(formspreeURL, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    alert("Merci ! Votre message a bien été envoyé.");
                    form.reset(); // Clear form
                } else {
                    alert("Oups ! Il y a eu un problème lors de l'envoi.");
                }
            }).catch(error => {
                alert("Oups ! Il y a eu un problème lors de l'envoi.");
            });
        }); // Closes form.addEventListener
    } 

}); 
          
