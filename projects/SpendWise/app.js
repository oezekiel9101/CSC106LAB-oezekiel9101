'use strict';
const KEY = 'spendwise.transactions.v1';
const categories = {
  income: ['Salary', 'Freelance', 'Gift', 'Business', 'Other income'],
  expense: ['Food', 'Transport', 'Bills', 'Shopping', 'Education', 'Health', 'Entertainment', 'Other expense']
};
const $ = (id) => document.getElementById(id);
const money = (value) => new Intl.NumberFormat('en-NG', {style:'currency',currency:'NGN',minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
function readSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(t => t && typeof t.id === 'string' && typeof t.description === 'string' && ['income','expense'].includes(t.type) && Number.isFinite(t.amount) && t.amount > 0 && typeof t.category === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date));
  } catch { return []; }
}
let transactions = readSaved();
function persist() { try { localStorage.setItem(KEY, JSON.stringify(transactions)); return true; } catch { alert('Your browser could not save these records. Please check your storage settings.'); return false; } }
function notify(message) { $('notice').textContent = message; }
function setCategories(type, selected) {
  $('category').replaceChildren(...categories[type].map(name => { const option = document.createElement('option'); option.value = name; option.textContent = name; return option; }));
  if (selected && categories[type].includes(selected)) $('category').value = selected;
}
function openForm(record) {
  $('transactionForm').reset(); $('editId').value = record?.id || '';
  $('dialogTitle').textContent = record ? 'Edit transaction' : 'New transaction';
  $('entryType').value = record?.type || 'expense'; setCategories($('entryType').value, record?.category);
  $('description').value = record?.description || '';
  $('amount').value = record?.amount ?? '';
  $('date').value = record?.date || today();
  $('transactionDialog').showModal();
}
function render() {
  const income = transactions.filter(t => t.type === 'income').reduce((sum,t) => sum+t.amount,0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum,t) => sum+t.amount,0);
  $('income').textContent = money(income); $('expenses').textContent = money(expenses); $('balance').textContent = money(income-expenses);
  $('count').textContent = `${transactions.length} record${transactions.length===1?'':'s'}`;
  const oldCategory = $('categoryFilter').value;
  const allCategories = [...new Set(transactions.map(t => t.category))].sort();
  $('categoryFilter').replaceChildren(new Option('All categories','all'),...allCategories.map(c => new Option(c,c)));
  $('categoryFilter').value = allCategories.includes(oldCategory) ? oldCategory : 'all';
  const type = $('typeFilter').value, category = $('categoryFilter').value, query = $('search').value.trim().toLocaleLowerCase();
  const filtered = transactions.filter(t => (type==='all'||t.type===type) && (category==='all'||t.category===category) && (t.description.toLocaleLowerCase().includes(query)||t.category.toLocaleLowerCase().includes(query))).sort((a,b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const tbody = $('rows'); tbody.replaceChildren();
  for (const t of filtered) {
    const tr = document.createElement('tr');
    const name = document.createElement('td'); name.textContent = t.description;
    const sub = document.createElement('span'); sub.className='sub'; sub.textContent=t.category; name.append(sub);
    const date = document.createElement('td'); date.textContent = t.date;
    const amount = document.createElement('td'); amount.className=`amount ${t.type}`; amount.textContent=`${t.type==='income'?'+':'−'} ${money(t.amount)}`;
    const actions = document.createElement('td'); const wrap=document.createElement('div'); wrap.className='row-actions';
    const edit=document.createElement('button'); edit.textContent='Edit'; edit.setAttribute('aria-label',`Edit ${t.description}`); edit.addEventListener('click',()=>openForm(t));
    const del=document.createElement('button'); del.textContent='Delete'; del.setAttribute('aria-label',`Delete ${t.description}`); del.addEventListener('click',()=>{if(confirm(`Delete "${t.description}"?`)){transactions=transactions.filter(x=>x.id!==t.id);persist();render();notify('Transaction deleted.');}});
    wrap.append(edit,del); actions.append(wrap); tr.append(name,date,amount,actions); tbody.append(tr);
  }
  $('empty').hidden = filtered.length!==0;
  const breakdown = new Map();
  transactions.filter(t=>t.type==='expense').forEach(t=>breakdown.set(t.category,(breakdown.get(t.category)||0)+t.amount));
  $('breakdown').replaceChildren();
  if (!breakdown.size) { const p=document.createElement('p'); p.textContent='Your spending categories will appear here once you add an expense.'; $('breakdown').append(p); }
  for (const [name,total] of [...breakdown.entries()].sort((a,b)=>b[1]-a[1])) {
    const row=document.createElement('div'); row.className='break-row';
    const label=document.createElement('div'); label.className='break-label';
    const strong=document.createElement('b'); strong.textContent=name;
    const value=document.createElement('span'); value.textContent=money(total); label.append(strong,value);
    const track=document.createElement('div'); track.className='track'; const fill=document.createElement('div'); fill.className='fill'; fill.style.width=`${expenses?total/expenses*100:0}%`; track.append(fill); row.append(label,track); $('breakdown').append(row);
  }
}
$('addBtn').addEventListener('click',()=>openForm());
$('closeBtn').addEventListener('click',()=>$('transactionDialog').close());
$('cancelBtn').addEventListener('click',()=>$('transactionDialog').close());
$('entryType').addEventListener('change',()=>setCategories($('entryType').value));
$('transactionForm').addEventListener('submit',event=>{
  event.preventDefault();
  const amount=Number($('amount').value),description=$('description').value.trim(),type=$('entryType').value,category=$('category').value,date=$('date').value;
  if (!description || !Number.isFinite(amount) || amount<=0 || amount>1e12 || !categories[type]?.includes(category) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T12:00:00`).getTime())) { alert('Please enter a valid description, amount, category and date.'); return; }
  const id=$('editId').value;
  if (id) { const record=transactions.find(t=>t.id===id); if(!record)return; Object.assign(record,{description,amount,type,category,date}); }
  else transactions.push({id:crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,description,amount,type,category,date,createdAt:new Date().toISOString()});
  persist(); $('transactionDialog').close(); render(); notify(id?'Transaction updated.':'Transaction added.');
});
for(const id of ['typeFilter','categoryFilter']) $(id).addEventListener('change',render);
$('search').addEventListener('input',render);
$('exportBtn').addEventListener('click',()=>{
  if(!transactions.length){notify('Add a transaction before exporting.');return;}
  const quote = value => `"${String(value).replace(/"/g,'""')}"`;
  const csv = [['Date','Type','Description','Category','Amount (NGN)'],...transactions.map(t=>[t.date,t.type,t.description,t.category,t.amount])].map(row=>row.map(quote).join(',')).join('\r\n');
  const blob=new Blob(['\uFEFF',csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='spendwise-transactions.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  notify('CSV export prepared.');
});
render();
