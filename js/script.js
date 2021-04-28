'use strict';

class Todo {
    constructor(form, input, todoList, todoComleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoComleted = document.querySelector(todoComleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]))
    }

    render() {
        this.todoList.textContent = '';
        this.todoComleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage()
    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>  
      `);

        if (todo.completed) {
            this.todoComleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();

        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo)
            this.render();
        } else {
            alert('Поле не может быть пустым')
        }
    }

    generateKey() {
        return Math.random().toString(36).slice(-8);
    }

    deleteItem(key) {
        this.todoData.delete(key);
        this.render();
    }

    completedItem(key) {
        this.todoData.forEach((item) => {
            if (item.key === key) {
                item.completed = true;
            }
        })
        this.render();
    }

    handler() {
        // Обработяик события
        const todoContainer = document.querySelector('.todo-container');
        todoContainer.addEventListener('click', (event) => {
            let target = event.target;
            console.log('target: ', target);
            if (target.classList.contains('todo-remove')) {
                let key = target.parentElement.parentElement.key;
                this.deleteItem(key);
            } else if (target.classList.contains('todo-complete')) {
                let key = target.parentElement.parentElement.key;
                this.completedItem(key);
            } else {
                return;
            }

        })

    }


    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this))
        this.render();
        this.handler();
    }

}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();