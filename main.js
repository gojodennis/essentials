<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Supabase config
const SUPABASE_URL = 'https://qckmkfmeomrqyzrdvjfh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFja21rZm1lb21ycXl6cmR2amZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDQyMzUsImV4cCI6MjA2ODc4MDIzNX0.AELQiwg71KlIB5S4N-Hd1qsQiqgo97Uu8TyF-be1VIg';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let notes = [];

const form = document.getElementById('note-form');
const noteText = document.getElementById('note-text');
const noteName = document.getElementById('note-name');
const notesFeed = document.getElementById('notes-feed');

function formatTime(ts) {
  const d = new Date(ts);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} hr ago`;
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(tag) {
    const chars = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'};
    return chars[tag] || tag;
  });
}

function renderNotes() {
  notesFeed.innerHTML = '';
  notes.forEach(note => {
    const div = document.createElement('div');
    div.className = 'note';
    div.innerHTML = `
      <div class=\"meta\">note: <b>${note.name ? escapeHtml(note.name) : 'Anonymous'}</b> &middot; <span class=\"time\">${formatTime(note.timestamp)}</span></div>
      <div class=\"text\">${escapeHtml(note.text)}</div>
    `;
    notesFeed.appendChild(div);
  });
}

async function fetchNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('timestamp', { ascending: false });
  if (error) {
    console.error('Error fetching notes:', error);
    notesFeed.innerHTML = '<div style="color:red">Failed to load notes.</div>';
    return;
  }
  notes = data;
  renderNotes();
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const text = noteText.value.trim();
  const name = noteName.value.trim() || 'Anonymous';
  if (!text) return;
  const { error } = await supabase
    .from('notes')
    .insert([{ text, name }]);
  if (error) {
    console.error('Error posting note:', error);
    alert('Failed to post note.');
    return;
  }
  noteText.value = '';
  noteName.value = '';
  fetchNotes();
});

fetchNotes(); 