'use strict';

// Five-point grade scale. The calculator accepts grades, not percentage scores.
const GRADE_POINTS = Object.freeze({ A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 });
const STORAGE_KEY = 'gradepilot-courses-v1';
const rowsEl = document.getElementById('course-rows');
const statusEl = document.getElementById('save-status');
const emptyEl = document.getElementById('empty');
let courses = loadCourses();

function loadCourses() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter(item => item && typeof item.id === 'string').map(item => ({
      id: item.id,
      name: String(item.name || '').slice(0, 100),
      credits: String(item.credits ?? ''),
      grade: Object.hasOwn(GRADE_POINTS, item.grade) ? item.grade : 'A'
    })).slice(0, 100);
  } catch { return []; }
}

function saveCourses() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    statusEl.textContent = 'Saved locally on this device';
  } catch {
    statusEl.textContent = 'Browser storage unavailable — changes are not saved';
  }
}

function validCredits(value) {
  const number = Number(value);
  return String(value).trim() !== '' && Number.isInteger(number) && number >= 1 && number <= 30;
}

function calculateGPA() {
  let totalCredits = 0;
  let weightedPoints = 0;
  let included = 0;
  for (const course of courses) {
    if (!validCredits(course.credits) || !Object.hasOwn(GRADE_POINTS, course.grade)) continue;
    const units = Number(course.credits);
    totalCredits += units;
    weightedPoints += units * GRADE_POINTS[course.grade];
    included++;
  }
  const gpa = totalCredits ? weightedPoints / totalCredits : 0;
  document.getElementById('gpa').textContent = gpa.toFixed(2);
  document.getElementById('credits').textContent = String(totalCredits);
  document.getElementById('course-count').textContent = String(included);
  document.getElementById('classification').textContent = totalCredits
    ? `${included} valid course${included === 1 ? '' : 's'} included`
    : 'Add valid course credits to begin';
  emptyEl.hidden = courses.length > 0;
}

function makeInput({ type, value, label, className, min, max, maxLength }) {
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.className = `field ${className || ''}`;
  input.setAttribute('aria-label', label);
  if (min !== undefined) input.min = String(min);
  if (max !== undefined) input.max = String(max);
  if (maxLength !== undefined) input.maxLength = maxLength;
  return input;
}

function renderRows() {
  rowsEl.replaceChildren();
  for (const course of courses) {
    const tr = document.createElement('tr');
    const nameTd = document.createElement('td');
    const nameInput = makeInput({ type: 'text', value: course.name, label: 'Course name or code', maxLength: 100 });
    nameInput.placeholder = 'e.g. COS 106';
    nameInput.addEventListener('input', () => { course.name = nameInput.value; saveCourses(); });
    nameTd.append(nameInput);

    const creditsTd = document.createElement('td');
    const creditsInput = makeInput({ type: 'number', value: course.credits, label: `Credit units for ${course.name || 'course'}`, className: 'credits-field', min: 1, max: 30 });
    creditsInput.placeholder = '1–30';
    creditsInput.addEventListener('input', () => {
      course.credits = creditsInput.value;
      creditsInput.setAttribute('aria-invalid', String(creditsInput.value !== '' && !validCredits(creditsInput.value)));
      saveCourses(); calculateGPA();
    });
    creditsTd.append(creditsInput);

    const gradeTd = document.createElement('td');
    const gradeSelect = document.createElement('select');
    gradeSelect.className = 'field grade-field';
    gradeSelect.setAttribute('aria-label', `Grade for ${course.name || 'course'}`);
    for (const [letter, points] of Object.entries(GRADE_POINTS)) {
      const option = document.createElement('option');
      option.value = letter;
      option.textContent = `${letter} (${points} pts)`;
      gradeSelect.append(option);
    }
    gradeSelect.value = course.grade;
    gradeSelect.addEventListener('change', () => { course.grade = gradeSelect.value; saveCourses(); calculateGPA(); });
    gradeTd.append(gradeSelect);

    const removeTd = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button'; removeBtn.className = 'remove'; removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', `Remove ${course.name || 'course'}`);
    removeBtn.addEventListener('click', () => { courses = courses.filter(c => c.id !== course.id); saveCourses(); renderRows(); });
    removeTd.append(removeBtn);
    tr.append(nameTd, creditsTd, gradeTd, removeTd);
    rowsEl.append(tr);
  }
  calculateGPA();
}

function addCourse() {
  if (courses.length >= 100) { window.alert('Maximum of 100 courses reached.'); return; }
  courses.push({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, name: '', credits: '', grade: 'A' });
  saveCourses(); renderRows();
  rowsEl.lastElementChild?.querySelector('input')?.focus();
}

function csvCell(value) {
  const safe = String(value).replace(/^[\s]*[=+\-@]/, "'$&");
  return `"${safe.replaceAll('"', '""')}"`;
}

function exportCSV() {
  if (!courses.length) { window.alert('Add at least one course before exporting.'); return; }
  const lines = [['Course', 'Credit Units', 'Grade', 'Grade Points'], ...courses.map(c => [c.name, c.credits, c.grade, GRADE_POINTS[c.grade]])];
  const csv = lines.map(row => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'gradepilot-courses.csv';
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.getElementById('add-course').addEventListener('click', addCourse);
document.getElementById('export').addEventListener('click', exportCSV);
document.getElementById('clear').addEventListener('click', () => {
  if (!courses.length || !window.confirm('Remove all courses? This cannot be undone.')) return;
  courses = []; saveCourses(); renderRows();
});
renderRows();
