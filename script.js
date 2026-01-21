// DOM要素の取得
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// Todoデータの配列
let todos = [];

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();
});

// localStorageからTodoを読み込み
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
}

// localStorageにTodoを保存
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Todoを追加
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();

    // 入力フィールドをクリア
    todoInput.value = '';
    todoInput.focus();
}

// Todoの完了状態を切り替え
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;

        // タスクが完了した時に紙吹雪を発動
        if (todo.completed) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        saveTodos();
        renderTodos();
    }
}

// Todoを削除
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// Todoリストを表示
function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'タスクがありません。新しいタスクを追加してください。';
        todoList.appendChild(emptyState);
        return;
    }

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (todo.completed) {
            li.classList.add('completed');
        }

        // チェックボックス
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        // テキスト
        const span = document.createElement('span');
        span.textContent = todo.text;

        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// イベントリスナー
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
