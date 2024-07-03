const MESSAGES_PER_PAGE = 4;
let loadedMessages = 0;
let totalMessages = 0;

document.addEventListener("DOMContentLoaded", function() {
    loadMessages();
});

function sendMessage() {
    const nameInput = document.getElementById('nameInput');
    const messageInput = document.getElementById('messageInput');
    const nameText = nameInput.value.trim();
    const messageText = messageInput.value.trim();

    if (nameText === "" || messageText === "") {
        alert("Nama dan pesan tidak boleh kosong!");
        return;
    }

    const messageObject = {
        name: nameText,
        message: messageText,
    };

    saveMessage(messageObject);
    displayMessage(messageObject);
    showPopup("Pesan Anda Terkirim");
    messageInput.value = "";
}

function saveMessage(messageObject) {
    fetch('http://localhost:3000/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageObject),
    }).then(response => response.json()).then(data => {
        totalMessages++;
        console.log('Message saved:', data);
    }).catch((error) => {
        console.error('Error:', error);
    });
}

function loadMessages() {
    fetch('http://localhost:3000/messages')
        .then(response => response.json())
        .then(messages => {
            totalMessages = messages.length;
            messages.slice(loadedMessages, loadedMessages + MESSAGES_PER_PAGE).forEach(message => displayMessage(message));
            loadedMessages += MESSAGES_PER_PAGE;
            updateLoadMoreButton();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function displayMessage(messageObject) {
    const messageHistory = document.getElementById('messageHistory');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <span><strong>${messageObject.name}</strong>: ${messageObject.message}</span>
    `;
    messageHistory.insertBefore(messageDiv, messageHistory.firstChild); // InsertBefore untuk memasukkan pesan di atas
}

function showPopup(message) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

function loadMoreMessages() {
    loadMessages();
}

function updateLoadMoreButton() {
    const loadMoreDiv = document.getElementById('loadMore');
    if (loadedMessages >= totalMessages) {
        loadMoreDiv.style.display = 'none';
    } else {
        loadMoreDiv.style.display = 'block';
    }
}
