// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Toggle mobile nav
  document.querySelectorAll('.menu-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('aria-controls') || 'navLinks';
      const links = document.getElementById(id) || document.querySelector('.nav-links');
      if (!links) return;
      const shown = links.style.display === 'flex' || links.style.display === 'block';
      links.style.display = shown ? 'none' : 'flex';
      btn.setAttribute('aria-expanded', String(!shown));
    });
  });

  // Accordion
  document.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      if (!content) return;
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
  });

  // Modal openers
  document.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.openModal;
      const modal = document.getElementById(id);
      if (modal) modal.style.display = 'flex';
    });
  });
  document.querySelectorAll('.modal .close').forEach(btn => btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none';
  }));

  // Load dynamic posts/events
  fetch('data/posts.json')
    .then(r => r.json())
    .then(data => {
      const events = document.getElementById('events');
      if (!events) return;
      if (!data.length) {
        events.innerHTML = '<p>No events found.</p>';
        return;
      }
      events.innerHTML = data.map(post => `
        <article class="card">
          <h3>${post.title}</h3>
          <p>${post.summary}</p>
          <p><small>${post.date}</small></p>
        </article>`).join('');
    })
    .catch(err => {
      const events = document.getElementById('events');
      if (events) events.innerHTML = '<p>Could not load events.</p>';
      console.warn('Could not load posts', err);
    });

  // Simple search
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      document.querySelectorAll('#events .card').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }
});
