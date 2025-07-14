// NAVBAR FUNCTION

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-links");
    let clickedNav = false;

    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("open");
        document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
    });

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            navLinks.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");
            navMenu.classList.remove("open");
            document.body.style.overflow = "";
            const sectionId = this.getAttribute("href").substring(1);
            document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
            clickedNav = true;
            setTimeout(() => clickedNav = false, 800);
        });
    });

    function updateActiveNav() {
        if (clickedNav) return;
        let scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute("id");
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove("active"));
                document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav);
});

// CONFETTI-JS FUNCTION

document.addEventListener("DOMContentLoaded", function () {
    const emailSpan = document.getElementById("email-text");
    const copyIcon = document.getElementById("copy-icon");
    const originalText = emailSpan.innerHTML;

    emailSpan.addEventListener("click", function (event) {
        copyEmail(event);
    });

    function copyEmail(event) {
        const emailToCopy = "sayedanowar.dev@gmail.com";
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(emailToCopy)
                .then(() => showCopiedEffect(event))
                .catch(err => fallbackCopyText(emailToCopy, event));
        } else {
            fallbackCopyText(emailToCopy, event);
        }
    }

    function fallbackCopyText(text, event) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showCopiedEffect(event);
    }

    function showCopiedEffect(event) {
        copyIcon.className = "ti ti-check copy-btn";
        emailSpan.innerHTML = `<i id="copy-icon" class="ti ti-check copy-btn"></i> Copied To Clipboard`;
        launchConfetti(event);

        setTimeout(() => {
            emailSpan.innerHTML = originalText;
        }, 2000);
    }

    function launchConfetti(event) {
        const rect = emailSpan.getBoundingClientRect();
        confetti({
            particleCount: 80,
            spread: 60,
            origin: {
                x: (rect.left + rect.width / 2) / window.innerWidth,
                y: (rect.top + rect.height / 2) / window.innerHeight
            }
        });
    }
});

// DRAWER FUNCTION

const openBtn = document.querySelector('.open-drawer-btn');
const drawer = document.querySelector('.drawer');
const overlay = document.querySelector('.drawer-overlay');
const dragHandle = document.querySelector('.drag-handle');

let startY, currentY, drawerStartY, isDragging = false, hasMoved = false;
const threshold = 100;

function openDrawer() {
    drawer.style.transform = 'translateY(0)';
    drawer.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    drawer.style.transition = 'transform 0.3s ease';
    drawer.style.transform = 'translateY(100%)';
    overlay.classList.remove('show');
    document.body.style.overflow = '';

    setTimeout(() => {
        drawer.classList.remove('open');
        drawer.style.transition = '';
    }, 300);
}

function startDrag(e) {
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    drawerStartY = drawer.getBoundingClientRect().top;
    isDragging = true;
    hasMoved = false;
    drawer.style.transition = '';
}

function moveDrag(e) {
    if (!isDragging) return;
    currentY = e.touches ? e.touches[0].clientY : e.clientY;
    let deltaY = currentY - startY;
    if (Math.abs(deltaY) > 5) hasMoved = true;
    drawer.style.transform = `translateY(${Math.max(deltaY, 0)}px)`;
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    let finalPosition = drawer.getBoundingClientRect().top;
    let draggedDown = finalPosition - drawerStartY > threshold;

    if (hasMoved && draggedDown) {
        closeDrawer();
    } else {
        drawer.style.transition = 'transform 0.3s ease';
        drawer.style.transform = 'translateY(0)';
    }
}

dragHandle.addEventListener('touchstart', startDrag, { passive: false });
dragHandle.addEventListener('touchmove', moveDrag, { passive: false });
dragHandle.addEventListener('touchend', endDrag);

dragHandle.addEventListener('mousedown', (e) => {
    startDrag(e);
    function onMouseMove(e) { moveDrag(e); }
    function onMouseUp() {
        endDrag();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

openBtn.addEventListener('click', openDrawer);
overlay.addEventListener('click', closeDrawer);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
});

// WEB3FORMS FUNCTION

const form = document.getElementById('form');
const result = document.getElementById('result');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    result.innerHTML = "Sending...";

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
        .then(async (response) => {
            let json = await response.json();
            result.innerHTML = response.status == 200 ? json.message : "Something went wrong!";
        })
        .catch(error => console.log(error))
        .then(() => {
            form.reset();
            setTimeout(() => result.style.display = "none", 3000);
        });
});