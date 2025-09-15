document.addEventListener('DOMContentLoaded', () => {
    // --- Game Variables ---
    const gameBoard = document.getElementById('memory-game-board');
    const pairsFoundDisplay = document.getElementById('pairs-found');
    const movesCountDisplay = document.getElementById('moves-count');
    const restartButton = document.getElementById('restart-button');

    // Icons/Emojis for cards - make sure you have pairs
    const cardIcons = ['🚀', '🌟', '💻', '💡', '🎮', '✨', '🌈', '🚀', '🌟', '💻', '💡', '🎮', '✨', '🌈'];

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false; // To prevent clicking more than two cards at a time
    let pairsFound = 0;
    let movesCount = 0;

    // --- Function to shuffle array (Fisher-Yates Algorithm) ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    // --- Function to create the game board ---
    function createBoard() {
        // Duplicate and shuffle icons to create pairs
        const shuffledIcons = shuffleArray([...cardIcons]);
        shuffledIcons.forEach(icon => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.icon = icon; // Store the icon value

            const front = document.createElement('div');
            front.classList.add('front');
            front.textContent = icon; // Display the icon

            const back = document.createElement('div');
            back.classList.add('back');
            back.innerHTML = '<i class="fas fa-question"></i>'; // Back of the card

            card.appendChild(back);
            card.appendChild(front);

            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    // --- Function to handle card flipping ---
    function flipCard() {
        // Ignore clicks if board is locked, it's the same card, or already flipped
        if (lockBoard || this === firstCard || this.classList.contains('flipped')) return;

        this.classList.add('flipped'); // Flip the card

        if (!firstCard) {
            firstCard = this;
            return; // If this is the first card, store it and wait for the second
        }

        secondCard = this;
        movesCount++;
        movesCountDisplay.textContent = movesCount;

        checkForMatch();
    }

    // --- Function to check for a match ---
    function checkForMatch() {
        let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

        if (isMatch) {
            disableCards(); // If matched, remove event listeners
            pairsFound++;
            pairsFoundDisplay.textContent = pairsFound;

            // Check if game is won
            if (pairsFound === cardIcons.length / 2) {
                // --- WIN CONDITION MET ---
                setTimeout(endGame, 1000); // End game after a small delay
            }
        } else {
            unflipCards(); // If not matched, flip them back
        }
    }

    // --- Function to disable matched cards ---
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    // --- Function to unflip cards if they don't match ---
    function unflipCards() {
        lockBoard = true; // Lock the board while cards are flipping back
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000); // Delay before flipping back
    }

    // --- Function to reset variables after a check ---
    function resetBoard() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    // --- Function to end the game ---
    function endGame() {
        // Remove existing modal and overlay if any
        const existingWinMessage = document.querySelector('.win-message');
        const existingOverlay = document.querySelector('.overlay');
        if (existingWinMessage) existingWinMessage.remove();
        if (existingOverlay) existingOverlay.remove();

        // --- WIN MESSAGE POP-UP ---
        const winMessage = document.createElement('div');
        winMessage.classList.add('win-message');
        winMessage.innerHTML = `
            <h2>🏆 Congratulations! You Won! 🏆</h2>
            <p>Total moves: ${movesCount}</p>
            <button id="play-again-btn" class="btn btn-primary">Restart Game</button>
        `;
        document.body.appendChild(winMessage);

        // Add an overlay for dimming the background
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        document.body.appendChild(overlay);

        // Add event listener to the new "Play Again" button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            winMessage.remove(); // Remove the modal
            overlay.remove();    // Remove the overlay
            startGame();         // Restart the game
        });
    }

    // --- Function to start a new game from scratch ---
    function startGame() {
        // Remove modal and overlay if present (in case restart button clicked during modal)
        const existingWinMessage = document.querySelector('.win-message');
        const existingOverlay = document.querySelector('.overlay');
        if (existingWinMessage) existingWinMessage.remove();
        if (existingOverlay) existingOverlay.remove();

        // Reset all game state variables
        pairsFound = 0;
        movesCount = 0;
        firstCard = null;
        secondCard = null;
        lockBoard = false;

        // Clear previous game board
        gameBoard.innerHTML = '';

        // Update the display elements
        pairsFoundDisplay.textContent = pairsFound;
        movesCountDisplay.textContent = movesCount;

        // Create the new game board
        createBoard(); // Create the new game board
    }

    // --- Event Listeners ---
    restartButton.addEventListener('click', startGame);

    // --- Initial Game Start ---
    startGame(); // Start the game when the page loads

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});