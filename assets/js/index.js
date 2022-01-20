(()=>{var e={636:e=>{e.exports=[{name:"red-apple",translateY:0},{name:"bananas",translateY:-100},{name:"orange",translateY:-200},{name:"lime",translateY:-300},{name:"pomegranate",translateY:-400},{name:"apricot",translateY:-500},{name:"lemon",translateY:-600},{name:"strawberry",translateY:-700},{name:"green-apple",translateY:-800},{name:"peach",translateY:-900},{name:"grape",translateY:-1e3},{name:"watermelon",translateY:-1100},{name:"plum",translateY:-1200},{name:"pear",translateY:-1300},{name:"red-cherries",translateY:-1400},{name:"raspberry",translateY:-1500},{name:"mango",translateY:-1600},{name:"yellow-cherries",translateY:-1700}]},557:(e,t,s)=>{const a=s(566),i=s(390),r=s(636);e.exports=class{constructor(){this.fruits=[],this.gameEngine=null}newGame(){this.gameEngine=new i(this.fruits),this.gameEngine.HUD.vanishLeaderboard(),this.gameEngine.HUD.vanishBoard(),setTimeout((()=>{this.gameEngine.createCards(),this.gameEngine.HUD.hideLeaderboard(),this.gameEngine.HUD.appearBoard()}),300)}retrieveFruits(){r.forEach((e=>{this.fruits.push(new a(e.name,e.translateY))}))}attachEvent(){document.getElementById("new-game").addEventListener("click",(()=>this.newGame()))}init(){this.attachEvent(),this.retrieveFruits()}}},22:e=>{e.exports=class{constructor(e,t){this.DOMElement=null,this.found=!1,this.flipped=!1,this.fruit=e,this.flipCard=t}prepareCardDOM(e,t){this.DOMElement=document.importNode(e.content,!0).querySelector("li"),this.DOMElement.style.setProperty("--translateY",`${this.fruit.translateY}px`),this.DOMElement.addEventListener("click",(()=>this.flipCard(this))),t.append(this.DOMElement)}}},309:e=>{e.exports=class{constructor(){this.id=null,this.elapsedTime=0}end(){clearInterval(this.id)}start(e){this.id=setInterval((()=>e()),1e3)}}},566:e=>{e.exports=class{constructor(e,t){this.name=e,this.translateY=t,this.found=!1}}},390:(e,t,s)=>{const a=s(22),i=s(309),r=s(197);e.exports=class{constructor(e){this.fruitsPerGame=2,this.msBetweenFlip=1e3,this.maxSecondsPerGame=2,this.fruits=e.shuffle().slice(0,this.fruitsPerGame),this.cards=[],this.HUD=new r,this.flippedCards=0,this.canFlip=!0,this.finishedAt=null,this.clock=new i}refreshHUD(){this.HUD.setFlippedCards(this.flippedCards),this.HUD.setElapsedTime(this.clock.elapsedTime,this.maxSecondsPerGame)}submitScore(e){}displayLeaderboardHandler(){}newGameHandler(){this.HUD.vanishResults(),setTimeout((()=>{this.HUD.closeAllCards(),setTimeout((()=>{this.HUD.removeBlurBoard(),setTimeout((()=>{this.HUD.hideResultsForm()}),300)}),250)}),750)}gameFinished(){this.finishedAt=new Date,this.HUD.blurBoard(),this.clock.end(),this.canFlip=!1,this.HUD.displayResults(this.flippedCards,this.fruits.filter((e=>e.found)).length,this.fruitsPerGame,this.clock.elapsedTime,(()=>this.newGameHandler()),(e=>this.submitScore(e)),(()=>this.displayLeaderboardHandler()))}checkFoundPairs(){this.fruits.filter((e=>e.found)).length===this.fruitsPerGame&&this.gameFinished()}checkVisibleCards(e){this.canFlip=!1,e[0].fruit.name===e[1].fruit.name?(e.forEach((e=>{e.DOMElement.classList.add("Card--found"),e.found=!0,e.fruit.found=!0})),setTimeout((()=>{e.forEach((e=>e.DOMElement.classList.remove("Card--visible")))}),300),this.canFlip=!0,this.checkFoundPairs()):setTimeout((()=>{e.forEach((e=>{e.DOMElement.classList.remove("Card--visible"),e.canFlip=!0})),this.canFlip=!0}),this.msBetweenFlip)}checkElapsedTime(){this.clock.elapsedTime>=this.maxSecondsPerGame&&this.gameFinished()}incrementElapsedTime(){this.clock.elapsedTime+=1,this.refreshHUD(),this.checkElapsedTime()}flipCard(e){if(!this.canFlip)return;null===this.clock.id&&this.clock.start((()=>this.incrementElapsedTime())),e.DOMElement.classList.add("Card--visible"),e.flipped=!0,this.flippedCards+=1,this.refreshHUD();const t=this.cards.filter((e=>e.flipped));2===t.length&&(this.checkVisibleCards(t),t.forEach((e=>e.flipped=!1)))}createCards(){[...this.fruits,...this.fruits].shuffle().forEach((e=>{const t=new a(e,(e=>this.flipCard(e)));t.prepareCardDOM(this.HUD.cardTemplate,this.HUD.boardContainer),this.cards.push(t)}))}}},197:e=>{e.exports=class{constructor(){this.cardTemplate=document.getElementById("Card"),this.gameResultsTemplate=document.getElementById("GameResults"),this.gameResultsContainer=null,this.boardContainer=document.getElementById("Board"),this.leaderboardContainer=document.getElementById("Leaderboard"),this.flippedCardsSpan=document.querySelector(":scope #moves span"),this.elapsedTimeSpan=document.querySelector(":scope #elapsedTime span"),this.elapsedTimeProgressBar=document.querySelector(":scope #elapsedTime .ProgressBar")}formatElapsedTimeIntoPercent(e,t){return e/t*100+"%"}formatElapsedTime(e){const t=e%60<10?"0"+e%60:e%60;return`${Math.floor(e/60)}:${t}`}setElapsedTime(e,t){this.elapsedTimeSpan.innerHTML=this.formatElapsedTime(e),this.elapsedTimeProgressBar.style.setProperty("--width",this.formatElapsedTimeIntoPercent(e,t))}setFlippedCards(e){this.flippedCardsSpan.innerHTML=e}hideResultsForm(){this.gameResultsContainer.querySelector("p.onlyIfWon").outerHTML="",this.gameResultsContainer.querySelector("form").outerHTML=""}closeAllCards(){this.boardContainer.querySelectorAll(".Card").forEach((e=>{e.classList.add("Card--visible"),setTimeout((()=>{e.classList.remove("Card--found","Card--visible"),e.classList.add("Card--hidden")}),300)}))}displayResults(e,t,s,a,i,r,n){this.gameResultsContainer=document.importNode(this.gameResultsTemplate.content,!0).querySelector("section"),this.gameResultsContainer.querySelector("#GameResultsMoves").innerHTML=e,this.gameResultsContainer.querySelector("#GameResultsFound").innerHTML=t,this.gameResultsContainer.querySelector("#GameResultsPairs").innerHTML=s,this.gameResultsContainer.querySelector("#GameResultsElapsedTime").innerHTML=this.formatElapsedTime(a),t!==s?this.hideResultsForm():this.gameResultsContainer.querySelector("form").addEventListener("submit",(e=>{e.preventDefault(),r(document.getElementById("username").value)})),this.gameResultsContainer.querySelector('button[data-action="new-game"]').addEventListener("click",(()=>i())),this.gameResultsContainer.querySelector('button[data-action="leaderboard"]').addEventListener("click",(()=>n())),setTimeout((()=>{this.gameResultsContainer.classList.add("GameResults--visible")}),1e3),document.body.append(this.gameResultsContainer)}vanishResults(){this.gameResultsContainer.classList.remove("GameResults--visible")}hideLeaderboard(){this.leaderboardContainer.classList.add("Leaderboard--hidden")}vanishLeaderboard(){this.leaderboardContainer.classList.add("Leaderboard--vanish")}blurBoard(){this.boardContainer.classList.add("Board--blurred")}vanishBoard(){this.boardContainer.classList.add("Board--vanish")}appearBoard(){this.boardContainer.classList.remove("Board--vanish")}}},626:()=>{Array.prototype.shuffle=function(){let e,t=Array.from(this),s=t.length;for(;0!==s;)e=Math.floor(Math.random()*s),s--,[t[s],t[e]]=[t[e],t[s]];return t}}},t={};function s(a){var i=t[a];if(void 0!==i)return i.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,s),r.exports}(()=>{s(626);const e=s(557);document.addEventListener("DOMContentLoaded",(()=>{(new e).init()}))})()})();
//# sourceMappingURL=index.js.map