const toggle = document.querySelectorAll('.checkBox');
console.log(toggle);

toggle.forEach(toggler);

function toggler(element, index, array) {
    array[index] = element.addEventListener('click',() => {
        if (element.checked) {
            element.parentElement.style.textDecoration = "line-through"
        } else {
            element.parentElement.style.textDecoration = "none"
        }
        console.log(element.checked);
    })

}