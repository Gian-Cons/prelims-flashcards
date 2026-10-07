let index=0;
let answers=Array(cards.length).fill(null);
const el=id=>document.getElementById(id);
function render(){
 const [topic,q,,p,options]=cards[index];
 const answered=answers.filter(a=>a!==null).length;
 el('topic').textContent=topic;el('count').textContent=`Question ${index+1} of ${cards.length}`;
 el('question').textContent=q;el('source').textContent=`Notes · page ${p}`;
 el('choices').replaceChildren();
 options.forEach((option,n)=>{
  const button=document.createElement('button');button.type='button';button.className='choice';button.setAttribute('aria-pressed',String(answers[index]===n));
  const letter=document.createElement('span');letter.className='letter';letter.textContent=String.fromCharCode(65+n);letter.setAttribute('aria-hidden','true');
  const text=document.createElement('span');text.textContent=option;button.appendChild(letter);button.appendChild(text);button.setAttribute('aria-label',`${String.fromCharCode(65+n)}. ${option}`);
  button.addEventListener('click',()=>{answers[index]=n;render();el('choices').children[n].focus();});el('choices').appendChild(button);
 });
 el('prev').disabled=index===0;
 const last=index===cards.length-1;
 el('next').textContent=last?'Finish quiz':'Next question';
 el('next').disabled=last?answered!==cards.length:answers[index]===null;
 el('answered').textContent=`${answered} of ${cards.length} answered`+(last&&answered<cards.length?' · Answer every question to finish.':'');
 el('progress').style.width=`${answered/cards.length*100}%`;document.querySelector('.bar').setAttribute('aria-valuenow',String(answered));
}
function move(delta){index=Math.max(0,Math.min(cards.length-1,index+delta));render();el('question').setAttribute('tabindex','-1');el('question').focus();}
function finish(){
 if(answers.some(a=>a===null))return;
 const score=cards.reduce((total,c,i)=>total+Number(answers[i]===c[5]),0);
 el('score').textContent=`${score} / ${cards.length}`;el('percentage').textContent=`${Math.round(score/cards.length*100)}% correct · ${cards.length-score} to review`;
 el('result-message').textContent=score===cards.length?'A perfect score! Your crown is well earned.':score/cards.length>=.8?'A lovely result! Review the missed questions to polish your knowledge.':'Every practice round helps. Review the explanations, then give it another try.';
 el('review').replaceChildren();
 cards.forEach(([topic,q,a,p,options,correct],i)=>{
  const detail=document.createElement('details');const summary=document.createElement('summary');
  const tag=document.createElement('span');tag.className='result-tag';tag.textContent=answers[i]===correct?'Correct':'Incorrect';summary.appendChild(tag);
  const question=document.createElement('span');question.textContent=`${i+1}. ${q}`;summary.appendChild(question);detail.appendChild(summary);
  for(const [cls,text] of [['review-answer',`Your answer: ${String.fromCharCode(65+answers[i])}. ${options[answers[i]]}`],['review-answer',`Correct answer: ${String.fromCharCode(65+correct)}. ${options[correct]}`],['review-answer',a],['review-meta',`${topic} · Notes page ${p}`]]){
   const para=document.createElement('p');para.className=cls;para.textContent=text;detail.appendChild(para);
  }
  el('review').appendChild(detail);
 });
 el('quiz').hidden=true;el('results').hidden=false;el('result-title').focus();window.scrollTo({top:0,behavior:'auto'});
}
el('prev').addEventListener('click',()=>move(-1));el('next').addEventListener('click',()=>{if(index===cards.length-1)finish();else if(answers[index]!==null)move(1);});
el('retry').addEventListener('click',()=>{index=0;answers=Array(cards.length).fill(null);el('results').hidden=true;el('quiz').hidden=false;render();el('question').focus();window.scrollTo({top:0,behavior:'auto'});});
render();
