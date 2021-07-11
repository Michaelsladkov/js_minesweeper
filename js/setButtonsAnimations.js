function setButtonsAnimations() {
    var btns = document.getElementsByClassName("menuItem");
    for (let btn of btns) {
        btn.onmouseenter = function() {
            btn.style.borderStyle = "solid"
            btn.style.borderColor = "white";
            btn.style.borderWidth = "3px";
        }
        btn.onmouseleave = function() {
            btn.style.borderStyle = "";
            btn.style.borderColor = "black";
            btn.style.borderWidth = "";
        }
    }
}