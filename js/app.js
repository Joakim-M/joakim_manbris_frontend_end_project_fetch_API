// -------------------------------------------------------------
// Memory Game – Picsum API (Completely Free, No Key)
// -------------------------------------------------------------

const gameContainer = document.getElementById("game");
const resetBtn = document.getElementById("resetBtn");

const PAIRS = 9;

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let cards = [];

// -------------------------------------------------------------
// Fetch 9 images from Picsum API
// -------------------------------------------------------------
async function fetchImages() {
  const response = await fetch(`https://picsum.photos/v2/list?limit=${PAIRS}`);
  const data = await response.json();

  // Convert to smaller image URLs
  return data.map(img =>
    `https://picsum.photos/id/${img.id}/300/300`
  );
}

// -------------------------------------------------------------
// Game Setup
// -------------------------------------------------------------
async function setupGame() {
  gameContainer.innerHTML = "";
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  const images = await fetchImages();

  // Duplicate → 18 cards
  cards = [...images, ...images];

  // Shuffle
  cards.sort(() => Math.random() - 0.5);

  // Create cards
  cards.forEach(imgURL => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = imgURL;

    const img = document.createElement("img");
    img.src = imgURL;
    img.alt = "image";
    img.style.display = "none";

    card.appendChild(img);
    card.addEventListener("click", flipCard);
    gameContainer.appendChild(card);
  });
}

// -------------------------------------------------------------
// Card Flip Logic
// -------------------------------------------------------------
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");
  this.querySelector("img").style.display = "block";

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  const match = firstCard.dataset.symbol === secondCard.dataset.symbol;
  match ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetTurn();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.querySelector("img").style.display = "none";
    secondCard.querySelector("img").style.display = "none";

    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    resetTurn();
  }, 900);
}

function resetTurn() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// -------------------------------------------------------------
// Restart button
// -------------------------------------------------------------
resetBtn.addEventListener("click", setupGame);

// -------------------------------------------------------------
// Start
// -------------------------------------------------------------
setupGame();

async function testAPI() {
  const response = await fetch("https://picsum.photos/v2/list");
  const data = await response.json();
  console.log(data);
}
testAPI();
