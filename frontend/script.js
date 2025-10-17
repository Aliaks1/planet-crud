const form = document.getElementById('planetForm');
const planetsTableBody = document.querySelector('#planetsTable tbody');
const planetIdInput = document.getElementById('planetId');
const nameInput = document.getElementById('name');
const systemInput = document.getElementById('system');
const climateInput = document.getElementById('climate');
const populationInput = document.getElementById('population');
const surfaceInput = document.getElementById('surface_type');
const diameterInput = document.getElementById('diameter');
const orbitalInput = document.getElementById('orbital_period');
const cancelBtn = document.getElementById('cancelBtn');

async function loadPlanets() {
  const res = await fetch('/api/planets');
  const data = await res.json();
  renderList(data);
}

function renderList(planets) {
  planetsTableBody.innerHTML = '';
  planets.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.name ?? ''}</td>
      <td>${p.system ?? ''}</td>
      <td>${p.climate ?? ''}</td>
      <td>${p.population ?? ''}</td>
      <td>${p.surface_type ?? ''}</td>
      <td>${p.diameter ?? ''}</td>
      <td>${p.orbital_period ?? ''}</td>
      <td>
        <button data-id="${p.id}" class="edit">Edit</button>
        <button data-id="${p.id}" class="delete">Delete</button>
      </td>
    `;
    planetsTableBody.appendChild(row);
  });
  attachButtons();
}

function attachButtons() {
  document.querySelectorAll('.edit').forEach(b => {
    b.addEventListener('click', async () => {
      const id = b.getAttribute('data-id');
      const res = await fetch(`/api/planets/${id}`);
      if (res.status !== 200) return alert('Not found');
      const p = await res.json();
      planetIdInput.value = p.id;
      nameInput.value = p.name || '';
      systemInput.value = p.system || '';
      climateInput.value = p.climate || '';
      populationInput.value = p.population || '';
      surfaceInput.value = p.surface_type || '';
      diameterInput.value = p.diameter || '';
      orbitalInput.value = p.orbital_period || '';
    });
  });
  document.querySelectorAll('.delete').forEach(b => {
    b.addEventListener('click', async () => {
      const id = b.getAttribute('data-id');
      const ok = confirm('Delete planet?');
      if (!ok) return;
      const res = await fetch(`/api/planets/${id}`, { method: 'DELETE' });
      if (res.status === 204) loadPlanets();
      else alert('Delete failed');
    });
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = planetIdInput.value;
  const payload = {
    name: nameInput.value,
    system: systemInput.value,
    climate: climateInput.value,
    population: populationInput.value ? Number(populationInput.value) : null,
    surface_type: surfaceInput.value,
    diameter: diameterInput.value ? Number(diameterInput.value) : null,
    orbital_period: orbitalInput.value ? Number(orbitalInput.value) : null
  };
  if (id) {
    const res = await fetch(`/api/planets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status === 200) {
      resetForm();
      loadPlanets();
    } else {
      const err = await res.json();
      alert(err.error || 'Update failed');
    }
  } else {
    const res = await fetch('/api/planets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status === 201) {
      resetForm();
      loadPlanets();
    } else {
      const err = await res.json();
      alert(err.error || 'Create failed');
    }
  }
});

cancelBtn.addEventListener('click', () => {
  resetForm();
});

function resetForm() {
  planetIdInput.value = '';
  nameInput.value = '';
  systemInput.value = '';
  climateInput.value = '';
  populationInput.value = '';
  surfaceInput.value = '';
  diameterInput.value = '';
  orbitalInput.value = '';
}

loadPlanets();
