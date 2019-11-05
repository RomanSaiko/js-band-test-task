import '../styles/index.scss';

let tasksList = [];

function Store() {
    return {
        getTasks: function() {
            return tasksList;
        },
        addTask: function(task) {
            tasksList.push(task);
        },
        deleteTask: function(id) {
            tasksList = tasksList.filter(item => item.id !== id );
        },
        updateTask: function() {
            return tasksList;
        },
        editTask: function() {
            return tasksList;
        }
    };
}

function Display() {
    return {
        getDataList: function(list) {
            const parentTasksContainer = document.getElementById("task-list");
            let finalTasksList = '';
            list.forEach(item => {
                const itemList = Display().createTaskItemNode(item);
                finalTasksList += itemList;
            });
            parentTasksContainer.innerHTML = finalTasksList;
        },
        createTaskItemNode: function(task) {
            const { title, description, status, priority, id } = task;
            let buttonStatusText;
            if (status === "open") {
                buttonStatusText = "Done";
            }
            else {
                buttonStatusText = "Open";
            }
            const taskItem = `
            <li class="list__item" data-id="${id}" data-status=${status}>
                <p>${title}</p>
                <p>${description}</p>
                <p>${priority}</p>
                <div class="option-wrapper"><span>&#8231;&#8231;&#8231;</span><ul><li class="task-done">${buttonStatusText}</li><li class="task-edit">Edit</li><li class="task-delete">Delete</li></ul></div>
            </li>`;
            return taskItem;
        },
        initModal: function() {
            const modal = document.getElementById("modal");
            const closeModalButton = document.getElementById("close-modal");
            modal.addEventListener("click", HandleEvent().clickCloseModal);
            closeModalButton.addEventListener("click", HandleEvent().clickCloseModal);
            if (!modal.classList.contains("show")) {
                modal.classList.add("show");
            }
        },
        closeModal: function() {
            const modal = document.getElementById("modal");
            const createForm = document.getElementById("create-task");
            if (modal.classList.contains("show")) {
                modal.classList.remove("show");
            }
            createForm.reset();
        }
    };
}

function HandleEvent() {
    return {
        clickModal: function({target}) {
            if (target.id === "show-modal") {
                Display().initModal();
            }
        },
        clickCloseModal: function({target}) {
            if (target.id === "close-modal" || target.id === "modal") {
                Display().closeModal();
            }
        },
        submitTaskForm: function(event) {
            event.preventDefault();
            const title = document.getElementById("task-title").value;
            const description = document.getElementById("task-description").value;
            const priority = document.getElementById("task-priority").value;
            const status = "open";
            const id = Math.random().toString(36).substring(10);
            const task = {
                title,
                description,
                priority,
                status,
                id
            };
            Store().addTask(task);
            const tasksList = Store().getTasks();
            Display().getDataList(tasksList);
            Display().closeModal();
        },
        changeSelect: function({target}) {
            const currentValue = target.value;
            if (target.id === "filter-status" ) {
                filterBySelect(true, currentValue);
            }
            else if (target.id === "filter-priority") {
                filterBySelect(false, currentValue);
            }
        },
        changeInput: function({target}) {
            if (target.id === "search-title") {
                const currentValue = target.value;
                if (currentValue) {
                    filterTasksListByTitle(currentValue);
                }
                else {
                    const tasksList = Store().getTasks();
                    Display().getDataList(tasksList);
                }
            }
        },
        clickTaskOptions: function ({target}) {
            if (target.classList.contains("task-done")) {
                const parentEl = target.closest(".list__item");
                const id = target.closest(".list__item").dataset.id;
                for (let i in tasksList) {
                    if (tasksList[i].id === id) {
                        if(parentEl.dataset.status === "open"){
                            tasksList[i].status = "done";
                            parentEl.dataset.status = "done";
                            target.textContent = "Open";
                        }
                        else {
                            tasksList[i].status = "open";
                            parentEl.dataset.status = "open";
                            target.textContent = "Done";
                        }
                    }
                }
                Store().updateTask(id);
            }
            else if (target.classList.contains("task-edit")) {
                const taskOptions = target.closest(".list__item");
                if (taskOptions.hasAttribute("contenteditable")) {
                    taskOptions.removeAttribute('contenteditable');
                    target.textContent = 'Edit';
                }
                else {
                    taskOptions.setAttribute("contenteditable", "true");
                    target.textContent = 'Save';
                }
                //some function that check if array was edit and form and return new array
                Store().editTask();
            }
            else if (target.classList.contains("task-delete")) {
                const parentEl = target.closest(".list__item");
                const id = target.closest(".list__item").dataset.id;
                Store().deleteTask(id);
                parentEl.remove();
            }
        }
    };
}

function filterTasksListByTitle(string) {
    if (string) {
        const updatedTasksList = tasksList.filter(item => {
            const upperCasedTitle = string.toUpperCase();
            return item.title.toUpperCase().indexOf(upperCasedTitle) > -1;
        });
        Display().getDataList(updatedTasksList);
    }
}

function filterBySelect(isStatus = true, inputValue) {
    let updatedTasksList;
    if (inputValue !== "all") {
        if (isStatus) {
            updatedTasksList = tasksList.filter(item => {
                return item.status === inputValue;
            });
        }
        else {
            updatedTasksList = tasksList.filter(item => {
                return item.priority === inputValue;
            });
        }
        Display().getDataList(updatedTasksList);
    }
    else {
        const tasksList = Store().getTasks();
        Display().getDataList(tasksList);
    }
}

function Init() {

    const openModalButton = document.getElementById("show-modal");
    openModalButton.addEventListener("click", HandleEvent().clickModal);

    const createForm = document.getElementById("create-task");
    createForm.addEventListener("submit", HandleEvent().submitTaskForm);

    const searchTitleInput = document.getElementById("search-title");
    searchTitleInput.addEventListener("input", HandleEvent().changeInput);

    const formWrap = document.querySelector(".filter-wrapper");
    formWrap.addEventListener("change", HandleEvent().changeSelect);

    const parentTasksContainer = document.getElementById("task-list");
    parentTasksContainer.addEventListener("click", HandleEvent().clickTaskOptions);
    
    const tasksList = Store().getTasks();
    Display().getDataList(tasksList);
}

document.addEventListener("DOMContentLoaded", Init);
