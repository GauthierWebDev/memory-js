(()=>{var e={636:e=>{e.exports=[{name:"red-apple",translateY:0},{name:"bananas",translateY:-100},{name:"orange",translateY:-200},{name:"lime",translateY:-300},{name:"pomegranate",translateY:-400},{name:"apricot",translateY:-500},{name:"lemon",translateY:-600},{name:"strawberry",translateY:-700},{name:"green-apple",translateY:-800},{name:"peach",translateY:-900},{name:"grape",translateY:-1e3},{name:"watermelon",translateY:-1100},{name:"plum",translateY:-1200},{name:"pear",translateY:-1300},{name:"red-cherries",translateY:-1400},{name:"raspberry",translateY:-1500},{name:"mango",translateY:-1600},{name:"yellow-cherries",translateY:-1700}]},557:(e,t,a)=>{const r=a(566),s=a(390),n=a(636);e.exports=class{constructor(){this.fruits=[],this.gameEngine=null}newGame(){this.gameEngine=new s(this.fruits),this.gameEngine.HUD.vanishLeaderboard(),this.gameEngine.HUD.vanishBoard(),setTimeout((()=>{this.gameEngine.createCards(),this.gameEngine.HUD.hideLeaderboard(),this.gameEngine.HUD.appearBoard()}),300)}retrieveFruits(){n.forEach((e=>{this.fruits.push(new r(e.name,e.translateY))}))}attachEvent(){document.getElementById("new-game").addEventListener("click",(()=>this.newGame()))}init(){this.attachEvent(),this.retrieveFruits()}}},22:e=>{e.exports=class{constructor(e,t){this.DOMElement=null,this.found=!1,this.flipped=!1,this.fruit=e,this.flipCard=t}prepareCardDOM(e,t){this.DOMElement=document.importNode(e.content,!0).querySelector("li"),this.DOMElement.style.setProperty("--translateY",`${this.fruit.translateY}px`),this.DOMElement.addEventListener("click",(()=>this.flipCard(this))),t.append(this.DOMElement)}}},566:e=>{e.exports=class{constructor(e,t){this.name=e,this.translateY=t,this.found=!1}}},390:(e,t,a)=>{const r=a(22),s=a(197);e.exports=class{constructor(e){this.fruitsPerGame=14,this.msBetweenFlip=1e3,this.maxSecondsPerGame=120,this.fruits=e.shuffle().slice(0,this.fruitsPerGame),this.cards=[],this.HUD=new s,this.flippedCards=0}refreshHUD(){this.HUD.setFlippedCards(this.flippedCards)}flipCard(e){e.DOMElement.classList.add("Card--visible"),e.flipped=!0,this.flippedCards+=1,this.refreshHUD()}createCards(){[...this.fruits,...this.fruits].shuffle().forEach((e=>{const t=new r(e,(e=>this.flipCard(e)));t.prepareCardDOM(this.HUD.cardTemplate,this.HUD.boardContainer),this.cards.push(t)}))}}},197:e=>{e.exports=class{constructor(){this.cardTemplate=document.getElementById("Card"),this.boardContainer=document.getElementById("Board"),this.leaderboardContainer=document.getElementById("Leaderboard"),this.flippedCardsSpan=document.querySelector(":scope #moves span")}setFlippedCards(e){this.flippedCardsSpan.innerHTML=e}hideLeaderboard(){this.leaderboardContainer.classList.add("Leaderboard--hidden")}vanishLeaderboard(){this.leaderboardContainer.classList.add("Leaderboard--vanish")}vanishBoard(){this.boardContainer.classList.add("Board--vanish")}appearBoard(){this.boardContainer.classList.remove("Board--vanish")}}},626:()=>{Array.prototype.shuffle=function(){let e,t=Array.from(this),a=t.length;for(;0!==a;)e=Math.floor(Math.random()*a),a--,[t[a],t[e]]=[t[e],t[a]];return t}}},t={};function a(r){var s=t[r];if(void 0!==s)return s.exports;var n=t[r]={exports:{}};return e[r](n,n.exports,a),n.exports}(()=>{a(626);const e=a(557);document.addEventListener("DOMContentLoaded",(()=>{(new e).init()}))})()})();
//# sourceMappingURL=index.js.map