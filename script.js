document.addEventListener("DOMContentLoaded", function () {
  // Selecting elements and assigning variable names 
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const categoryInput = document.getElementById("categoryInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const priorityInput = document.getElementById("priorityInput");
  const taskList = document.getElementById("taskList");
  const searchInput = document.getElementById("searchInput");
  const dueDateFilter = document.getElementById("dueDateFilter");
  const priorityFilter = document.getElementById("priorityFilter");
  const setReminderCheckbox = document.getElementById("setReminderBtn");
  const addBtn = document.getElementById("addBtn");



  //function takes in the following parameters. The parameter data will be collected form a users input.
  function addTask(taskContent, category, dueDate, priority, isReminderSet, completed = false) {

    //creating the output elements with user data collected 
    const li = document.createElement("li");
    li.innerHTML = `
    <section class="task_description">
        <input type="checkbox" class="complete-checkbox" ${completed ? "checked" : ""}>
        <span class="tsk_cont">${taskContent}</span>
    </section>
    <div class="filtering">
        <div class="filter-div">
            <span id="cat">${category}</span>
            <span id="due">${dueDate}</span>
            <span id="pri">${priority}</span>
        </div>
        <div class="btns">
            <img src="images/edit.png" alt="edit" class="edit-btn" style="width: 25px; height: auto; "/>
            <img src="images/bin.png" alt="delete" class="delete-btn" style="width: 25px; height: auto;" />
        </div>
    </div>
  
    `;
    //appending our html list
    taskList.appendChild(li);

    //saving inputted data to local storage. Task details are then stored in a way that can be retrieved later.
    saveTaskToLocalStorage({
      content: taskContent,
      category: category,
      dueDate: dueDate,
      priority: priority,
      completed: completed,
      setReminder: isReminderSet,
    });
  }

  // function to save data to local storage
  function saveTaskToLocalStorage(task) {
    //gets item form local storage if any, if not initialize an empty array called tasks
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    //"pushing"/adding new task to array
    tasks.push(task);

    //updated tasks array is stored back in local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    //getting tasks from local atotage
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    //creating task output for each task in local storage
    if (tasks) {
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.innerHTML = `
        <section class="task_description">
            <input type="checkbox" class="complete-checkbox" ${task.completed ? "checked" : ""}>
            <span class="tsk_cont">${task.content}</span>
        </section>
        <div class="filtering">
            <div class="filter-div">
                <span id="cat">${task.category}</span>
                <span id="due">${task.dueDate}</span>
                <span id="pri">${task.priority}</span>
            </div>
            <div class="btns">
                <img src="images/edit.png" alt="edit" class="edit-btn" style="width: 25px; height: auto; "/>
                <img src="images/bin.png" alt="delete" class="delete-btn" style="width: 25px; height: auto;" />
            </div>
        </div> 
        `;
        taskList.appendChild(li);

        const completeCheckbox = li.querySelector(".complete-checkbox");
        //event listener checks for any "changes" to checkbox
        completeCheckbox.addEventListener("change", function () {
          task.completed = this.checked;
          if (task.completed) {
            li.classList.add("completed");
          } else {
            li.classList.remove("completed");
          }
          saveTasksToLocalStorage();
        });
        if (task.completed) {
          li.classList.add("completed");
        }



        function showNotification(message) {
          const toast = document.createElement("div");
          toast.classList.add("toast");
          toast.textContent = message;

          const toastContainer = document.getElementById("toast-container");
          toastContainer.appendChild(toast);

          setTimeout(() => {
            toast.remove();
          }, 8000);
        }

        if (task.dueDate && task.setReminder) {
          const reminderDateTime = new Date(task.dueDate).getDate();
          const currentTime = new Date().getDate();

          if (reminderDateTime === currentTime) {
            showNotification(
              `Reminder: ${task.content}`
            );
          }
        }
      });
    }
  }


  function saveTasksToLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach((taskItem) => {
      tasks.push({
        content: taskItem.querySelector("span").innerText,
        category: taskItem.querySelector("div > span:nth-child(1)").innerText,
        dueDate: taskItem.querySelector("div > span:nth-child(2)").innerText,
        priority: taskItem.querySelector("div > span:nth-child(3)").innerText,
        completed: taskItem.classList.contains("completed"),
        setReminder: setReminderCheckbox,
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Load tasks from local storage when the page is loaded
  loadTasksFromLocalStorage();

  // Event listener for submitting the form
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const taskContent = taskInput.value.trim();
    const category = categoryInput.value.trim();
    const dueDate = dueDateInput.value.trim();
    const priority = priorityInput.value.trim();
    const setReminder = isReminderSet;

    if (taskContent !== "") {
      addTask(taskContent, category, dueDate, priority, setReminder);
      taskInput.value = "";
      categoryInput.value = "";
      dueDateInput.value = "";
      priorityInput.value = "";
    }

  });





  // Event delegation for handling edit, and delete buttons
  taskList.addEventListener("click", function (e) {
    const target = e.target;
    if (target.classList.contains("edit-btn")) {
      const taskItem = target.closest("li");
      const span = taskItem.querySelector("span");
      const category = taskItem.querySelector(
        "div > span:nth-child(1)"
      ).innerText;
      const dueDate = taskItem.querySelector(
        "div > span:nth-child(2)"
      ).innerText;
      const priority = taskItem.querySelector(
        "div > span:nth-child(3)"
      ).innerText;

      const newTaskContent = prompt("Enter new task content:", span.innerText);
      if (newTaskContent !== null) {

        // const newCategory = prompt("Enter new category:", category);
        // const newDueDate = prompt("Enter new due date:", dueDate);
        // const newPriority = prompt("Enter new priority:", priority);

        if (newTaskContent.trim() !== "") {
          span.innerText = newTaskContent;
            

          ////
          saveTasksToLocalStorage();

          editTask(
            taskItem,
            newTaskContent,
            // newCategory,
            // newDueDate,
            // newPriority
          );
        } else {
          alert("Task content cannot be empty!");
        }
      }
    } else if (target.classList.contains("delete-btn")) {
      const taskItem = target.closest("li");
      taskItem.remove();
      saveTasksToLocalStorage();
    }
  });



  // function to check for empty task input
  function validTask() {
    const taskValue = taskInput.value.trim();
    if (taskValue == "") {
      alert("Please enter a task before submitting.");
      return false;
    } else {
      return true;
    }
  }
  addBtn.addEventListener("click", validTask);




  // Function to filtering tasks
  function filterTasks() {
    const searchValue = searchInput.value.toLowerCase();
    const dueDateValue = dueDateFilter.value;
    const priorityValue = priorityFilter.value.toLowerCase();

    taskList.querySelectorAll("li").forEach((task) => {
      const taskContent = task.querySelector("span").innerText.toLowerCase();
      const dueDate = task.querySelector("div > span:nth-child(2)").innerText;
      const priority = task
        .querySelector("div > span:nth-child(3)")
        .innerText.toLowerCase();

      const matchesSearch = taskContent.includes(searchValue);
      const matchesDueDate =
        dueDate.includes(dueDateValue) || dueDateValue === "";
      const matchesPriority =
        priority.includes(priorityValue) || priorityValue === "";

      if (matchesSearch && matchesDueDate && matchesPriority) {
        task.style.display = "flex";
      } else {
        task.style.display = "none";
      }
    });
  }

  // Event listeners for filtering tasks
  searchInput.addEventListener("input", filterTasks);
  dueDateFilter.addEventListener("input", filterTasks);
  priorityFilter.addEventListener("change", filterTasks);

  
  // Function to set a reminder
  let isReminderSet = setReminderCheckbox.checked;
  setReminderCheckbox.addEventListener("change", function () {
    isReminderSet = this.checked;
  });
});