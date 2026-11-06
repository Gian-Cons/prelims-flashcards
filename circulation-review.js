let index=0;
const attempts=new Map();
const el=id=>document.getElementById(id);
let celebrationTimer;
function clearConfetti(){clearTimeout(celebrationTimer);el('confetti').replaceChildren();}
function celebrate(){
 clearConfetti();
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const colors=['#b52268','#f58cba','#d6a340','#9b70bd','#ffd2e5'];
 for(let n=0;n<65;n++){
  const piece=document.createElement('span');piece.className='confetti-piece';piece.style.background=colors[n%colors.length];
  piece.style.left=`${Math.random()*100}%`;el('confetti').appendChild(piece);
  piece.animate([{transform:'translateY(-30px) rotate(0deg)',opacity:1},{transform:`translate(${(Math.random()-.5)*260}px, ${window.innerHeight+40}px) rotate(${Math.random()*900-450}deg)`,opacity:0}],{duration:1300+Math.random()*900,delay:Math.random()*180,easing:'cubic-bezier(.15,.6,.5,1)',fill:'forwards'});
 }
 celebrationTimer=setTimeout(clearConfetti,2500);
}
function choose(n){
 if(attempts.has(index))return;
 attempts.set(index,n);render();el('feedback').focus();
 if(n===cards[index][5])celebrate();
}
function render(){
 const [topic,q,explanation,p,options,correct]=cards[index];
 const answered=attempts.has(index),selected=attempts.get(index);
 el('topic').textContent=topic;el('count').textContent=`Question ${index+1} of ${cards.length}`;
 el('question').textContent=q;el('source').textContent=`Circulation notes · page ${p}`;
 el('choices').replaceChildren();
 options.forEach((option,n)=>{
  const button=document.createElement('button');button.type='button';button.className='choice';
  button.setAttribute('aria-pressed',String(answered&&selected===n));button.disabled=answered;
  const letter=document.createElement('span');letter.className='letter';letter.textContent=String.fromCharCode(65+n);letter.setAttribute('aria-hidden','true');
  const text=document.createElement('span');text.textContent=option;
  if(answered&&n===correct){button.classList.add('correct');text.textContent+=' — Correct answer';}
  if(answered&&n===selected){text.textContent+=' — Your choice';if(n!==correct)button.classList.add('incorrect');}
  button.appendChild(letter);button.appendChild(text);button.setAttribute('aria-label',`${String.fromCharCode(65+n)}. ${text.textContent}`);
  button.addEventListener('click',()=>choose(n));el('choices').appendChild(button);
 });
 el('feedback').hidden=!answered;el('explanation').hidden=!answered;
 el('feedback').textContent=!answered?'':selected===correct?'Correct! ✨':selected===null?`Correct answer: ${String.fromCharCode(65+correct)}. ${options[correct]}`:`Not quite. Correct answer: ${String.fromCharCode(65+correct)}. ${options[correct]}`;
 el('explanation').textContent=answered?explanation:'';
 el('reveal').disabled=answered;el('reveal').textContent=answered?'Answer shown':'Reveal answer';
 el('prev').disabled=index===0;el('next').textContent=index===cards.length-1?'Start again':'Next question';
 el('progress').style.width=`${(index+1)/cards.length*100}%`;
 document.querySelector('.bar').setAttribute('aria-valuenow',String(index+1));
}
function move(delta){clearConfetti();index=Math.max(0,Math.min(cards.length-1,index+delta));render();el('question').focus();}
el('prev').addEventListener('click',()=>move(-1));
el('next').addEventListener('click',()=>{if(index===cards.length-1){clearConfetti();attempts.clear();index=0;render();el('question').focus();}else move(1);});
el('reveal').addEventListener('click',()=>{if(!attempts.has(index)){attempts.set(index,null);render();el('feedback').focus();}});
render();
