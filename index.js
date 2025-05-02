const notesContainer = document.getElementById('notes-container');
const addBtn = document.getElementById('add-btn');
const noteText = document.getElementById('note-text');

function getNotesFromStorage() {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

function setNotesToStorage(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// تابع کمکی برای فرمت کردن زمان
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

function displayNotes() {
    const notes = getNotesFromStorage();
    notesContainer.innerHTML = '';
    // نمایش یادداشت‌ها به ترتیبی که در آرایه هستند (جدیدترین در پایین)
    notes.forEach((note) => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
            <p class="note-text">${note.text}</p>
            <div class="note-timestamp">${formatTimestamp(note.timestamp)}</div> <!-- نمایش زمان -->
            <div class="note-buttons">
                <button class="edit-btn" data-note-id="${note.id}">Edit</button>
                <button class="delete-btn" data-note-id="${note.id}">Delete</button>
            </div>
        `;
        notesContainer.appendChild(noteElement);

        const deleteBtn = noteElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this note?')) {
                const noteId = deleteBtn.dataset.noteId;
                const newNotes = notes.filter((n) => n.id !== Number(noteId));
                setNotesToStorage(newNotes);
                displayNotes();
            }
        });

        const editBtn = noteElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            const noteId = editBtn.dataset.noteId;
            const noteToEdit = notes.find((n) => n.id === Number(noteId));
            noteText.value = noteToEdit.text;
            addBtn.textContent = 'Update Note';
            addBtn.removeEventListener('click', addNoteHandler);
            addBtn.removeEventListener('click', updateNoteHandler);
            addBtn.addEventListener('click', () => updateNoteHandler(noteId));
        });
    });
}

function addNoteHandler() {
    const newNoteText = noteText.value.trim();
    if (newNoteText) {
        const notes = getNotesFromStorage();
        const newNote = {
            id: Date.now(),
            text: newNoteText,
            timestamp: Date.now() // اضافه کردن زمان ایجاد
        };
        notes.push(newNote); // اضافه شدن به انتهای آرایه
        setNotesToStorage(notes);
        displayNotes(); // نمایش مجدد لیست (جدیدترین در پایین)
        noteText.value = "";
    }
}

function updateNoteHandler(noteId) {
    const updateNoteText = noteText.value.trim();
    if (updateNoteText) {
        const notes = getNotesFromStorage();
        const noteIndex = notes.findIndex((n) => n.id === Number(noteId));
        if (noteIndex !== -1) {
             notes[noteIndex].text = updateNoteText;
             // می‌توانید زمان به‌روزرسانی را هم اضافه کنید اگر لازم باشد
             // notes[noteIndex].updatedTimestamp = Date.now();
             setNotesToStorage(notes);
             displayNotes();
             noteText.value = "";
             addBtn.textContent = 'Add Note';
             addBtn.removeEventListener('click', updateNoteHandler);
             addBtn.addEventListener('click', addNoteHandler);
        } else {
            noteText.value = "";
            addBtn.textContent = 'Add Note';
            addBtn.removeEventListener('click', updateNoteHandler);
            addBtn.addEventListener('click', addNoteHandler);
        }
    } else {
        noteText.value = "";
        addBtn.textContent = 'Add Note';
        addBtn.removeEventListener('click', updateNoteHandler);
        addBtn.addEventListener('click', addNoteHandler);
    }
}

addBtn.addEventListener('click', addNoteHandler);

displayNotes();
