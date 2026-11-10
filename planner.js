"use strict";
const STORAGE_KEY = 'oluwafemi-academic-planner-v1';
const form = document.querySelector('#task-form');
const taskList = document.querySelector('#task-list');
const emptyState = document.querySelector('#task-empty');
const message = document.querySelector('#form-message');
const search = document.querySelector('#task-search');
let filter = 'all';
let tasks = [];
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (Array.isArray(saved)) tasks = saved.filter(t => t && typeof t.id === 'string' && typeof t.title === 'string');
} catch (error) { message.textContent = 'Saved tasks could not be loaded.'; }
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  catch (error) { message.textContent = 'Browser storage is unavailable; changes may not be saved.'; }
}
function localToday() {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth()+1).padStart(2,'0'), String(now.getDate()).padStart(2,'0')].join('-');
}
function make(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
function render() {
  const today = localToday();
  document.querySelector('#total-count').textContent = tasks.length;
  document.querySelector('#pending-count').textContent = tasks.filter(t => !t.done).length;
  document.querySelector('#completed-count').textContent = tasks.filter(t => t.done).length;
  document.querySelector('#overdue-count').textContent = tasks.filter(t => !t.done && t.date < today).length;
  const term = search.value.trim().toLowerCase();
  const visible = tasks.filter(t => (filter === 'all' || (filter === 'completed' ? t.done : !t.done)) && (t.title.toLowerCase().includes(term) || (t.course || '').toLowerCase().includes(term)))
    .sort((a,b) => Number(a.done)-Number(b.done) || a.date.localeCompare(b.date) || a.created-b.created);
  taskList.replaceChildren();
  emptyState.hidden = visible.length > 0;
  emptyState.textContent = tasks.length ? 'No tasks match this filter or search.' : 'No tasks yet. Add your first academic task.';
  visible.forEach(task => {
    const item = make('article','task-item'+(task.done?' done':''));
    const check = make('input','task-check'); check.type='checkbox'; check.checked=!!task.done; check.setAttribute('aria-label','Mark '+task.title+' completed');
    check.addEventListener('change',() => {task.done=check.checked;persist();render();});
    const content = make('div','task-content'); content.append(make('h3','',task.title));
    const meta = make('div','task-meta');
    [task.course,task.priority+' priority', 'Due '+task.date].filter(Boolean).forEach(value=>meta.append(make('span','',value)));
    if (!task.done && task.date < today) meta.append(make('span','overdue','Overdue'));
    content.append(meta);
    if (task.notes) content.append(make('p','task-notes',task.notes));
    const del = make('button','task-delete','Delete');del.type='button';del.setAttribute('aria-label','Delete '+task.title);
    del.addEventListener('click',()=>{if(confirm('Delete this task?')){tasks=tasks.filter(t=>t.id!==task.id);persist();render();}});
    item.append(check,content,del);taskList.append(item);
  });
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const title = form.elements.title.value.trim();
  const date = form.elements.date.value;
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date+'T00:00:00'))) {message.textContent='Please enter a task title and a valid due date.';return;}
  const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now())+'-'+Math.random();
  tasks.push({id,title,date,course:form.elements.course.value.trim(),priority:form.elements.priority.value,notes:form.elements.notes.value.trim(),done:false,created:Date.now()});
  persist();form.reset();message.textContent='Task added successfully.';render();
});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  render();
}));
search.addEventListener('input',render);
document.querySelector('#clear-completed').addEventListener('click',()=>{
  if (!tasks.some(t=>t.done)) {message.textContent='There are no completed tasks to clear.';return;}
  if (confirm('Remove all completed tasks?')) {tasks=tasks.filter(t=>!t.done);persist();message.textContent='Completed tasks cleared.';render();}
});
render();
