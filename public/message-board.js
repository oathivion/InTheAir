async function sendMessage() {
    const message = document.getElementById('messageInput').value.trim();
    if (!message) {
        alert('Please enter a message.');
        return;
    }

    const response = await fetch('/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    });

    if (response.ok) {
        document.getElementById('messageInput').value = '';
        fetchMessages(); // Refresh messages after posting
    } else {
        alert('Error posting message.');
    }
}

async function fetchMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();

    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';

    messages.forEach(msg => {
        const div = document.createElement('div');
        div.classList.add('message');
        div.textContent = msg.text;
        messagesDiv.appendChild(div);
    });
}

// Load messages when page opens
window.onload = fetchMessages;
