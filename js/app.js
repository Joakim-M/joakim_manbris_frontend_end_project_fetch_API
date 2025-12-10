// -------------------------------------------------------------
// Memory Game – Picsum API (Completely Free, No Key)
// -------------------------------------------------------------

const gameContainer = document.getElementById("game"); // Det här hittar HTML elementet gameContainer. Elementet har också ett ID "game".
const resetBtn = document.getElementById("resetBtn"); // Det här hittar HTML elementet resetBtn. Som startar om spelet när du trycker på den.

const PAIRS = 9; // Det här antal kortpar. Kortparen dubbleras för att skapa ett memory spel.

let firstCard = null; // Låser första kortet användaren väljer.
let secondCard = null; // Låser andra kortet användaren väljer.
let lockBoard = false; // Denna Boolean talar om för "brädet när det ska låsas. Allstså när ett par hittas så låses brädet med de öppna korten.
let cards = []; // Här skapas en tom array "lista" som sedan sparar alla kort i spelet.

// -------------------------------------------------------------
// Fetch 9 images from Picsum API
// -------------------------------------------------------------
async function fetchImages() { // FETCH REQUEST. SKAPAR ASYNCRON DÄR VI KAN ANVÄNDA AWAIT SYNTAX. FUNKTION HÄMTAR BILDERNA FRÅN API. VÄNRTAR PÅ ATT HÄMTA OBJECT TILLS NÄSTA BÖRJAR
  const response = await fetch(`https://picsum.photos/v2/list?limit=${PAIRS}`);
  const data = await response.json(); // KONVERTERAR TILL ETT JAVASCRIPT OBJECT

  // Convert to smaller image URLs
  return data.map(img =>
    `https://picsum.photos/id/${img.id}/300/300`
  );
}



// -------------------------------------------------------------
// Game Setup
// -------------------------------------------------------------
async function setupGame() { //Den här funktionen startar och restartar spelet.
  gameContainer.innerHTML = ""; //Rensar brädet
  firstCard = null; // "Glömmer första klickade kortet"
  secondCard = null; // "Glömmer andra klickade kortet"
  lockBoard = false; // När det blir false får du klicka på korten igen. Brädet är olåst.

  const images = await fetchImages(); // Här fetchas mina bilder från API:n

  // Duplicate → 18 cards
  cards = [...images, ...images]; // Här dupliceras mina 9 bilder [...1X, ...2X].

  // Shuffle
  cards.sort(() => Math.random() - 0.5); // Här blandas korten i en slumpmässig ordning.

  // Create cards
  cards.forEach(imgURL => { // Här skapas ett kort för varje bild alltså 9x2 så vi får par.
    const card = document.createElement("div"); // Här skapas brädet med korten baserat på <div class="game-container" id="game"></div> i HTML koden.
    card.classList.add("card"); // Här kopplas kortet till CSS klassen "card"
    card.dataset.symbol = imgURL; // Här lagras informationen om vilken bild som tillhör vilket kort. Så spelet para i hop par.

    const img = document.createElement("img"); // Här skapas ett img element.
    img.src = imgURL; // Här är källan för bilden som ska användas till det skapade kortet.
    img.alt = "image"; // Här är en alt bildtext om bilden inte laddar in korrekt. Just nu är texten bara "image".
    img.style.display = "none"; // Detta gömmer först bilden så att bilden börjar med motivet ner mot spelbrädet.

    card.appendChild(img); // Här lägger vi ihop <div> "card" med img elementet vi tidigare skapat. appenchild lägger bilden i kortet.
    card.addEventListener("click", flipCard); // Här skapar vi en händelse som gör att kortet vänds när vi klickar på det. När vi klickar så körs funktionen flipCard.
    gameContainer.appendChild(card); // Här lägger vi till appendChild(card) allstå kortet till spelbrädet gameContainer.
  });
}

// -------------------------------------------------------------
// Card Flip Logic
// -------------------------------------------------------------
function flipCard() {// Den här funktionen körs när spelaren klickar på ett kort. låter spelaren flippa card
  if (lockBoard) return; // Hindrar spelaren från att klicka på ytterligare kort när spelet är "upptaget" typ när animationer sker. Exempel när korten flippas.
  if (this === firstCard) return; // Förhindrar spelaren att klicka på samma kort som sitt första klick.

  this.classList.add("flipped"); // Lägger till en CSS class som visar när kortet efter det flippats.
  this.querySelector("img").style.display = "block"; // Detta väljer "img" som hamnar på kortet som flippas.

  if (!firstCard) { // Om klicket är det första så "låses" kortet.
    firstCard = this;
    return;
  }

  secondCard = this; // På andra klicket så låses kortet sen och sen kollas om det är en match. .
  checkMatch();
}

function checkMatch() {
  const match = firstCard.dataset.symbol === secondCard.dataset.symbol;
  match ? disableCards() : unflipCards(); // Om det blir en matchning så skickas true och disabledCards körs och paret tas ur spelet. om det blir false så flippas korteen tillbaks

}

function disableCards() { // Denna funktion körs när det blir en matchning. Och gör i stort att paret tas ur spelet.
  firstCard.classList.add("matched"); // Första kortet läggs till.
  secondCard.classList.add("matched"); // Andra kortet läggs till.

  firstCard.removeEventListener("click", flipCard); // Detta tar bort EventListener funktionen "click" som gör att kortet flippas. Kortet blir oklickbart.
  secondCard.removeEventListener("click", flipCard); // Detta tar bort EventListener funktionen "click" som gör att kortet flippas. Kortet blir oklickbart.

  resetTurn(); // Kallar på funktionen resetTurn.
}

function unflipCards() { // Denna funktion körs när korten inte matchar.
  lockBoard = true; // Detta gör att spelaren inte kan klicka på fler kort när korten vänds tillbaka.

  setTimeout(() => { // Detta talar om hur länge korten visas innan dom vänds ner igen. Alltså 900 millisekunder om vi tittar längre ner i koden.
    firstCard.querySelector("img").style.display = "none"; // Gömmer bilden för första kortet genom att ta bort bilden så kortet ser ut att vara uppochnervänt.
    secondCard.querySelector("img").style.display = "none"; // Gömmer bilden för andra kortet genom att ta bort bilden så kortet ser ut att vara uppochnervänt.

    firstCard.classList.remove("flipped"); // Detta tar bort CSS:n
    secondCard.classList.remove("flipped"); // Detta tar bort CSS:n

    resetTurn(); // Kallar på funktionen resetTurn.
  }, 900); // Tidsåtgång 900 millisekunder.
}

function resetTurn() { // Detta är funktionen resetTurn. De valda korten vänds tillbaka, spelbrädet låses upp
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// -------------------------------------------------------------
// Restart button
// -------------------------------------------------------------
resetBtn.addEventListener("click", setupGame); // Här kallar vi på <button id="resetBtn">Restart Game</button> i HTML. Vi lägger till addEventListener kopplat till "click" som kör funktionen setupGame och då startas spelet om.

// -------------------------------------------------------------
// Start
// -------------------------------------------------------------
setupGame(); // Här kallar vi funktion setupGame när browsern öppnas.

