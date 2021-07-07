'use strict';

//localStorage.clear();

//--------------------------------------------------------------------------------------------------
//------------------------------------------ ARRAY DATA --------------------------------------------
//--------------------------------------------------------------------------------------------------

//My Diet Array
let mydiet = [
{type: "Eat", value: "1", food: "Apple", edit:" "},
{type: "Drink", value: "8", food: "Glass of Water", edit:" "},
{type: "Drink", value: "2", food: "Glass of Milk", edit:" "},
{type: "Eat", value: "1", food: "Salad", edit:" "},
{type: "Eat", value: "3", food: "Apple", edit:" "},
{type: "Eat", value: "2", food: "Chocolate Bar", edit:" "},
{type: "Eat", value: "2", food: "Salad", edit:" "},
{type: "Drink", value: "1", food: "Glass of Orange Juice", edit:" "},
{type: "Eat", value: "1", food: "Spaghetti", edit:" "},
{type: "Eat", value: "1", food: "Soup", edit:" "},
{type: "Eat", value: "2", food: "Steak", edit:" "}
]; 

//save to local storage
let mydietSaved = JSON.parse(localStorage.getItem('mydiet'));

//only happens the very first time launching the app. 
if(mydietSaved === null){
    localStorage.setItem('mydiet', JSON.stringify(mydiet));
    mydiet = JSON.parse(localStorage.getItem('mydiet'));
}else{
    mydiet = mydietSaved;
}

//----------------------------------------------------------------------------------------------------
//---------------------------------------- GENERATE TABLES -------------------------------------------
//----------------------------------------------------------------------------------------------------

//build the table head of the table
function generateTableHead(table) {
    let thead = table.createTHead();
    let row = thead.insertRow();

    let th3 = document.createElement("th");
    th3.setAttribute('title', "Right click to open show/hide menu\nLeft click to sort column");
    let text3 = document.createTextNode("Type");
    th3.appendChild(text3);
    row.appendChild(th3);

    th3 = document.createElement("th");
    th3.setAttribute('title', "Right click to open show/hide menu\nLeft click to sort column");
    text3 = document.createTextNode("Quantity");
    th3.appendChild(text3);
    row.appendChild(th3);

    th3 = document.createElement("th");
    th3.setAttribute('title', "Right click to open show/hide menu\nLeft click to sort column");
    text3 = document.createTextNode("Food");
    th3.appendChild(text3);
    row.appendChild(th3);

    th3 = document.createElement("th");
    text3 = document.createTextNode("Edit");
    th3.appendChild(text3);
    row.appendChild(th3);
}

//build the body of the table
function generateTable(table, data) {
    let countrow = 0;
    for (let element of data) {
        let row = table.insertRow();
        let countcolumn = 0; // count until the 4 column
        for (const key in element) {
            countcolumn++;
            let cell = row.insertCell();
            
            if(countcolumn==4){
                let img = document.createElement('img');
                img.src="assets/minus.png";
                //console.log("image" + img);
                img.setAttribute('title', "Click to remove row");
                img.style.width="20px";
                img.setAttribute('class',"minus");
                img.setAttribute('index-row', countrow);
                cell.appendChild(img);
                countrow++;
            }else{
                //for the first three columns
                let text = document.createTextNode(element[key]);
                cell.appendChild(text);
            }
        }
    }
}

//call the building functions to create the main table
let table = document.getElementById('tablestats-1'); 
generateTable(table, mydiet);
generateTableHead(table);


//----------------------------------------------------------------------------------------------------
//------------------------------------------- SORT ARRAYS --------------------------------------------
//----------------------------------------------------------------------------------------------------

//SORT ARRAYS OF WEBPAGE

/**
 * Sorts a HTML table.
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending order
 */
 function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];

    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();

        if (!isNaN(aColText) && !isNaN(bColText)) {
            return dirModifier*(aColText - bColText);
        }

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".table-sortable th").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");

        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
});



//------------------------------------------------------------------------------------------------
//------------------------------------- DATA AUTOMATED -------------------------------------------
//------------------------------------------------------------------------------------------------

// Data to keep automated:
// age 
// BMI
let today;
let nowyear;
let birthyear;
let age = 0;

const registerAge = () => {
    //Year we have now
    today = new Date();
    nowyear = parseInt(today.getFullYear());
    //User's birth year
    birthyear = parseInt(document.getElementById("infobyear").innerHTML);
    //User's age
    age = nowyear - birthyear;
    //Put it next to birthdate
    document.getElementById('age').innerHTML = age;
}

const bmiCalculate = () => {
    let bmi = 0;
    let weight = localStorage.getItem('weight');
    let height = localStorage.getItem('height');
    bmi = weight/Math.pow(height,2);
    document.getElementById("infobmi").innerHTML = bmi.toFixed(3);
}

//Register age and bmi after reload
registerAge();
bmiCalculate();


//-----------------------------------------------------------------------------------------------------
//------------------------------------- DROPDOWN FILTER MENU ------------------------------------------
//-----------------------------------------------------------------------------------------------------

//DROPDOWN FILTER MENU
let dropdownMenu = document.getElementById("filterDropdown");
const searchBar = document.getElementById("searchFilterInput");
//arrOfDiet contains the various foods of mydiet array
let arrOfDiet = [];
const dietList = document.getElementById('dietList');

//everytime the mydiet array is updated I want the arrOfDiet array to update as well

const loadDiet = (data) => {
    for (let element of data) {
        if(!arrOfDiet.includes(element.food)){
            arrOfDiet.push(element.food);
        }
    }
    //console.log(arrOfDiet);
}

loadDiet(mydiet);


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
document.querySelector(".dropbtn").addEventListener('click', function (e) {
    dropdownMenu.classList.toggle("show");
});


searchBar.addEventListener('keyup', (e)=>{
    console.log(e.target.value);
    const searchString = e.target.value;
    const filteredDiet = arrOfDiet.filter( food => {
        return food.includes(searchString);
    });
    displayFilter(filteredDiet);
    //console.log(filteredDiet);
});

const displayFilter = (foods) => {
    const htmlString = foods.map((food)=>{
        return `<a href="#dropdown" class="food">${food}</a>`;
    }).join('');
    dietList.innerHTML = htmlString;
};

//when loading the page we want all the foods/meals to appear as an option in the dropdown menu
displayFilter(arrOfDiet);


//hide rows that do not have the target-food in them
const updateMyDietArray = (target) => {

    let namesOfOtherFoods = [];

    //find the other elements-rows of the array
    for( let j = 0; j < mydiet.length; j++){ 
    
        if ( mydiet[j].food != target) { 
            namesOfOtherFoods.push(mydiet[j].food);
            //console.log(j);
        }
    
    }

    console.log(namesOfOtherFoods);
    //console.log(numOfRows);

    for( let i = 0; i < namesOfOtherFoods.length; i++){ 
        for(let k = 0; k < numOfRows; k++){
            //finally hide all the rows except the ones that include our food-target
            console.log(rows[k].children[2].innerHTML);
            if(namesOfOtherFoods[i] == rows[k].children[2].innerHTML){
                rows[k].style.display = 'none';
                rows[k].setAttribute('data-shown', 'false');
            }
        }
    }
}

//show all the rows - reset the mydiet table-array
const resetMyDietArray = (target) => {

    let namesOfOtherFoods = [];

    //find the other elements-rows of the array
    for( let j = 0; j < mydiet.length; j++){ 
    
        if ( mydiet[j].food != target) { 
            namesOfOtherFoods.push(mydiet[j].food);
        }
    
    }

    for( let i = 0; i < namesOfOtherFoods.length; i++){ 
        for(let k = 0; k < numOfRows; k++){
            //finally unhide all the rows except the ones that include our food-target
            if(namesOfOtherFoods[i] == rows[k].children[2].innerHTML){
                rows[k].style.display = '';
                rows[k].setAttribute('data-shown', 'true');
            }
        }
    }
}

//if you click on a food in the dropdown menu it will show (in the table) only the matches against it.
dietList.addEventListener('click', (e) => {
    console.log(e.target);
    console.log(e.target.innerHTML);

    //RESET THE ARRAY AS BEFORE
    resetMyDietArray();

    updateMyDietArray(e.target.innerHTML);

});

const noFilterBtn = document.querySelector(".nofilter");

noFilterBtn.addEventListener('click', ()=>{
    resetMyDietArray();
});



//---------------------------------------------------------------------------------------------------------
//-------------------------------- MENU FOR HIDING/SHOWING COLUMNS ----------------------------------------
//---------------------------------------------------------------------------------------------------------

//MENU FOR HIDING/SHOWING COLUMNS
const menu = document.getElementById('menu');
let headers = [].slice.call(table.querySelectorAll('th'));
let cells = [].slice.call(table.querySelectorAll('th, td'));

let numColumns = headers.length;
let thead = table.querySelector('thead');

let tBody = table.tBodies[0];
let rows = Array.from(tBody.querySelectorAll("tr"));

rows.forEach(function(row, index) {
    row.setAttribute('data-row-index', index);
    row.setAttribute('data-shown', 'true');
});

let numOfRows = rows.length;

// check for right click on the "title" row of the table (thead)
thead.addEventListener('contextmenu', function(e) {
    e.preventDefault();

    //calculate coordinates for the menu
    const x = e.clientX;
    const y = e.offsetY;

    //coordinates for the menu
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
    menu.classList.toggle('menuhidden');

    document.addEventListener('click', documentClickHandler);
});

// Hide the menu when clicking outside of it
const documentClickHandler = function(e) {

    //if you are not clicking inside the menu, then isClickedOutside = true!
    const isClickedOutside = !menu.contains(e.target);

    if (isClickedOutside) {
        // Hide the menu
        menu.classList.add('menuhidden');

        // Remove the event handler
        document.removeEventListener('click', documentClickHandler);
    }
};

//function that shows a hidden column with a certain index
const showColumn = function(index) {
    //Of all the cells in the table we filter those that have the index we chose and make them appear!
    cells
        .filter(function(cell) {
            return cell.getAttribute('data-column-index') === `${index}`;
        })
        .forEach(function(cell) {
            cell.style.display = '';
            cell.setAttribute('data-shown', 'true');
        });

    menu.querySelectorAll(`[type="checkbox"][disabled]`).forEach(function(checkbox) {
        checkbox.removeAttribute('disabled');
    });
};

//function that hides a hidden column with a certain index
const hideColumn = function(index) {
    cells
        .filter(function(cell) {
            return cell.getAttribute('data-column-index') === `${index}`;
        })
        .forEach(function(cell) {
            cell.style.display = 'none';
            cell.setAttribute('data-shown', 'false');
        });
    // How many columns are hidden. We count how many columns have hidden data.
    const numHiddenCols = headers
        .filter(function(th) {
            return th.getAttribute('data-shown') === 'false';
        })
        .length;
    if (numHiddenCols === numColumns - 1) {
        // There's only one column which isn't hidden yet
        // We won't allow the user to hide it
        const shownColumnIndex = thead.querySelector('[data-shown="true"]').getAttribute('data-column-index');

        const checkbox = menu.querySelector(`[type="checkbox"][data-column-index="${shownColumnIndex}"]`);
        checkbox.setAttribute('disabled', 'true');
    }
};

cells.forEach(function(cell, index) {
    cell.setAttribute('data-column-index', index % numColumns);
    cell.setAttribute('data-shown', 'true');
});

headers.forEach(function(th, index) {
    // Build the menu item
    const li = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('checked', 'true');
    checkbox.setAttribute('data-column-index', index);
    checkbox.style.marginRight = '.25rem';

    const text = document.createTextNode(th.textContent);

    label.appendChild(checkbox);
    label.appendChild(text);
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    li.appendChild(label);
    menu.appendChild(li);

    // Handle the event
    checkbox.addEventListener('change', function(e) {
        e.target.checked ? showColumn(index) : hideColumn(index);
        menu.classList.add('menuhidden');
    });
});




//--------------------------------------------------------------------------------------------------------
//-------------------------------------- INITIAL SETUP PAGE ----------------------------------------------
//--------------------------------------------------------------------------------------------------------

//Hide the main page. First we need info of the user to put in the local storage, so we can later recall the info,
// if the user returns to the app. It is for one user only but this will suffice as a registration process. 
let mainPage = document.getElementById("mainPage");
mainPage.style.display = 'none';

const readyRegister = document.getElementById("readyRegister");

const registerPage = document.getElementById("register");

//first time register your name and default stats. If not all the inputs are filled, ask for it!
const checkRegister = () => {
    if(document.getElementById("initName").value === "" || document.getElementById("initCountry").value === "" ||
    document.getElementById("initbday").value === "" || document.getElementById("initbmonth").value === "" ||
    document.getElementById("initbyear").value === "" || document.getElementById("initheight").value === "" ||
    document.getElementById("initweight").value === "") {
        console.log("Try Again!");
        document.getElementById("checkblanks").innerHTML = "*Please fill all the blanks!";
    }else{
        saveToLocalStorage();
        loadFromLocalStorage();
        showMainPage();
    }

}

const saveToLocalStorage = () => {
    localStorage.setItem('name', document.getElementById("initName").value);
    localStorage.setItem('country', document.getElementById("initCountry").value);
    localStorage.setItem('bday', document.getElementById("initbday").value);
    localStorage.setItem('bmonth', document.getElementById("initbmonth").value);
    localStorage.setItem('byear', document.getElementById("initbyear").value);
    localStorage.setItem('height', document.getElementById("initheight").value);
    localStorage.setItem('weight', document.getElementById("initweight").value);
}

const loadFromLocalStorage = () => {
    document.getElementById("editableName").innerHTML = localStorage.getItem('name');
    document.getElementById("infocountry").innerHTML = localStorage.getItem('country');
    document.getElementById("infobday").innerHTML = localStorage.getItem('bday');
    document.getElementById("infobmonth").innerHTML = localStorage.getItem('bmonth');
    document.getElementById("infobyear").innerHTML = localStorage.getItem('byear');
    document.getElementById("infoheight").innerHTML = localStorage.getItem('height');
    document.getElementById("infoweight").innerHTML = localStorage.getItem('weight');
    registerAge();
    bmiCalculate();
}

const showMainPage = () => {
    mainPage.style.display = '';
    registerPage.style.display = 'none';
}

//read from localStorage if there is already a registered user
const loadrememberUser = () => {
    //console.log(localStorage.getItem('name'));
    if(localStorage.getItem('name') != null){
        loadFromLocalStorage();
        showMainPage();
    }
}

//Every time after reload or returning to the app it will remember the user and the user's stats
loadrememberUser();

readyRegister.addEventListener('click', () => {
    checkRegister();
});


//-------------------------------------------------------------------------------------------------------
//------------------------------- ADD ELEMENT MYDIET ARRAY - EDIT PAGE ----------------------------------
//-------------------------------------------------------------------------------------------------------

//Hide the main page. This time, we need new data to add of the user to put in the local storage, so we can 
//later recall the data, if the user returns to the app. 

const editRegister = document.getElementById("editRegister");
const editCancel = document.getElementById("editCancel");
const editBtn = document.getElementById("editBTN");
const editPage = document.getElementById("editPage");
editPage.style.display = 'none';

//Check for blank inputs. If not all the inputs are filled, ask for it!
const checkForBlanks = () => {
    if(document.getElementById("editType").value === "" || document.getElementById("editQuantity").value === "" ||
    document.getElementById("editFood").value === "" ) {
        console.log("Try Again!");
        document.getElementById("checkfilled").innerHTML = "*Please fill all the blanks!";
    }else{
        saveData();
        loadData();
        hideEditPage();
    }

}

const showEditPage = () => {
    editPage.style.display = '';
    mainPage.style.display = 'none';
    registerPage.style.display = 'none';
}

const hideEditPage = () => {
    editPage.style.display = 'none';
    mainPage.style.display = '';
    registerPage.style.display = 'none';
}

//add one new row in the array of mydiet
editBtn.addEventListener('click', () => {
    showEditPage();
});

editRegister.addEventListener('click', () => {
    checkForBlanks();
});

editCancel.addEventListener('click', () => {
    hideEditPage();
});

const saveData = () => {
    
    let matchData = { 
        type: document.getElementById("editType").value, 
        value: document.getElementById("editQuantity").value, 
        food: document.getElementById("editFood").value,
        edit: " "
    };

    //save to local storage
    let newdatastats = JSON.parse(localStorage.getItem('mydiet'));
    
    if(newdatastats === null){
        localStorage.setItem('mydiet', JSON.stringify(mydiet));
        newdatastats = JSON.parse(localStorage.getItem('mydiet'));
    }
    //console.log(newdatastats);
    newdatastats.push(matchData);
    //console.log(newdatastats);
    mydiet = newdatastats;
    localStorage.setItem('mydiet', JSON.stringify(mydiet));

}

//console.log(JSON.parse(localStorage.getItem('mydiet')));

//load data to fill the new and updated array with the new row
const loadData = () => {
    let currentdatastats = JSON.parse(localStorage.getItem('mydiet'));
    //Build the cells of the the new row!

    //Build Row
    let len = currentdatastats.length;
    let row = table.insertRow();
    row.setAttribute('data-row-index', currentdatastats.length-1);
    row.setAttribute('data-shown',"true");

    //Build columns
    let cell = row.insertCell();
    cell.setAttribute('data-column-index', 0);
    cell.setAttribute('data-shown',"true");
    let text = document.createTextNode(currentdatastats[len-1].type);
    cell.appendChild(text);

    cell = row.insertCell();
    cell.setAttribute('data-column-index', 1);
    cell.setAttribute('data-shown',"true");
    text = document.createTextNode(currentdatastats[len-1].value);
    cell.appendChild(text);

    cell = row.insertCell();
    cell.setAttribute('data-column-index', 2);
    cell.setAttribute('data-shown',"true");
    text = document.createTextNode(currentdatastats[len-1].food);
    cell.appendChild(text);

    cell = row.insertCell();
    cell.setAttribute('data-column-index', 3);
    cell.setAttribute('data-shown',"true");
    let img = document.createElement('img');
    img.src="assets/minus.png";
    //console.log("image" + img);
    img.setAttribute('title', "Click to remove row");
    img.style.width="20px";
    img.setAttribute('class',"minus");
    img.setAttribute('index-row', currentdatastats.length-1);
    cell.appendChild(img);

    
    //generateTable(table,currentdatastats);
    //generateTableHead(table);


    //Must be updated!
    resetMyDietArray();
    loadDiet(currentdatastats);
    displayFilter(arrOfDiet);
    rows = Array.from(tBody.querySelectorAll("tr"));
    numOfRows = rows.length;
    registerAge();
    bmiCalculate();
    //console.log(table);
    cells = [].slice.call(table.querySelectorAll('th, td'));
}


//---------------------------------------------------------------------------------------------------
//------------------------------------------ REMOVE ROW OF TABLE ------------------------------------
//---------------------------------------------------------------------------------------------------

//Compare 2 objects
const haveSameData = (obj1, obj2) => {
    const obj1Length = Object.keys(obj1).length;
    const obj2Length = Object.keys(obj2).length;

    if (obj1Length === obj2Length) {
        return Object.keys(obj1).every(
            key => obj2.hasOwnProperty(key)
                && obj2[key] === obj1[key]);
    }
    return false;
}


let index;

//if the user clicks on the minus sign, the row of this minus sign will be deleted and removed from the local storage.
table.addEventListener('click', (e) => {
    //if the user clicks anywhere else other than the remove buttons return/do nothing
    if(!e.target.classList.contains('minus')){
        return;
    }

    index = e.target.parentElement.parentElement.rowIndex;

    // get data of selected object to delete
    let typenew = e.target.parentElement.parentElement.children[0].innerHTML;
    let valuenew = e.target.parentElement.parentElement.children[1].innerHTML;
    let foodnew = e.target.parentElement.parentElement.children[2].innerHTML;

    //create object to compare with the objects-elements of mydiet array
    let mydietnewElement = {type: typenew, value: valuenew, food: foodnew, edit:" "};
    console.log(mydietnewElement);

    // check the element we want to delete and find its position in the array. I did this, because the user could 
    //have sorted the table and for example deleted the first visible row, which in most cases is not the first 
    //element of the array mydiet!
    for(let elem in mydiet){
        if(haveSameData(mydietnewElement,mydiet[elem])){
            //console.log("passed");
            mydiet.splice(elem,1);
        }
    }
    
    //delete row visually
    table.deleteRow(index);
    //console.log("After:",mydiet);

    //save changes
    localStorage.setItem('mydiet', JSON.stringify(mydiet));

    //reload the filter
    arrOfDiet = [];
    loadDiet(mydiet);
    displayFilter(arrOfDiet); 

    rows = Array.from(tBody.querySelectorAll("tr"));
    numOfRows = rows.length;

});

















