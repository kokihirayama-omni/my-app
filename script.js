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
        // 既存のcompletedプロパティをstatusに移行
        todos = todos.map(todo => {
            if (!todo.status) {
                return {
                    ...todo,
                    status: todo.completed ? 'done' : 'todo'
                };
            }
            return todo;
        });
        saveTodos();
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
        status: 'todo' // 'todo', 'doing', 'done'
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();

    // 入力フィールドをクリア
    todoInput.value = '';
    todoInput.focus();
}

// タスクのステータスを変更
function moveTask(id, newStatus) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.status = newStatus;

        // タスクが完了した時に紙吹雪を発動
        if (newStatus === 'done') {
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

// カンバンボードを表示
function renderTodos() {
    const todoColumn = document.getElementById('todoColumn');
    const doingColumn = document.getElementById('doingColumn');
    const doneColumn = document.getElementById('doneColumn');

    todoColumn.innerHTML = '';
    doingColumn.innerHTML = '';
    doneColumn.innerHTML = '';

    if (todos.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'タスクがありません。新しいタスクを追加してください。';
        todoColumn.appendChild(emptyState);
        return;
    }

    // ステータスごとにタスクを分類
    const todoTasks = todos.filter(t => t.status === 'todo');
    const doingTasks = todos.filter(t => t.status === 'doing');
    const doneTasks = todos.filter(t => t.status === 'done');

    // 各列にタスクカードを追加
    todoTasks.forEach(todo => todoColumn.appendChild(createTaskCard(todo)));
    doingTasks.forEach(todo => doingColumn.appendChild(createTaskCard(todo)));
    doneTasks.forEach(todo => doneColumn.appendChild(createTaskCard(todo)));
}

// タスクカードを作成
function createTaskCard(todo) {
    const card = document.createElement('div');
    card.className = 'task-card';

    // タスクテキスト
    const text = document.createElement('div');
    text.className = 'task-text';
    text.textContent = todo.text;

    // ボタンコンテナ
    const buttons = document.createElement('div');
    buttons.className = 'task-buttons';

    // ステータス移動ボタン
    if (todo.status === 'todo') {
        const startBtn = document.createElement('button');
        startBtn.className = 'move-btn start-btn';
        startBtn.textContent = '開始';
        startBtn.addEventListener('click', () => moveTask(todo.id, 'doing'));
        buttons.appendChild(startBtn);
    } else if (todo.status === 'doing') {
        const backBtn = document.createElement('button');
        backBtn.className = 'move-btn back-btn';
        backBtn.textContent = '戻す';
        backBtn.addEventListener('click', () => moveTask(todo.id, 'todo'));
        buttons.appendChild(backBtn);

        const completeBtn = document.createElement('button');
        completeBtn.className = 'move-btn complete-btn';
        completeBtn.textContent = '完了';
        completeBtn.addEventListener('click', () => moveTask(todo.id, 'done'));
        buttons.appendChild(completeBtn);
    } else if (todo.status === 'done') {
        const reopenBtn = document.createElement('button');
        reopenBtn.className = 'move-btn reopen-btn';
        reopenBtn.textContent = '再開';
        reopenBtn.addEventListener('click', () => moveTask(todo.id, 'doing'));
        buttons.appendChild(reopenBtn);
    }

    // 削除ボタン
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    buttons.appendChild(deleteBtn);

    card.appendChild(text);
    card.appendChild(buttons);

    return card;
}

// イベントリスナー
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
