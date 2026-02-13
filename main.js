document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById('background-music');
    const muteButton = document.getElementById('mute-button');
    const volumeSlider = document.getElementById('volume-slider');
    const icon = muteButton.querySelector("i");
    const videoCard = document.querySelector(".aside.left"); // Video card
    const video = videoCard.querySelector("video"); // Get video element
    const clickButton = document.querySelector(".click-box button");
    const choiceBox = document.querySelector(".choice-box");
    const threedBox = document.querySelector(".threed-box");
    const questionText = document.querySelector(".question-box h1");
    const yesButton = document.querySelector(".choice-box button:first-child");
    const noButton = document.querySelector(".choice-box button:last-child");
    const congratulationsAudio = new Audio("assets/congratulations.mp3");
    congratulationsAudio.preload = "auto";
    congratulationsAudio.loop = true;

    let partnerName = "Eleanor"; // Replace with dynamic value
    let noClickCount = 0; // Counter for No button clicks
    let noButtonMovementEnabled = false;
    let noButtonClickLocked = false;

    // Function to create typewriter effect
    function typeWriterEffect(element, text, speed = 100) {
        element.innerHTML = ""; // Clear previous text
        let i = 0;
        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            } else {
                element.innerHTML += `<span class="typewriter"></span>`; // Cursor effect
            }
        }
        typing();
    }

    // Function to handle the click event
    function revealChoices() {
        audio.pause(); // Stop background music
        audio.currentTime = 0; // Reset music

        videoCard.classList.remove("hide"); // Show video card
        video.play(); // Play the funny video

        clickButton.style.display = "none"; // Hide the button
        choiceBox.classList.remove("hide"); // Show Yes/No options

        // Show partner name instantly
        questionText.innerHTML = `<span class="partner-name">${partnerName}</span><br><span class="typed-text"></span>`;

        // Start typewriter effect for the second line
        const typedTextElement = document.querySelector(".typed-text");
        setTimeout(() => {
            typeWriterEffect(typedTextElement, "Will you be my Valentine?");
        }, 500); // Delay to allow smooth transition
    }

    function createHearts() {
        const heartContainer = document.createElement("div");
        heartContainer.classList.add("heart-container");
        document.body.appendChild(heartContainer);

        for (let i = 0; i < 30; i++) {
            let heart = document.createElement("div");
            heart.classList.add("heart");

            // Random positioning and animation speed
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.animationDuration = Math.random() * 2 + 3 + "s";

            heartContainer.appendChild(heart);
        }

        // Remove hearts after animation ends
        setTimeout(() => {
            heartContainer.remove();
        }, 5000);
    }

    function playCongratulationsSound() {
        congratulationsAudio.pause();
        congratulationsAudio.currentTime = 0;
        congratulationsAudio.volume = audio.volume;
        congratulationsAudio.muted = audio.muted;

        congratulationsAudio.play().catch(() => {
            console.log("Could not play congratulations sound.");
        });
    }

    function moveNoButtonRandomly() {
        if (!noButtonMovementEnabled) {
            return;
        }

        const buttonRect = noButton.getBoundingClientRect();
        const edgePadding = 8;

        const zoneWidth = Math.min(220, Math.max(130, window.innerWidth * 0.22));
        const zoneHeight = Math.min(120, Math.max(80, window.innerHeight * 0.14));
        const zoneLeft = (window.innerWidth - zoneWidth) / 2;
        const zoneTop = (window.innerHeight - zoneHeight) / 2;

        const minX = Math.max(edgePadding, zoneLeft);
        const minY = Math.max(edgePadding, zoneTop);
        const maxX = Math.max(minX, Math.min(window.innerWidth - buttonRect.width - edgePadding, zoneLeft + zoneWidth - buttonRect.width));
        const maxY = Math.max(minY, Math.min(window.innerHeight - buttonRect.height - edgePadding, zoneTop + zoneHeight - buttonRect.height));

        const randomX = Math.random() * (maxX - minX) + minX;
        const randomY = Math.random() * (maxY - minY) + minY;

        noButton.style.position = "fixed";
        noButton.style.left = `${randomX}px`;
        noButton.style.top = `${randomY}px`;
        noButton.style.margin = "0";
        noButton.style.zIndex = "1000";
        noButton.style.display = "inline-block";
        noButton.style.visibility = "visible";
        noButton.style.opacity = "1";
        noButton.style.pointerEvents = "auto";
        noButton.style.transform = "none";
        noButton.style.transition = "left 120ms ease-out, top 120ms ease-out";
    }

    function enableNoButtonMovement() {
        if (noButtonMovementEnabled) {
            return;
        }

        noButtonMovementEnabled = true;

        // Prevent hover scaling of the parent container while No is floating.
        choiceBox.style.transform = "none";
        choiceBox.style.transition = "box-shadow 0.3s ease-out";
    }

    yesButton.addEventListener("click", function () {
        playCongratulationsSound();
        questionText.innerHTML = `<span class="partner-name">${partnerName}</span><br><span class="love-text">SAFE! 😜</span>`;
        choiceBox.style.display = "none"; // Hide choices
        threedBox.classList.remove("hide");

        createHearts();
    });

    // Handle "No" button click
    noButton.addEventListener("click", function () {
        enableNoButtonMovement();

        if (noButtonClickLocked) {
            return;
        }
        noButtonClickLocked = true;
        setTimeout(() => {
            noButtonClickLocked = false;
        }, 140);

        noClickCount++; // Increment No click count

        let newYesSize = 18 + noClickCount * 5; // Increase Yes button size
        yesButton.style.fontSize = `${newYesSize}px`;
        yesButton.style.padding = `${newYesSize / 2}px ${newYesSize}px`;

        if (!questionText.querySelector(".no-choice-text")) {
            questionText.innerHTML += `<br><span class="no-choice-text">Did you really think you had a choice? 🤭</span>`;
        }

        moveNoButtonRandomly();
    });

    clickButton.addEventListener("click", revealChoices);
    window.addEventListener("resize", moveNoButtonRandomly);
});
