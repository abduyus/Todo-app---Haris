'use strict';

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const csrftoken = getCookie('csrftoken');

document.querySelector('.todo-list').addEventListener('click', async function (e) {
    if (e.target.classList.contains('item-delete')) {
        const liEl = e.target.closest('li');
        const taskId = liEl.getAttribute('data-id');
        if (!taskId) {
            console.error('Task ID not found');
            return;
        }

        try {
            const response = await fetch(`/api/delete/${taskId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': csrftoken
                }
            });

            if (response.ok) {
                liEl.remove();
            } else {
                console.error('Failed to delete task:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});

const addBtn = document.querySelector('.btn-add-new');
const addForm = document.querySelector('.form-add');
const overlay = document.querySelector('.overlay');

addBtn.addEventListener('click', function () {
    addForm.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
});

overlay.addEventListener('click', function () {
    addForm.classList.add('hidden');
    overlay.classList.add('hidden');
});

addForm.addEventListener('click', function (e) {
    e.stopPropagation();
});

addForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = addForm.querySelector('input[name="title"]').value;
    const description = addForm.querySelector('textarea[name="description"]').value;
    const due = addForm.querySelector('input[name="due"]').value;

    try {
        const response = await fetch('/api/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({title, description, due})
        });

        if (response.ok) {
            const task = await response.json();
            const ulEl = document.querySelector('.todo-list');
            const liEl = document.createElement('li');
            liEl.className = 'todo-item';
            liEl.setAttribute('data-id', task.id);
            liEl.innerHTML = `
                <input type="checkbox" class="item-checkbox">
                <div class="grid">
                    <span class="item-title">${task.title}</span>
                    <span class="item-desc">${task.description}</span>
                </div>
                <span class="item-date">Created ${<task className="created"></task>}</span>
                <svg class="item-delete" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            `;
            ulEl.appendChild(liEl);

            addForm.reset();
            addForm.classList.add('hidden');
            overlay.classList.add('hidden');
        } else {
            console.error('Failed to add task:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});