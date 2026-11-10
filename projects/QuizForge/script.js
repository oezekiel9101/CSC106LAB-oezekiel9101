'use strict';
// QuizForge: self-contained vanilla JavaScript quiz with 15 curated questions.
const questions = [
 {topic:'HTML',question:'Which HTML element creates a hyperlink?',options:['<link>','<a>','<href>','<url>'],answer:1,explanation:'The <a> (anchor) element creates a clickable hyperlink using its href attribute.'},
 {topic:'HTML',question:'Which tag represents the largest heading by default?',options:['<h6>','<head>','<h1>','<header>'],answer:2,explanation:'<h1> is the highest-level HTML heading.'},
 {topic:'HTML',question:'What is the purpose of the alt attribute on an image?',options:['Set image width','Provide alternative text','Link a stylesheet','Change image colour'],answer:1,explanation:'alt provides a text alternative for images, supporting accessibility.'},
 {topic:'CSS',question:'Which CSS property changes the text colour?',options:['font-color','text-style','color','background'],answer:2,explanation:'The color property controls the foreground text colour.'},
 {topic:'CSS',question:'Which layout model is designed for one-dimensional alignment?',options:['Flexbox','Float','Table','Position fixed'],answer:0,explanation:'Flexbox arranges items along one main axis: row or column.'},
 {topic:'CSS',question:'How do you select an element with id="hero" in CSS?',options:['.hero','hero','#hero','*hero'],answer:2,explanation:'A hash (#) selects an element by its id attribute.'},
 {topic:'JavaScript',question:'Which keyword declares a block-scoped variable that can be reassigned?',options:['const','let','fixed','define'],answer:1,explanation:'let creates a block-scoped binding whose value can be reassigned.'},
 {topic:'JavaScript',question:'Which method selects an element by its ID?',options:['document.getElementById()','document.queryAll()','window.selectId()','document.findId()'],answer:0,explanation:'document.getElementById() returns the element with the specified ID.'},
 {topic:'JavaScript',question:'What does JSON.parse() do?',options:['Creates CSS','Converts JSON text to a JavaScript value','Saves a file','Adds an HTML element'],answer:1,explanation:'JSON.parse() converts valid JSON-formatted text into a JavaScript value.'},
 {topic:'Python',question:'Which Python keyword starts a function definition?',options:['function','func','def','define'],answer:2,explanation:'Python functions are defined using the def keyword.'},
 {topic:'Python',question:'Which built-in Python function returns the length of a list?',options:['size()','countall()','length()','len()'],answer:3,explanation:'len() returns the number of items in a sequence or collection.'},
 {topic:'Python',question:'Which symbol starts a single-line comment in Python?',options:['//','#','<!--','**'],answer:1,explanation:'Python uses # to begin a comment.'},
 {topic:'MySQL',question:'Which SQL command retrieves rows from a table?',options:['GET','SELECT','FETCH ALL','SHOW ROWS'],answer:1,explanation:'SELECT retrieves data from one or more tables.'},
 {topic:'MySQL',question:'Which SQL clause filters rows based on a condition?',options:['WHERE','ORDER BY','GROUP BY','LIMIT'],answer:0,explanation:'WHERE specifies which rows match a condition.'},
 {topic:'MySQL',question:'Which SQL statement adds a new row to a table?',options:['ADD ROW','APPEND','INSERT INTO','UPDATE'],answer:2,explanation:'INSERT INTO adds new records to a table.'}
];
const $ = id => document.getElementById(id);
const TOTAL = questions.length;
const SECONDS = 20;
const BEST_KEY = 'quizforge_high_score_v1';
let index = 0, score = 0, remaining = SECONDS, intervalId = null, answered = false;
function bestScore(){try{const n=Number(localStorage.getItem(BEST_KEY));return Number.isFinite(n)?Math.max(0,Math.min(TOTAL,n)):0}catch{return 0}}
function saveBest(value){try{localStorage.setItem(BEST_KEY,String(value))}catch{/* Works without storage permission. */}}
function show(section){['welcome','quiz','results'].forEach(id=>$(id).classList.toggle('hidden',id!==section))}
function updateBest(){$('homeBest').textContent=`${bestScore()} / ${TOTAL}`}
function start(){index=0;score=0;show('quiz');render()}
function render(){clearInterval(intervalId);answered=false;remaining=SECONDS;const q=questions[index];$('counter').textContent=`QUESTION ${index+1} / ${TOTAL}`;$('progressTrack').setAttribute('aria-valuenow',String(index));$('progressFill').style.width=`${index/TOTAL*100}%`;$('topic').textContent=q.topic;$('question').textContent=q.question;$('answers').replaceChildren();$('feedback').textContent='Choose the best answer before time runs out.';$('feedback').className='feedback';$('liveScore').textContent=`Score: ${score}`;$('nextBtn').disabled=true;$('nextBtn').textContent=index===TOTAL-1?'See Results →':'Next Question →';q.options.forEach((option,i)=>{const btn=document.createElement('button');btn.type='button';btn.className='answer';const letter=document.createElement('span');letter.className='letter';letter.textContent='ABCD'[i];const label=document.createElement('span');label.textContent=option;btn.append(letter,label);btn.addEventListener('click',()=>choose(i));$('answers').append(btn)});tickDisplay();intervalId=setInterval(()=>{remaining--;tickDisplay();if(remaining<=0)choose(-1)},1000)}
function tickDisplay(){$('timer').textContent=`⏱ ${remaining}s`;$('timer').classList.toggle('warning',remaining<=5)}
function choose(choice){if(answered)return;answered=true;clearInterval(intervalId);const q=questions[index];const correct=choice===q.answer;if(correct)score++;[...$('answers').children].forEach((btn,i)=>{btn.disabled=true;if(i===q.answer)btn.classList.add('correct');else if(i===choice)btn.classList.add('wrong')});$('feedback').className=`feedback ${correct?'good':'bad'}`;$('feedback').textContent=`${correct?'✓ Correct!':choice===-1?'⌛ Time is up!':'✕ Not quite.'} ${q.explanation}`;$('liveScore').textContent=`Score: ${score}`;$('nextBtn').disabled=false}
function next(){if(!answered)return;if(index<TOTAL-1){index++;render()}else finish()}
function finish(){clearInterval(intervalId);if(score>bestScore())saveBest(score);show('results');$('progressTrack').setAttribute('aria-valuenow',String(TOTAL));$('resultTitle').textContent=score>=13?'Outstanding work!':score>=9?'Great effort!':'Keep learning and improving!';$('finalScore').textContent=`${score} / ${TOTAL}`;$('correctCount').textContent=String(score);$('accuracy').textContent=`${Math.round(score/TOTAL*100)}%`;$('resultBest').textContent=`${bestScore()} / ${TOTAL}`;$('resultText').textContent=`You answered ${score} out of ${TOTAL} questions correctly. Every attempt is a chance to sharpen your programming knowledge.`;updateBest()}
$('startBtn').addEventListener('click',start);$('nextBtn').addEventListener('click',next);$('restartBtn').addEventListener('click',start);updateBest();
