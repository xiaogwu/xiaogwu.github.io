var todoItem = document.querySelector('.todo-item');
var form = document.querySelector('form');
var newTodoItemInput = document.querySelector('.new-todo-input');
var todoItems = document.querySelector('.todo-items');
var noTodos = document.querySelector('.no-todos');
var count = document.querySelector('.count');

function addTodo(event) {
  event.preventDefault();
  var newTodo = newTodoItemInput.value;
  if (newTodo.length > 0) {
    noTodos.classList.add("hidden");
    var todoList = newTodo.split(',');
    console.log(todoList);
    for (var i = 0; i < todoList.length; i++) {
      createTodo(todoList[i].trim());
    }
    form.reset();
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
  count.textContent = parseInt(count.textContent) + 1;
}

form.addEventListener("submit", addTodo);
