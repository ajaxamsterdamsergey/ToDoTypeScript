class ToDo {
    id: number;
    name: string;
    description: string;
    priority: string;
    status: string;
    isNew: boolean;
  
    constructor(name: string, description: string, priority: string, isNew = false) {
      this.id = new Date().getTime();
      this.name = name;
      this.description = description;
      this.priority = priority;
      this.status = 'planned';
      this.isNew = isNew;
    }
  }
  
  class ToDoApp {
    toDos: ToDo[];
    addToDoButton: HTMLButtonElement;

    constructor() {
    this.toDos = JSON.parse(localStorage.getItem('toDos') || '[]');
    this.addToDoButton = document.getElementById('add-todo') as HTMLButtonElement;
    this.addToDoButton.addEventListener('click', this.addToDoFromUI.bind(this));
    this.renderToDos();
  }
  
    addToDoFromUI(event: Event) {
      event.preventDefault();
  
      const nameInput = document.getElementById('todo-name') as HTMLInputElement;
      const descriptionInput = document.getElementById('todo-description') as HTMLTextAreaElement;
      const priorityInput = document.getElementById('todo-priority') as HTMLSelectElement;
  
      const name = nameInput.value;
      const description = descriptionInput.value;
      const priority = priorityInput.value;
  
      if (name === "" || priority === "" || description === "") {
        alert("Please fill in all fields");
        return;
      }
  
      const toDo = new ToDo(name, description, priority, true);
      this.toDos.push(toDo);
  
      nameInput.value = '';
      priorityInput.value = '';
      descriptionInput.value = '';
  
      localStorage.setItem('toDos', JSON.stringify(this.toDos));
  
      this.renderToDos();
    }
  
    renderToDos() {
      const plannedToDosDiv = document.getElementById('planned-todos')!;
      const inProgressToDosDiv = document.getElementById('in-progress-todos')!;
      const doneToDosDiv = document.getElementById('done-todos')!;
  
      plannedToDosDiv.innerHTML = '';
      inProgressToDosDiv.innerHTML = '';
      doneToDosDiv.innerHTML = '';
  
      this.toDos.forEach((toDo) => {
        let color = "";
        let priorityText = "";
        if (toDo.priority == '1') {
          color = "red";
          priorityText = "High";
        } else if (toDo.priority == '2') {
          color = "yellow";
          priorityText = "Medium";
        } else {
          color = "green";
          priorityText = "Low";
        }
  
        const toDoDiv = document.createElement('div');
        toDoDiv.id = `todo-${toDo.id}`;
        toDoDiv.className = 'todo';
        toDoDiv.style.backgroundColor = color;
        toDoDiv.innerHTML = `
          <h3>Name: ${toDo.name}</h3>
          <p>Description: ${toDo.description}</p>
          <p>Status: ${toDo.status}</p>
          <p>Priority: ${priorityText}</p>
          <button class="change-status">Change Status</button>
        `;
  
        toDoDiv.querySelector('.change-status')!.addEventListener('click', () => this.changeStatus(toDo.id));
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.className = 'delete-todo';
        deleteButton.style.float = 'right';
        toDoDiv.prepend(deleteButton);
        deleteButton.addEventListener('click', () => this.deleteToDo(toDo.id));
  
        if (toDo.status === 'planned') {
          if (toDo.isNew) {
            toDoDiv.classList.add('new');
            toDo.isNew = false;
          }
          plannedToDosDiv.append(toDoDiv);
        } else if (toDo.status === 'in progress') {
          inProgressToDosDiv.append(toDoDiv);
        } else {
          doneToDosDiv.append(toDoDiv);
        }
  
        setTimeout(() => {
          toDoDiv.classList.remove('new');
        }, 1000);
      });
  
      localStorage.setItem('toDos', JSON.stringify(this.toDos));
    }
  
    changeStatus(id: number) {
      let toDoDiv = document.getElementById(`todo-${id}`);
  
      if (toDoDiv === null) {
        return;
      }
  
      toDoDiv.classList.add('fadeOut');
  
      setTimeout(() => {
        this.toDos = this.toDos.map((toDo) => {
          if (toDo.id === id) {
            if (toDo.status === 'planned') {
              toDo.status = 'in progress';
            } else if (toDo.status === 'in progress') {
              toDo.status = 'done';
            } else {
              toDo.status = 'planned';
            }
          }
          return toDo;
        });
  
        localStorage.setItem('toDos', JSON.stringify(this.toDos));
  
        this.renderToDos();
  
        setTimeout(() => {
          let newToDoDiv = document.getElementById(`todo-${id}`);
          if (newToDoDiv === null) {
            return;
          }
          newToDoDiv.classList.add('fadeIn');
  
          setTimeout(() => {
            if (newToDoDiv !== null) {
              newToDoDiv.classList.remove('fadeIn');
            }
          }, 500);
        }, 50);
  
      }, 500);
    }
  
    deleteToDo(id: number) {
      const toDoEl = document.getElementById(`todo-${id}`);
      toDoEl!.classList.add('deleted');
  
      setTimeout(() => {
        this.toDos = this.toDos.filter((toDo) => toDo.id !== id);
        localStorage.setItem('toDos', JSON.stringify(this.toDos));
        this.renderToDos();
      }, 2500);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => new ToDoApp());
  