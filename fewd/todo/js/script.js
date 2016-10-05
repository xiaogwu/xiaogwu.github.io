var todoItem = document.querySelector('.todo-item');
var form = document.querySelector('form');
var newTodoItemInput = document.querySelector('.new-todo-input');
var todoItems = document.querySelector('.todo-items');
var noTodos = document.querySelector('.no-todos');
var count = document.querySelector('.count');

function updateCount() {
  var checkboxes = document.querySelectorAll('.todo-item input');
  var counter = 0;
  for (var i = 0; i < checkboxes.length; i++) {
    if (!checkboxes[i].checked) {
      counter++;
    }
    checkboxes[i].addEventListener('change', updateCount);
  }
  count.textContent = counter;
}

function addTodo(event) {
  event.preventDefault();
  var newTodo = newTodoItemInput.value;
  if (newTodo.length > 0) {
    noTodos.classList.add("hidden");
    var todoList = newTodo.split(',');
    for (var i = 0; i < todoList.length; i++) {
      if(todoList[i].length > 0) {
        createTodo(todoList[i].trim());
      }
    }
    form.reset();
    updateCount();
  }
}

function createTodo(todoItem) {
  var li = document.createElement('li');
  li.classList.add('todo-item');
  var label = document.createElement('label');
  var inputCheckbox = document.createElement('input');
  inputCheckbox.setAttribute('type', 'checkbox');
  var span = document.createElement('span');
  span.textContent = todoItem;
  label.appendChild(inputCheckbox);
  label.appendChild(span);
  li.appendChild(label);
  todoItems.appendChild(li);
}

form.addEventListener("submit", addTodo);
