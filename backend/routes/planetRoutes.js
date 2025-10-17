const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const dbPath = path.join(__dirname, '..', '..', 'planets.db');
const db = new sqlite3.Database(dbPath);

router.get('/api/planets', (req, res) => {
  db.all('SELECT * FROM planets', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

router.get('/api/planets/:id', (req, res) => {
  const id = Number(req.params.id);
  db.get('SELECT * FROM planets WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Planet not found' });
    res.json(row);
  });
});

router.post('/api/planets', (req, res) => {
  const { name, system, climate, population, surface_type, diameter, orbital_period } = req.body;
  if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Invalid name' });
  if (diameter !== undefined && (isNaN(diameter) || Number(diameter) < 0)) return res.status(400).json({ error: 'Invalid diameter' });
  if (orbital_period !== undefined && (isNaN(orbital_period) || Number(orbital_period) < 0)) return res.status(400).json({ error: 'Invalid orbital_period' });
  const sql = 'INSERT INTO planets (name, system, climate, population, surface_type, diameter, orbital_period) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [name, system || null, climate || null, population || null, surface_type || null, diameter || null, orbital_period || null], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    db.get('SELECT * FROM planets WHERE id = ?', [this.lastID], (err2, row) => {
      if (err2) return res.status(500).json({ error: 'Database error' });
      res.status(201).json(row);
    });
  });
});

router.put('/api/planets/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, system, climate, population, surface_type, diameter, orbital_period } = req.body;
  db.get('SELECT * FROM planets WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Planet not found' });
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) return res.status(400).json({ error: 'Invalid name' });
    if (diameter !== undefined && (isNaN(diameter) || Number(diameter) < 0)) return res.status(400).json({ error: 'Invalid diameter' });
    if (orbital_period !== undefined && (isNaN(orbital_period) || Number(orbital_period) < 0)) return res.status(400).json({ error: 'Invalid orbital_period' });
    const sql = 'UPDATE planets SET name = ?, system = ?, climate = ?, population = ?, surface_type = ?, diameter = ?, orbital_period = ? WHERE id = ?';
    db.run(sql, [name || row.name, system || row.system, climate || row.climate, population || row.population, surface_type || row.surface_type, diameter === undefined ? row.diameter : diameter, orbital_period === undefined ? row.orbital_period : orbital_period, id], function(erru) {
      if (erru) return res.status(500).json({ error: 'Database error' });
      db.get('SELECT * FROM planets WHERE id = ?', [id], (err2, updated) => {
        if (err2) return res.status(500).json({ error: 'Database error' });
        res.json(updated);
      });
    });
  });
});

router.delete('/api/planets/:id', (req, res) => {
  const id = Number(req.params.id);
  db.run('DELETE FROM planets WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Planet not found' });
    res.status(204).end();
  });
});

module.exports = router;
