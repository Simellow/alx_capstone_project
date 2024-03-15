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



  //function to add tasks by taking in user inputs
  function addTask(taskContent, category, dueDate, priority, isReminderSet, completed = false) {

    //creating task output 
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
    taskList.appendChild(li);

    //saving inputted data to local storage
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

        //event listener checks for any "changes" (checked or unchecked) 
        completeCheckbox.addEventListener("change", function () {
          task.completed = this.checked;

          //associated task’s completion status (task.completed) is updated
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


        // function for notification creating pop up message
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

        // retrieving current date and user inputed date set with reminder to check if they're equal
        if (task.dueDate && task.setReminder) {
          const reminderDateTime = new Date(task.dueDate).getDate();
          const currentTime = new Date().getDate();

          //showing pop up message if requirement met
          if (reminderDateTime === currentTime) {
            showNotification(
              `Reminder: ${task.content}`
            );
          }
        }
      });
    }
  }


  // function responsible for saving task-related data to the browser’s local storage.
  function saveTasksToLocalStorage() {

    //empty array initialized
    const tasks = [];

    /*For each list item (each representing a task) the function extracts relevant information and 
    extracted data is bundled into an object and pushed into the tasks array */
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

    //after processing all tasks, the function converts the tasks array to a JSON string
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Load tasks from local storage when the page is loaded
  loadTasksFromLocalStorage();

  // Event listener for form submission
  taskForm.addEventListener("submit", function (e) {
    //preventing any default action browswr might perform associated with the element
    e.preventDefault();

    //variables are extracted from various input fields within the form
    const taskContent = taskInput.value.trim();
    const category = categoryInput.value.trim();
    const dueDate = dueDateInput.value.trim();
    const priority = priorityInput.value.trim();
    const setReminder = isReminderSet;


    //if the taskContent is not empty
    if (taskContent !== "") {

      //addTask function is called with the extracted data
      addTask(taskContent, category, dueDate, priority, setReminder);

      //resetting input fields 
      taskInput.value = "";
      categoryInput.value = "";
      dueDateInput.value = "";
      priorityInput.value = "";
    }

  });





  // Event for handling edit, and delete buttons
  taskList.addEventListener("click", function (e) {

    //capturing the actual element that was clicked (edit or delete button)
    const target = e.target;

    //if the clicked element has the class "edit-btn" (edit button clicked)
    if (target.classList.contains("edit-btn")) {

      //identifies the closest ancestor <li> element (list item) containing the clicked element 
      const taskItem = target.closest("li");
      const span = taskItem.querySelector("span");

      //prompt dialog asks the user to enter new task content. 
      const newTaskContent = prompt("Enter new task content:", span.innerText);

      //the user provides a non-empty new task content, the task content is updated with the new content and saved
      if (newTaskContent !== null) {
        if (newTaskContent.trim() !== "") {
          span.innerText = newTaskContent;
          saveTasksToLocalStorage();

          //alerting if empty field is inputted
        } else {
          alert("Task content cannot be empty!");
        }
      }

      //if the clicked element has the class "edit-btn" (delete button clicked)
    } else if (target.classList.contains("delete-btn")) {

      //identifies the closest ancestor <li> element (list item) containing the clicked element 
      const taskItem = target.closest("li");

      //rwmoves list item and saves changes
      taskItem.remove();
      saveTasksToLocalStorage();
    }
  });




  // function to check for empty task input
  function validTask() {

    //getting value of input
    const taskValue = taskInput.value.trim();

    //if empty alert the message
    if (taskValue == "") {
      alert("Please enter a task before submitting.");
      return false;
    } else {
      return true;
    }
  }
  //attatch event listener to add task button
  addBtn.addEventListener("click", validTask);


  // Function to set a reminder by first initializing a let variable 
  let isReminderSet = setReminderCheckbox.checked;

  setReminderCheckbox.addEventListener("change", function () {
    
    //updates the value of isReminderSet based on the new checkbox state
    isReminderSet = this.checked;
  });



  // Function for filtering tasks
  function filterTasks() {
    //variables are extracted from various input fields
    const searchValue = searchInput.value.toLowerCase();
    const dueDateValue = dueDateFilter.value;
    const priorityValue = priorityFilter.value.toLowerCase();

    //for each task it extracts relevant information
    taskList.querySelectorAll("li").forEach((task) => {
      const taskContent = task.querySelector("span").innerText.toLowerCase();
      const dueDate = task.querySelector("div > span:nth-child(2)").innerText;
      const priority = task.querySelector("div > span:nth-child(3)").innerText.toLowerCase();

      
      //checks whether the task matches the search criteria
      const matchesSearch = taskContent.includes(searchValue);
      const matchesDueDate = dueDate.includes(dueDateValue) || dueDateValue === "";
      const matchesPriority = priority.includes(priorityValue) || priorityValue === "";

      //task visibility
      if (matchesSearch && matchesDueDate && matchesPriority) {
        
        //the task will be displayed (visible) within the task list if requirement met 
        task.style.display = "flex";

        //else it will not be seen
      } else {
        task.style.display = "none";
      }
    });
  }

  // Event listeners for filtering tasks
  searchInput.addEventListener("input", filterTasks);
  dueDateFilter.addEventListener("input", filterTasks);
  priorityFilter.addEventListener("change", filterTasks);

});