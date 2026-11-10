// Client-side demonstration only: no messages are transmitted.
const form = document.getElementById('contact-form');
const phone = document.getElementById('contact-phone');
const error = document.getElementById('contact-error');
const modal = document.getElementById('contact-modal');
const homeButton = document.getElementById('modal-home');
phone.addEventListener('input', () => { phone.value = phone.value.replace(/\D/g, '').slice(0, 15); });
form.addEventListener('submit', event => {
  event.preventDefault();
  error.textContent = '';
  const name = document.getElementById('contact-name');
  const email = document.getElementById('contact-email');
  const subject = document.getElementById('contact-subject');
  const message = document.getElementById('contact-message');
  for (const field of [name, email, phone, subject, message]) {
    if (field.type !== 'email') field.value = field.value.trim();
    if (!field.checkValidity()) {
      error.textContent = field.validity.valueMissing ? 'Please complete all required fields.' : field === phone ? 'Enter a valid phone number with 7–15 digits.' : field === message ? 'Your message must be at least 10 characters.' : 'Please check the information entered.';
      field.focus(); return;
    }
  }
  modal.hidden = false;
  homeButton.focus();
  form.reset();
});
homeButton.addEventListener('click', () => { window.location.href = 'index.html'; });
modal.addEventListener('keydown', event => { if (event.key === 'Escape') { modal.hidden = true; document.querySelector('.contact-submit').focus(); } });
