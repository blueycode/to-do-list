// Getting a raw json previously stored on local storage
let list = JSON.parse(localStorage.getItem('list'));
const toDo = document.querySelector("#to-do");
const done = document.querySelector("#done");

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
}

// Renders items
function renderToDoItem(itm, index) {
    const title = document.createElement("textarea");
    title.name = `n${index}-title`;
    title.value = itm.title;
    title.maxLength = 30;
    
    const desc = document.createElement("textarea");
    desc.name = `n${index}-desc`;
    desc.value = itm.description;
    desc.style.height = "1.5rem";
    desc.style.height = this.scrollHeight + "px";
    desc.addEventListener("input", autoResize, false);
    desc.addEventListener("click", autoResize, false);
    
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