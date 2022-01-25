window.onload = () => {
    var checkBoxElements = document.getElementsByName("playerPosition");
    var checkedElementsCount = 0;
    for(const checkBox of checkBoxElements){
        checkBox.addEventListener("click", function(){
            checkBoxFunction(checkBox)
        });
        if(checkBox.checked == true) checkedElementsCount++;
    } 
    if(!checkedElementsCount){
        checkBoxRequired();
    } else {
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
    if(box.checked == true) {
        checkBoxNotRequired();
    } else {
        checkBoxRequired();
    }
}