(()=>{var e={636:e=>{e.exports=[{name:"red-apple",translateY:0},{name:"bananas",translateY:-100},{name:"orange",translateY:-200},{name:"lime",translateY:-300},{name:"pomegranate",translateY:-400},{name:"apricot",translateY:-500},{name:"lemon",translateY:-600},{name:"strawberry",translateY:-700},{name:"green-apple",translateY:-800},{name:"peach",translateY:-900},{name:"grape",translateY:-1e3},{name:"watermelon",translateY:-1100},{name:"plum",translateY:-1200},{name:"pear",translateY:-1300},{name:"red-cherries",translateY:-1400},{name:"raspberry",translateY:-1500},{name:"mango",translateY:-1600},{name:"yellow-cherries",translateY:-1700}]},557:(e,t,a)=>{const n=a(566),s=a(390),r=a(636);e.exports=class{constructor(){this.fruits=[],this.gameEngine=null}newGame(){this.gameEngine=new s(this.fruits),this.gameEngine.createCards()}retrieveFruits(){r.forEach((e=>{this.fruits.push(new n(e.name,e.translateY))}))}attachEvent(){document.getElementById("new-game").addEventListener("click",(()=>this.newGame()))}init(){this.attachEvent(),this.retrieveFruits()}}},22:e=>{e.exports=class{constructor(e){this.DOMElement=null,this.found=!1,this.flipped=!1,this.fruit=e}}},566:e=>{e.exports=class{constructor(e,t){this.name=e,this.translateY=t,this.found=!1}}},390:(e,t,a)=>{const n=a(22);e.exports=class{constructor(e){this.fruitsPerGame=14,this.msBetweenFlip=1e3,this.maxSecondsPerGame=120,this.fruits=e,this.cards=[]}createCards(){this.fruits.forEach((e=>{const t=new n(e);this.cards.push(t)})),console.log(this.cards)}}}},t={};function a(n){var s=t[n];if(void 0!==s)return s.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,a),r.exports}(()=>{const e=a(557);document.addEventListener("DOMContentLoaded",(()=>{(new e).init()}))})()})();
//# sourceMappingURL=index.js.map