const snippets = {};

// Helper to show status messages
function showStatus(message, isError = false) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.classList.remove('hidden', 'text-green-600', 'text-red-600');
  status.classList.add(isError ? 'text-red-600' : 'text-green-600');
  setTimeout(() => status.classList.add('hidden'), 3000);
}

// Update JSON preview
function updatePreview() {
  const jsonPreview = document.getElementById('jsonPreview');
  jsonPreview.textContent = JSON.stringify(snippets, null, 2);
}

// Update snippet list display
function updateSnippetList() {
  const snippetList = document.getElementById('snippetList');
  snippetList.innerHTML = '';
  if (Object.keys(snippets).length === 0) {
    snippetList.innerHTML = '<p class="text-gray-500">No snippets added yet.</p>';
    return;
  }
  const ul = document.createElement('ul');
  ul.className = 'list-disc pl-5';
  for (const name in snippets) {
    const li = document.createElement('li');
    li.textContent = `${name} (Prefix: ${snippets[name].prefix})`;
    ul.appendChild(li);
  }
  snippetList.appendChild(ul);
}

// Add snippet
document.getElementById('addSnippet').addEventListener('click', () => {
  const name = document.getElementById('snippetName').value.trim();
  const prefix = document.getElementById('snippetPrefix').value.trim();
  const description = document.getElementById('snippetDescription').value.trim();
  const body = document.getElementById('snippetBody').value.split('\n').map(line => line.replace(/\t/g, '\\t'));

  if (!name || !prefix || !body[0]) {
    showStatus('Please fill in Name, Prefix, and Body.', true);
    return;
  }

  snippets[name] = { prefix, body, description };
  updatePreview();
  updateSnippetList();
  showStatus('Snippet added successfully!');

  // Clear form
  document.getElementById('snippetName').value = '';
  document.getElementById('snippetPrefix').value = '';
  document.getElementById('snippetDescription').value = '';
  document.getElementById('snippetBody').value = '';
});

// Clear form
document.getElementById('clearForm').addEventListener('click', () => {
  document.getElementById('snippetName').value = '';
  document.getElementById('snippetPrefix').value = '';
  document.getElementById('snippetDescription').value = '';
  document.getElementById('snippetBody').value = '';
  showStatus('Form cleared.');
});

// Clear all snippets
document.getElementById('clearAll').addEventListener('click', () => {
  for (const key in snippets) delete snippets[key];
  updatePreview();
  updateSnippetList();
  showStatus('All snippets cleared.');
});

// Download snippets
document.getElementById('downloadSnippet').addEventListener('click', () => {
  if (Object.keys(snippets).length === 0) {
    showStatus('No snippets to download.', true);
    return;
  }
  const blob = new Blob([JSON.stringify(snippets, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-snippets.code-snippets';
  a.click();
  URL.revokeObjectURL(url);
  showStatus('Snippets downloaded!');
});

// Copy snippet to clipboard
document.getElementById('copySnippet').addEventListener('click', () => {
  if (Object.keys(snippets).length === 0) {
    showStatus('No snippets to copy.', true);
    return;
  }
  const text = JSON.stringify(snippets, null, 2);
  navigator.clipboard.writeText(text).then(() => {
    showStatus('Snippets copied to clipboard!');
  }).catch(err => {
    showStatus('Failed to copy snippets.', true);
    console.error('Clipboard error:', err);
  });
});