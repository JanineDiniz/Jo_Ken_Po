const state={
  score:{
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points")
  },
  cardSprites:{
    avatar: document.getElementById("card_image"),
    name: document.getElementById("card_name"),
    type: document.getElementById("card_type"),
  },
  fieldCards:{
    player: document.getElementById("player_field_card"),
    computer: document.getElementById("computer_field_card"),
  },
  playerSides: {
    player1: "player_cards",
    player1_box: document.querySelector("#computer_cards"),
    computer: "computer_cards",
    computer_box: document.querySelector("#player_cards"),
  },
  actions:{
    button: document.getElementById("next_duel")
  }
}

const playerSides = {
  player1: "player_cards",
  computer: "computer_cards",
}

const cardData = [
  {
    id:0,
    name: "Blue Eys White Gragon",
    type: "Paper",
    img: "./src/assets/icons/dragon.png",  
    winOf:[1],
    Loseof: [2],
  },
  {
    id:1,
    name: "Dark Magician",
    type: "Rock",
    img: "./src/assets/icons/magician.png",  
    winOf:[2],
    Loseof: [0],
  },
  {
    id:2,
    name: "Exodia",
    type: "Scissors",
    img: "./src/assets/icons/exodia.png",  
    winOf:[0],
    Loseof: [1],
  },
]

async function getRandomCardId(){
  const randomIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randomIndex].id
}

async function createCardImage(IdCard, fieldSide){
  const cardImage = document.createElement("img")
  cardImage.setAttribute("height", "100px")
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png")
  cardImage.setAttribute("data-id", IdCard)
  cardImage.classList.add("card")

  if(fieldSide === playerSides.player1){
    cardImage.addEventListener("mouseover", ()=>{
      drawSelectCard(IdCard)
    })

    cardImage.addEventListener("click", ()=>{
      setCardsField(cardImage.getAttribute("data-id"))
    })
  }

  return cardImage
}

async function setCardsField(cardId){
  await removeAllCardsImages()
  let computerCardId = await getRandomCardId()

  await showHiddenCardFieldImages(true)

  await hiddenCardDetails()

  await drawCardsInField(cardId, computerCardId)

  let duelResults = await checkDuelResults(cardId, computerCardId)

  await updateScore()
  await drawButton(duelResults)
}

async function drawCardsInField(cardId, computerCardId){
  state.fieldCards.player.src = cardData[cardId].img
  state.fieldCards.computer.src = cardData[computerCardId].img
}

async function showHiddenCardFieldImages(value){
  if(value === true){
    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"
  }else{
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"
  }
}

async function hiddenCardDetails(){
  state.cardSprites.avatar.src = ""
  state.cardSprites.name.innerText = ""
  state.cardSprites.type.innerText = ""
}

async function drawButton(text){
  state.actions.button.innerText = text
  state.actions.button.style.display = "block"
}

async function updateScore(){
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} Lose:  ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId){
  let duelResults = "Empate"
  let playerCard = cardData[playerCardId]

  if(playerCard.winOf.includes(computerCardId)){
    duelResults = "Ganhou"
    await playAudio("win")
    state.score.playerScore++
  }
  if(playerCard.Loseof.includes(computerCardId)){
    duelResults = "Perdeu"
    await playAudio("lose")
    state.score.computerScore++
  }

  return duelResults
}

async function removeAllCardsImages(){
  let { computer_box, player1_box} = state.playerSides
  let imgElements = computer_box.querySelectorAll("img")
  imgElements.forEach((img) => img.remove())

  imgElements = player1_box.querySelectorAll("img")
  imgElements.forEach((img) => img.remove())
}

async function drawSelectCard(index){
  state.cardSprites.avatar.src = cardData[index].img
  state.cardSprites.name.innerText = cardData[index].name
  state.cardSprites.type.innerText = "Attribute: " + cardData[index].type
}

async function drawCards(cardNumbers, fieldSide){
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId()
    const cardImage = await createCardImage(randomIdCard, fieldSide)
    
    document.getElementById(fieldSide).appendChild(cardImage)
  }
}

async function resetDuel(){
  state.cardSprites.avatar.src = ""
  state.actions.button.style.display = "none"

  state.fieldCards.player.style.display = "none"
  state.fieldCards.computer.style.display = "none"

  init()
}

async function playAudio(status){
  const audio = new Audio(`./src/assets/audios/${status}.wav`)
  audio.play()
}

function init(){
  showHiddenCardFieldImages(false)

  drawCards(5, playerSides.player1)
  drawCards(5, playerSides.computer)

  const bgm = document.getElementById("bgm")
  bgm.play()
}
init()