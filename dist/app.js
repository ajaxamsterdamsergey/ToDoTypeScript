"use strict";
var ToDo = /** @class */ (function () {
    function ToDo(name, description, priority, isNew) {
        if (isNew === void 0) { isNew = false; }
        this.id = new Date().getTime();
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.status = 'planned';
        this.isNew = isNew;
    }
    return ToDo;
}());
var ToDoApp = /** @class */ (function () {
    function ToDoApp() {
        this.toDos = JSON.parse(localStorage.getItem('toDos') || '[]');
        this.addToDoButton = document.getElementById('add-todo'); // Cast the type to HTMLButtonElement
        this.addToDoButton.addEventListener('click', this.addToDoFromUI.bind(this));
        this.renderToDos();
    }
    ToDoApp.prototype.addToDoFromUI = function (event) {
        event.preventDefault();
        var nameInput = document.getElementById('todo-name');
        var descriptionInput = document.getElementById('todo-description');
        var priorityInput = document.getElementById('todo-priority');
        var name = nameInput.value;
        var description = descriptionInput.value;
        var priority = priorityInput.value;
        // Check that all fields are filled in
        if (name === "" || priority === "" || description === "") {
            alert("Please fill in all fields");
            return;
        }
        var toDo = new ToDo(name, description, priority, true); // Pass true for isNew
        this.toDos.push(toDo);
        // Reset fields
        nameInput.value = '';
        priorityInput.value = '';
        descriptionInput.value = '';
        localStorage.setItem('toDos', JSON.stringify(this.toDos));
        this.renderToDos();
    };
    ToDoApp.prototype.renderToDos = function () {
        var _this = this;
        var plannedToDosDiv = document.getElementById('planned-todos');
        var inProgressToDosDiv = document.getElementById('in-progress-todos');
        var doneToDosDiv = document.getElementById('done-todos');
        plannedToDosDiv.innerHTML = '';
        inProgressToDosDiv.innerHTML = '';
        doneToDosDiv.innerHTML = '';
        this.toDos.forEach(function (toDo) {
            var color = "";
            var priorityText = "";
            if (toDo.priority == '1') {
                color = "red";
                priorityText = "High";
            }
            else if (toDo.priority == '2') {
                color = "yellow";
                priorityText = "Medium";
            }
            else {
                color = "green";
                priorityText = "Low";
            }
            var toDoDiv = document.createElement('div');
            toDoDiv.id = "todo-".concat(toDo.id); // Set an id
            toDoDiv.className = 'todo'; // Add a class
            toDoDiv.style.backgroundColor = color;
            toDoDiv.innerHTML = "\n          <h3>Name: ".concat(toDo.name, "</h3>\n          <p>Description: ").concat(toDo.description, "</p>\n          <p>Status: ").concat(toDo.status, "</p>\n          <p>Priority: ").concat(priorityText, "</p>\n          <button class=\"change-status\">Change Status</button>\n        ");
            toDoDiv.querySelector('.change-status').addEventListener('click', function () { return _this.changeStatus(toDo.id); });
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.className = 'delete-todo';
            deleteButton.style.float = 'right';
            toDoDiv.prepend(deleteButton);
            deleteButton.addEventListener('click', function () { return _this.deleteToDo(toDo.id); });
            if (toDo.status === 'planned') {
                if (toDo.isNew) {
                    // If the todo is new
                    toDoDiv.classList.add('new'); // Add the 'new' class
                    toDo.isNew = false; // Set the flag to false after adding the class
                }
                plannedToDosDiv.append(toDoDiv);
            }
            else if (toDo.status === 'in progress') {
                inProgressToDosDiv.append(toDoDiv);
            }
            else {
                doneToDosDiv.append(toDoDiv);
            }
            // Remove the 'new' class after the animation completes to prevent it from re-running
            setTimeout(function () {
                toDoDiv.classList.remove('new');
            }, 1000);
        });
        localStorage.setItem('toDos', JSON.stringify(this.toDos)); // Update the todo list after the render is complete
    };
    ToDoApp.prototype.changeStatus = function (id) {
        var _this = this;
        var toDoDiv = document.getElementById("todo-".concat(id));
        if (toDoDiv === null) {
            return;
        }
        toDoDiv.classList.add('fadeOut');
        setTimeout(function () {
            _this.toDos = _this.toDos.map(function (toDo) {
                if (toDo.id === id) {
                    if (toDo.status === 'planned') {
                        toDo.status = 'in progress';
                    }
                    else if (toDo.status === 'in progress') {
                        toDo.status = 'done';
                    }
                    else {
                        toDo.status = 'planned';
                    }
                }
                return toDo;
            });
            localStorage.setItem('toDos', JSON.stringify(_this.toDos));
            _this.renderToDos();
            setTimeout(function () {
                var newToDoDiv = document.getElementById("todo-".concat(id));
                if (newToDoDiv === null) {
                    return;
                }
                newToDoDiv.classList.add('fadeIn');
                setTimeout(function () {
                    if (newToDoDiv !== null) {
                        newToDoDiv.classList.remove('fadeIn');
                    }
                }, 500);
            }, 50);
        }, 500);
    };
    ToDoApp.prototype.deleteToDo = function (id) {
        var _this = this;
        // Get the ToDo DOM element
        var toDoEl = document.getElementById("todo-".concat(id));
        // Add the 'deleted' class to start the fade out animation
        toDoEl.classList.add('deleted');
        // Set a timeout for the duration of the fade out animation
        setTimeout(function () {
            // Remove the ToDo from the list
            _this.toDos = _this.toDos.filter(function (toDo) { return toDo.id !== id; });
            // Update the list in localStorage
            localStorage.setItem('toDos', JSON.stringify(_this.toDos));
            // Re-render the ToDos
            _this.renderToDos();
        }, 2500); // This should match the duration of your fade out animation
    };
    return ToDoApp;
}());
document.addEventListener('DOMContentLoaded', function () { return new ToDoApp(); });
