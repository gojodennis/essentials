<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('timestamp', { ascending: false });
  if (!error) {
    notes = data;
    renderNotes();
  }
}

const form = document.getElementById('note-form');
const noteText = document.getElementById('note-text');
const noteName = document.getElementById('note-name');
const notesFeed = document.getElementById('notes-feed');

function formatTime(ts) {
  const now = Date.now();
  const diff = Math.floor((now - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} hr ago`;
  const d = new Date(ts);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function renderNotes() {
  notesFeed.innerHTML = '';
  notes.slice().reverse().forEach(note => {
    const div = document.createElement('div');
    div.className = 'note';
    div.innerHTML = `
      <div class=\"meta\">note: <b>${note.name ? escapeHtml(note.name) : 'Anonymous'}</b> &middot; <span class=\"time\">${formatTime(note.timestamp)}</span></div>
      <div class=\"text\">${escapeHtml(note.text)}</div>
    `;
    notesFeed.appendChild(div);
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(tag) {
    const chars = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'};
    return chars[tag] || tag;
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const text = noteText.value.trim();
  const name = noteName.value.trim() || 'Anonymous';
  if (!text) return;

  const { error } = await supabase
    .from('notes')
    .insert([{ text, name }]);
  if (!error) {
    noteText.value = '';
    noteName.value = '';
    fetchNotes(); // Refresh notes from Supabase
  }
});

renderNotes(); 