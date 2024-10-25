'use strict';

const delEl = document.querySelectorAll('.item-delete');
console.log(delEl)
delEl.forEach(btn => {
    btn.addEventListener('click', function (e) {
        const liEl = e.target.closest('li');
        console.log(liEl)

    })
})