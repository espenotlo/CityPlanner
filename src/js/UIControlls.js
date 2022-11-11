
function toggleElement(element){
    element.classList.toggle("hideItem")
}

function showHome(){
    document.getElementById('editButton').classList.remove('menuItemSelected');
    document.getElementById('homeButton').classList.add('menuItemSelected');
    let container = document.getElementById('inputs');
    for( const child of container.children){
        console.log(child);
        child.classList.add("hideItem")
    }
    document.getElementById('home').classList.toggle('hideItem');
}

function showEdit(){
    document.getElementById('homeButton').classList.remove('menuItemSelected');
    document.getElementById('editButton').classList.add('menuItemSelected');
    let container = document.getElementById('inputs');
    for( const child of container.children){
        console.log(child);
        child.classList.add("hideItem")
    }
    document.getElementById('editMode').classList.toggle('hideItem');
}

