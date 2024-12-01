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


function confirmDelete(url, itemId, token) {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.remove('hidden'); 

    const confirmButton = deleteModal.querySelector('.alert-delete');
    confirmButton.onclick = async function() {
        try {
            const response = await fetch(`${url}/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Item deleted:', itemId);
                window.location.reload();
            } else {
                console.error('Failed to delete item:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            deleteModal.classList.add('hidden'); 
        }
    };

    const cancelButton = deleteModal.querySelector('[data-modal-toggle="deleteModal"]');
    cancelButton.onclick = function() {
        deleteModal.classList.add('hidden'); 
    };
}