const apiUrl = "http://localhost:8080/todos";


// Fetch and display all todos
async function fetchTodos() {
    const response = await fetch(apiUrl);
    const todos = await response.json();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.innerHTML = `
            <span>${todo.title} (${todo.completed ? 'Completed' : 'Pending'})</span>
            <button onclick="editTodo(${todo.id}, '${todo.title}')" class="update">Edit</button>
            <button onclick="deleteTodo(${todo.id})" class="delete">Delete</button>
        `;
        todoList.appendChild(todoItem);
    });
}

// Add a new todo
document.getElementById('todo-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const title = document.getElementById('todo-title').value;

    const newTodo = {
        title: title,
        completed: false
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodo)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        document.getElementById('todo-title').value = '';
        fetchTodos();  // Refresh the list
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});

// Edit a todo
function editTodo(id, title) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-form').style.display = 'block';
    document.getElementById('todo-form').style.display = 'none';
}

// Update a todo
document.getElementById('edit-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const id = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-title').value;

    const updatedTodo = {
        title: title,
        completed: false
    };

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTodo)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        document.getElementById('edit-form').style.display = 'none';
        document.getElementById('todo-form').style.display = 'block';
        fetchTodos();  // Refresh the list
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});

// Cancel editing
document.getElementById('cancel-edit').addEventListener('click', function() {
    document.getElementById('edit-form').style.display = 'none';
    document.getElementById('todo-form').style.display = 'block';
});

// Delete a todo
async function deleteTodo(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    fetchTodos();  // Refresh the list
}

// Fetch todos on page load
fetchTodos();
