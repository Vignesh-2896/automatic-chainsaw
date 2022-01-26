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

    if(document.getElementById("teamImage")){
        document.getElementById("teamImage").addEventListener("change", function(){
            this.nextSibling.innerHTML = this.files[0].name;
            validateFile(this);
        });
    }

    if(document.getElementById("playerImage")){
        document.getElementById("playerImage").addEventListener("change", function(){
            this.nextSibling.innerHTML = this.files[0].name;
            validateFile(this);
        });
    }

}

const validateFile = (fileUploaded) => {
    let fileName = fileUploaded.files[0].name;
    let currentFileExtension = fileName.split(".").pop().toLowerCase();
    let allowedFilesExtension = ["jpg", "jpeg", "png"];
    let fileSize = ((fileUploaded.files[0].size/1024)/1024).toFixed(2);
    let errFound = false;

    if(allowedFilesExtension.indexOf(currentFileExtension) === -1){    // File extension restriction.
        alert("Oops! Only image files (jpg, jpeg and png) allowed for upload.")
        errFound = true;
    }
    
    if(fileSize > 5){                                                   // File size restriction.
        alert("Oops! Size of Image has to be 5MB.")
        errFound = true;
    }

    if(errFound){   // Clear file uploaded contents and change the label.
        fileUploaded.value = "";
        fileUploaded.focus();
        fileUploaded.nextSibling.innerHTML = "Choose a File";
    }
}

var checkBoxRequired = () => {
    var checkBoxElements = document.getElementsByName("playerPosition");
    for(const checkBox of checkBoxElements){
        checkBox.setAttribute("required","true");   // Add required
    }
}

var checkBoxNotRequired = () => {
    var checkBoxElements = document.getElementsByName("playerPosition");
    for(const checkBox of checkBoxElements){
        checkBox.removeAttribute("required")    // Remove reqiured
    }
}

var checkBoxFunction = (box) => {
    if(box.checked == true) {   // If atleast one box is checked, the required property can be removed from all boxes.
        checkBoxNotRequired();
    } else {                     // If not even one box is checked, the required property should be added to all boxes.
        checkBoxRequired();
    }
}