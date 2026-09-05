document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // MOBILE MENU
    // =====================================================

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            menuToggle.classList.toggle("active");

            navLinks.classList.toggle("active");

        });


        // Close menu when navigation link clicked

        document.querySelectorAll(".nav-link").forEach(link => {

            link.addEventListener("click", () => {

                menuToggle.classList.remove("active");

                navLinks.classList.remove("active");

            });

        });


        // Close menu outside

        document.addEventListener("click", (event) => {

            if (
                !menuToggle.contains(event.target) &&
                !navLinks.contains(event.target)
            ) {

                menuToggle.classList.remove("active");

                navLinks.classList.remove("active");

            }

        });

    }



    // =====================================================
    // NAVBAR SCROLL EFFECT
    // =====================================================

    const navbar = document.getElementById("navbar");

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 40) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }

    window.addEventListener("scroll", updateNavbar);

    updateNavbar();



    // =====================================================
    // ACTIVE NAVIGATION
    // =====================================================

    const sections = document.querySelectorAll("section[id]");

    const navItems = document.querySelectorAll(".nav-link");


    const sectionObserver = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const sectionId = entry.target.id;

                    navItems.forEach(link => {

                        link.classList.remove("active");

                    });


                    const activeLink = document.querySelector(
                        `.nav-link[href="#${sectionId}"]`
                    );


                    if (activeLink) {

                        activeLink.classList.add("active");

                    }

                }

            });

        },

        {
            threshold: 0.25
        }

    );


    sections.forEach(section => {

        sectionObserver.observe(section);

    });



    // =====================================================
    // FOCUS TIMER
    // =====================================================

    const timerDisplay = document.getElementById("focusTimer");
    const timerButton = document.getElementById("timerBtn");

    let totalSeconds = 8 * 60 * 60;
    let timerInterval = null;
    let timerRunning = false;


    function updateTimer() {

        if (!timerDisplay) return;


        const hours = Math.floor(totalSeconds / 3600);

        const minutes = Math.floor(
            (totalSeconds % 3600) / 60
        );

        const seconds = totalSeconds % 60;


        timerDisplay.textContent =
            `${String(hours).padStart(2, "0")}:` +
            `${String(minutes).padStart(2, "0")}:` +
            `${String(seconds).padStart(2, "0")}`;

    }


    function startTimer() {

        if (timerRunning) return;

        timerRunning = true;

        timerInterval = setInterval(() => {

            if (totalSeconds > 0) {

                totalSeconds--;

                updateTimer();

            } else {

                clearInterval(timerInterval);

                timerRunning = false;

                if (timerButton) {

                    timerButton.textContent = "Start Focus";

                }

            }

        }, 1000);


        if (timerButton) {

            timerButton.textContent = "Pause Focus";

        }

    }


    function pauseTimer() {

        clearInterval(timerInterval);

        timerInterval = null;

        timerRunning = false;


        if (timerButton) {

            timerButton.textContent = "Resume Focus";

        }

    }


    if (timerButton) {

        timerButton.addEventListener("click", () => {

            if (timerRunning) {

                pauseTimer();

            } else {

                startTimer();

            }

        });

    }


    updateTimer();



    // =====================================================
    // CONTACT FORM - SMS
    // =====================================================

    const contactForm = document.getElementById("contactForm");

    const formStatus = document.getElementById("formStatus");

    const submitButton = contactForm
        ? contactForm.querySelector(".submit-btn")
        : null;


    if (contactForm) {

        contactForm.addEventListener("submit", async (event) => {

            event.preventDefault();


            // -------------------------------------------------
            // FORM DATA
            // -------------------------------------------------

            const formData = new FormData(contactForm);

            const name = formData.get("name")?.trim();

            const email = formData.get("email")?.trim();

            const phone = formData.get("phone")?.trim();

            const message = formData.get("message")?.trim();


            // -------------------------------------------------
            // BASIC VALIDATION
            // -------------------------------------------------

            if (!name || !email || !message) {

                if (formStatus) {

                    formStatus.textContent =
                        "Please fill all required fields.";

                    formStatus.style.color = "#ff6b6b";

                }

                return;

            }


            // -------------------------------------------------
            // BUTTON LOADING
            // -------------------------------------------------

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent = "Sending...";

            }


            if (formStatus) {

                formStatus.textContent = "Sending your message...";

                formStatus.style.color = "#00d9ff";

            }


            try {

                // -------------------------------------------------
                // SEND TO SERVER
                // -------------------------------------------------

                const response = await fetch("/api/contact", {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        name,
                        email,
                        phone,
                        message

                    })

                });


                const result = await response.json();


                // -------------------------------------------------
                // SUCCESS
                // -------------------------------------------------

                if (response.ok && result.success) {

                    if (formStatus) {

                        formStatus.textContent =
                            "✓ Message sent successfully!";

                        formStatus.style.color = "#27c93f";

                    }


                    contactForm.reset();


                } else {

                    throw new Error(
                        result.message || "Failed to send message."
                    );

                }


            } catch (error) {

                console.error("Contact form error:", error);


                if (formStatus) {

                    formStatus.textContent =
                        "Unable to send message. Please try again.";

                    formStatus.style.color = "#ff6b6b";

                }

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent = "Send Message";

                }

            }

        });

    }



    // =====================================================
    // IMAGE FALLBACK
    // =====================================================

    document.querySelectorAll("img").forEach(img => {

        img.addEventListener("error", () => {

            img.classList.add("image-error");

        });

    });

});