// CODE EXPLAINED channel
const clear = document.querySelector(".clear");
const dataElement = document.getElementById("date");//will show today's date
const list = document.getElementById("list");//list where our items exist
const input = document.getElementById("input")

//classes names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

//list that contain all item added
let LIST =[],id=0;

//get item from localstorage (this code must be every where we update the list)
let data = localStorage.getItem("TODO")

//check if data is noe empty
if(data){
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
}else{
    //if data is empty
    LIST = [];
    id = 0;

}

//function to load items to user's interface
function loadList(array){
    array.forEach(function (item) {
        addToDo(item.name, item.id,item.done,item.trash);
    });
}

//clear the local storage
clear.addEventListener("click",function(){
    localStorage.clear();
    location.reload();
});


//show todays date
const options = {weekday:"long",month:"short",day:"numeric"};
const today = new Date();
dataElement.innerHTML = today.toLocaleDateString("en-US",options);

// add function
function addToDo(toDo,id,done,trash){
    if(trash){return;}
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";
    const item = `
                <li class="item">
                    <i class="fa fa ${DONE} co" job="complete" id="${id}"></i>
                    <p class="text ${LINE}">${toDo}</p>
                    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                </li>
                `;
    
        
    const position = "beforeend";
    list.insertAdjacentHTML(position, item);
}


// add item when the user hit Add to-do
document.addEventListener("keyup",function(event){
    if (event.keyCode==13) {
        const toDo = input.value;
        //if the input isn't empty
        if(toDo){
            addToDo(toDo,id,false,false);
            LIST.push({
                name : toDo,
                id : id,
                done:false,
                trash:false
            });
            //update item from localstorage (this code must be every where we update the list)
            localStorage.setItem("TODO", JSON.stringify(LIST));
            id++;
        }
        input.value = "";//Add a to-do will be blank when hit enter

    }
});

//addToDo("Watch TV",1,true,false);
//complete to do when click complete button
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    LIST[element.id].done = LIST[element.id].done ? false : true;
}

//remove to do 
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true ;
}

//target the items created 

list.addEventListener("click",function (event) {
    const element = event.target;// return clicked
    const elementJob = element.attributes.job.value; //complete or delete
    if(elementJob=="complete"){
        completeToDo(element);
    } else if(elementJob=="delete"){
        removeToDo(element);
    }
    //upadte item from localstorage (this code must be every where we update the list)
    localStorage.setItem("TODO", JSON.stringify(LIST));
})
