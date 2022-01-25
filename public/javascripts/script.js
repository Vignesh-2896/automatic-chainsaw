window.onload = () => {     // Checkbox Required Functionality.
    var checkBoxElements = document.getElementsByName("playerPosition");    // Checkbox present for Player Positions.
    var checkedElementsCount = 0;
    for(const checkBox of checkBoxElements){ // 
        checkBox.addEventListener("click", function(){
            checkBoxFunction(checkBox)      // Adding an onclick function to be called when box is checked or unchecked.
        });
        if(checkBox.checked == true) checkedElementsCount++;
    } 
    if(!checkedElementsCount){  // During page load, If new player is being created, atleast one position to be selected.
        checkBoxRequired();
    } else {                    // During page load, If player is being updated - position has already been selected and so checkbox should not be set as required.
        checkBoxNotRequired();
    }
}

var checkBoxRequired = () => {
    var checkBoxElements = document.getElementsByName("playerPosition");
    for(const checkBox of checkBoxElements){
        checkBox.setAttribute("required","true");
    }
}

var checkBoxNotRequired = () => {
    var checkBoxElements = document.getElementsByName("playerPosition");
    for(const checkBox of checkBoxElements){
        checkBox.removeAttribute("required")
    }
}

var checkBoxFunction = (box) => {
    if(box.checked == true) {   // If atleast one box is checked, the required property can be removed from all boxes.
        checkBoxNotRequired();
    } else {                     // If not even one box is checked, the required property should be added to all boxes.
        checkBoxRequired();
    }
}