const datePicker = document.getElementById('datePicker');
const taskTitle = document.getElementById('taskTitle');
const taskDesc = document.getElementById('taskDesc');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

// Set default date to today
datePicker.valueAsDate = new Date();

// Load tasks for selected date
datePicker.addEventListener('change', loadTasks);
addTaskBtn.addEventListener('click', addTask);

async function loadTasks() {
  const date = datePicker.value;
  const response = await fetch(`http://localhost:5000/tasks/${date}`);
  const tasks = await response.json();
  
  taskList.innerHTML = '';
  let completed = 0;
  
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.status}`;
    taskItem.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        <p>${task.description || ''}</p>
      </div>
      <div class="task-actions">
        <button onclick="toggleTask(${task.id}, '${task.status}')">
          ${task.status === 'completed' ? 'Undo' : 'Complete'}
        </button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    taskList.appendChild(taskItem);
    if (task.status === 'completed') completed++;
  });
  
  updateProgress(tasks.length, completed);
}

async function addTask() {
  const task = {
    title: taskTitle.value,
    description: taskDesc.value,
    due_date: datePicker.value
  };
  
  await fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  
  taskTitle.value = '';
  taskDesc.value = '';
  loadTasks();
}

async function toggleTask(id, currentStatus) {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/tasks/${id}`, { method: 'DELETE' });
  loadTasks(); // Refresh the task list
}


function updateProgress(total, completed) {
  const percent = total ? Math.round((completed / total) * 100) : 0;
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}%`;
}

// Initialize
loadTasks();
