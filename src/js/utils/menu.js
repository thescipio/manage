function toggleDropdown(event) {
    event.stopPropagation();
    const tdElement = event.target.closest('td');
    const dropdownMenu = tdElement.querySelector('.dropdown-menu');

    if (dropdownMenu) {
        dropdownMenu.classList.toggle('hidden');
    }

    document.querySelectorAll('.dropdown-menu').forEach((menu) => {
        if (menu !== dropdownMenu) {
            menu.classList.add('hidden');
        }
    });
}

document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach((menu) => {
        menu.classList.add('hidden');
    });
});


function confirmDelete(itemId) {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.remove('hidden'); 

    const confirmButton = deleteModal.querySelector('.alert-delete');
    confirmButton.onclick = function() {
        console.log('Item deleted:', itemId);
        deleteModal.classList.add('hidden'); 
    };

    const cancelButton = deleteModal.querySelector('[data-modal-toggle="deleteModal"]');
    cancelButton.onclick = function() {
        deleteModal.classList.add('hidden'); 
    };
}