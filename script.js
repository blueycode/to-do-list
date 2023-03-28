// Getting a raw json previously stored on local storage
let list = JSON.parse(localStorage.getItem('list'));
const toDo = document.querySelector("#to-do");
const done = document.querySelector("#done");
const form = document.querySelector("#form");

const defaultList = {
    "to_do_list": [
        {
            "title": "🛒 Buy groceries",
            "description": "Milk, bread, eggs, cheese, fruits and vegetables.",
            "completed": false
        },
        {
            "title": "📝 Finish project",
            "description": "Complete the final report and submit it by Friday.",
            "completed": true
        },
        {
            "title": "🧼 Clean the house",
            "description": "Vacuum, dust, and clean the bathrooms.",
            "completed": false
        },
        {
            "title": "💰 Pay bills",
            "description": "Electricity, water, and internet bills.",
            "completed": false
        },
        {
            "title": "📞 Call mom",
            "description": "Check in and see how she's doing.",
            "completed": true
        },
        {
            "title": "📅 Schedule appointment",
            "description": "Make an appointment with the dentist.",
            "completed": true
        },
        {
            "title": "🏃‍♂️ Go for a run",
            "description": "Jog for 30 minutes.",
            "completed": true
        },
        {
            "title": "📖 Read a book",
            "description": "Finish reading 'The Great Gatsby'.",
            "completed": true
        },
        {
            "title": "✍️ Write a blog post",
            "description": "Come up with a topic and write a 500-word blog post.",
            "completed": true
        },
        {
            "title": "🧹 Organize closet",
            "description": "Sort clothes by category and donate items no longer needed.",
            "completed": true
        }
    ]
}

// This is in case our local storage is empty
if (!list) {
    localStorage.setItem('list', JSON.stringify(defaultList));
    list = JSON.parse(localStorage.getItem('list'));
}

// Handles the list of items
function getListData() {
    toDo.innerHTML = "";
    done.innerHTML = "";

    // A handy var that will help us to render
    // the list properly
    let lastItem;

    list.to_do_list.forEach((itm, index) => {
        renderToDoItem(itm, index);
        // This var always will hold the index
        // of the last rendered item
        lastItem = index;
    });

    if (toDo.childElementCount === 0) {
        renderCompletedImg();
    }

    lastItem ++;
    createNewItemFields(lastItem);
}

// Renders items
function renderToDoItem(itm, index) {
    const title = document.createElement("textarea");
    title.name = `n${index}-title`;
    title.value = itm.title;
    title.maxLength = 30;
    title.addEventListener("change", handleItemsSubmit);
    
    const desc = document.createElement("textarea");
    desc.name = `n${index}-desc`;
    desc.value = itm.description;
    desc.style.height = "1.5rem";
    desc.style.height = this.scrollHeight + "px";
    desc.addEventListener("input", autoResize, false);
    desc.addEventListener("click", autoResize, false);
    desc.addEventListener("change", handleItemsSubmit);

    const completed = document.createElement("input");
    completed.type = "hidden";
    completed.name = `n${index}-completed`;
    completed.value = itm.completed;

    // We need to create those two divs to respect
    // our CSS structure
    const wrapper = document.createElement("div");
    const itmData = document.createElement("div");

    itmData.classList.add("itm-data");
    itmData.appendChild(title);
    itmData.appendChild(desc);
    itmData.appendChild(completed);

    const checkBtn = document.createElement("span");
    checkBtn.classList.add("material-symbols-outlined");
    checkBtn.title = "Hold to delete this item";
    checkBtn.addEventListener("long-press", removeItem);
    checkBtn.addEventListener("click", checkItem);
    checkBtn.setAttribute("data-long-press-delay", "100");
    checkBtn.id = index;

    wrapper.appendChild(itmData);
    wrapper.appendChild(checkBtn);

    if (itm.completed) {
        checkBtn.innerText = "check_box";
        done.appendChild(wrapper);
    } else {
        checkBtn.innerText = "check_box_outline_blank";
        toDo.appendChild(wrapper);
    }
}

// Expands textareas when clicked
function autoResize() {
    this.style.height = "1.5rem";
    this.style.height = this.scrollHeight + "px";
}

// Creates the fields for new items
function createNewItemFields(index) {
    const newItmWrapper = document.createElement("div");
    const newItmData = document.createElement("div");
    const newTitle = document.createElement("textarea");

    newTitle.name = `n${index}-title`;
    newTitle.maxLength = 30;
    newTitle.placeholder = "✨ Create a new note...";
    newTitle.addEventListener("change", handleItemsSubmit);

    const newDesc = document.createElement("textarea");
    newDesc.name = `n${index}-desc`;
    newDesc.style.height = "1.5rem";
    newDesc.style.height = this.scrollHeight + "px";
    newDesc.placeholder = "Note description";
    newDesc.addEventListener("input", autoResize, false);
    newDesc.addEventListener("change", autoResize, false);
    newDesc.addEventListener("change", handleItemsSubmit);

    const newCompleted = document.createElement("input");
    newCompleted.type = "hidden";
    newCompleted.name = `n${index}-completed`;

    newItmData.classList.add("itm-data");
    newItmData.appendChild(newTitle);
    newItmData.appendChild(newDesc);
    newItmData.appendChild(newCompleted);

    newItmWrapper.appendChild(newItmData);
    toDo.appendChild(newItmWrapper);
}

// Handles a new item
function handleItemsSubmit(e) {
    const formData = new FormData(form);

    // Creating an empty to-do list
    const todoObject = {
        "to_do_list": []
    }

    const formValues = formData.values();

    for (const itx of formValues) {
        let title = itx;
        let description = formValues.next().value;
        let completed = formValues.next().value;

        if (
            title.trim() !== "" || 
            description.trim() !== ""
        ) {
            todoObject.to_do_list.push({
                title,
                description,
                completed: completed === 'true'
            });
        }
    }

    let listSizes = [
        list.to_do_list.length,
        todoObject.to_do_list.length
    ];

    list = todoObject;
    saveItemsStorage();

    // This means that we'll only render
    // the list again if an items was actually
    // added
    if (listSizes[0] < listSizes[1]) {
        getListData();
    }
}

// Saves the current list to the storage
function saveItemsStorage() {
    localStorage.setItem("list", JSON.stringify(list));
}

// Removes an item from the list
function removeItem(e) {
    let idToRemove = e.target.id;
    const filteredList = list.to_do_list.filter((itm, index) => {
        return index != idToRemove;
    })
    list.to_do_list = filteredList;

    anime({
        targets: e.target.parentElement,
        duration: 500,
        translateX: [0, 50],
        opacity: [1, 0],
        easing: "easeInExpo",
        complete: function(anim) {
            getListData();
            saveItemsStorage();
        }
    });
}

// Checks/Unchecks an item
function checkItem(e) {
    let isCompleted = list.to_do_list[e.target.id].completed;
    list.to_do_list[e.target.id].completed = !isCompleted;

    anime({
        targets: e.target.parentElement,
        duration: 500,
        translateX: [0, 50],
        opacity: [1, 0],
        easing: "easeInExpo",
        complete: function(anim) {
            getListData();
            saveItemsStorage();
        }
    });
}

// Render a cool image when all items are done
function renderCompletedImg() {
    const upToDateImg = document.createElement("img");
    const upToDateText = document.createElement("h3");

    upToDateImg.src = "./images/upToDate.svg";
    upToDateImg.classList.add("up-to-date-img");

    upToDateText.innerText =
        "Nice! You have finished all of your tasks.";
    upToDateText.classList.add("up-to-date-txt");

    toDo.appendChild(upToDateImg);
    toDo.appendChild(upToDateText);
}

// Nice, now, some styling