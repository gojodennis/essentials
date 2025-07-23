// Supabase config
const SUPABASE_URL = 'https://qckmkfmeomrqyzrdvjfh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFja21rZm1lb21ycXl6cmR2amZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDQyMzUsImV4cCI6MjA2ODc4MDIzNX0.AELQiwg71KlIB5S4N-Hd1qsQiqgo97Uu8TyF-be1VIg';

// Initialize Supabase client
let supabase;
try {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  alert('Failed to connect to the database. Please check the console for details.');
}

let notes = [];

const form = document.getElementById('note-form');
const noteText = document.getElementById('note-text');
const noteName = document.getElementById('note-name');
const notesFeed = document.getElementById('notes-feed');

// Create loading indicator
const loadingIndicator = document.createElement('div');
loadingIndicator.className = 'loading-indicator';
loadingIndicator.innerHTML = 'Fetching...';
loadingIndicator.style.display = 'none';
document.querySelector('.container').appendChild(loadingIndicator);

// Function to show/hide loading indicator
function setLoading(isLoading) {
  loadingIndicator.style.display = isLoading ? 'block' : 'none';
  form.querySelector('button').disabled = isLoading;
}

// Check if Supabase connection is working
async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('notes').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection check failed:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Exception during Supabase connection check:', err);
    return false;
  }
}

function formatToIST(rawTimestamp) {
  const date = new Date(rawTimestamp + 'Z'); // Add Z to make sure it parses as UTC
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function formatTime(ts) {
  const d = new Date(ts);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} hr ago`;
  return formatToIST(ts);
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
  try {
    setLoading(true);
    console.log('Fetching notes from Supabase...');
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching notes:', error);
      notesFeed.innerHTML = `<div style="color:red">Failed to load notes: ${error.message}</div>`;
      return;
    }
    
    console.log('Notes fetched successfully:', data);
    notes = data;
    renderNotes();
  } catch (err) {
    console.error('Exception when fetching notes:', err);
    notesFeed.innerHTML = `<div style="color:red">Failed to load notes: ${err.message}</div>`;
  } finally {
    setLoading(false);
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const text = noteText.value.trim();
  const name = noteName.value.trim() || 'Anonymous';
  if (!text) return;
  
  try {
    setLoading(true);
    const timestamp = new Date().toISOString();
    const noteData = { text, name, timestamp };
    console.log('Posting new note:', noteData);
    
    const { error } = await supabase
      .from('notes')
      .insert([noteData]);
    
    if (error) {
      console.error('Error posting note:', error);
      alert(`Failed to post note: ${error.message}`);
      return;
    }
    
    console.log('Note posted successfully');
    noteText.value = '';
    noteName.value = '';
    fetchNotes();
  } catch (err) {
    console.error('Exception when posting note:', err);
    alert(`Failed to post note: ${err.message}`);
  } finally {
    setLoading(false);
  }
});

// Initialize the app
(async function init() {
  setLoading(true);
  const isConnected = await checkSupabaseConnection();
  if (!isConnected) {
    notesFeed.innerHTML = `<div style="color:red">Failed to connect to the database. Please check your internet connection and try again.</div>`;
    setLoading(false);
    return;
  }
  fetchNotes();
})();