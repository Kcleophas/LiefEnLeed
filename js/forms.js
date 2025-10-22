// js/forms.js
document.addEventListener('DOMContentLoaded', () => {
  function showError(input, message) {
    let err = input.parentElement.querySelector('.form-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'form-error';
      input.parentElement.appendChild(err);
    }
    err.textContent = message;
    input.classList.add('invalid');
  }
  function clearError(input) {
    const err = input.parentElement.querySelector('.form-error');
    if (err) err.textContent = '';
    input.classList.remove('invalid');
  }

  document.querySelectorAll('form.validate').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const phone = form.querySelector('[name="phone"]');

      if (!name.value.trim() || name.value.trim().length < 2) {
        showError(name, 'Please enter your full name (min 2 characters).');
        valid = false;
      } else clearError(name);

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email.value)) {
        showError(email, 'Enter a valid email address.');
        valid = false;
      } else clearError(email);

      if (phone && phone.value && !/^\+?[0-9\s\-]{7,15}$/.test(phone.value)) {
        showError(phone, 'Enter a valid phone number (digits, +, spaces allowed).');
        valid = false;
      } else if (phone) clearError(phone);

      if (!valid) return;

      const formData = new FormData(form);
      const payload = {};
      formData.forEach((v, k) => payload[k] = v);

      try {
        const response = await fetch(form.action || '/submit', {
          method: form.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          // Simulate response for enquiries (show cost/availability)
          if (form.action.includes('enquiry')) {
            const out = document.createElement('div');
            out.className = 'card';
            out.innerHTML = `<h3>Estimated cost</h3><p>Volunteering: Free — Sponsorship packages available from R2,500.</p>`;
            form.parentElement.appendChild(out);
          } else {
            alert('Thank you — your message has been sent.');
          }
          form.reset();
          return;
        }
        throw new Error('Non-OK response');
      } catch (err) {
        if (form.dataset.mailto) {
          const to = form.dataset.mailto;
          const subject = encodeURIComponent(form.dataset.subject || 'Website message');
          const body = encodeURIComponent(Object.entries(payload).map(([k, v]) => `${k}: ${v}`).join('\n'));
          window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
          return;
        }
        alert('Could not send via AJAX; data saved locally.');
        console.warn(err);
      }
    });
  });
});
