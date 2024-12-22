// Wait for the DOM to load
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const moduleName = params.get('module');
    const newLinkInput = document.getElementById('new-link');
    const addLinkButton = document.getElementById('add-link');
    const linksTableBody = document.querySelector('#links-table tbody');
    const saveChangesButton = document.getElementById('save-changes');

    let links = []; // Store links for the module

    // Load module links from localStorage
    const loadLinks = () => {
        const modules = JSON.parse(localStorage.getItem('modules')) || {};
        links = modules[moduleName] || [];
        renderLinks();
    };

    // Save module links to localStorage
    const saveLinks = () => {
        const modules = JSON.parse(localStorage.getItem('modules')) || {};
        modules[moduleName] = links;
        localStorage.setItem('modules', JSON.stringify(modules));
    };

    // Render links in the table
    const renderLinks = () => {
        linksTableBody.innerHTML = '';
        links.forEach((link, index) => {
            const row = document.createElement('tr');

            const linkCell = document.createElement('td');
            linkCell.textContent = link;
            row.appendChild(linkCell);

            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                links.splice(index, 1);
                renderLinks();
            });
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            linksTableBody.appendChild(row);
        });
    };

    // Add new link to the table
    addLinkButton.addEventListener('click', () => {
        const newLink = newLinkInput.value.trim();
        if (!newLink) {
            alert('Link cannot be empty.');
            return;
        }
        links.push(newLink);
        newLinkInput.value = '';
        renderLinks();
    });

    // Save changes and close the window
    saveChangesButton.addEventListener('click', () => {
        saveLinks();
        alert('Changes saved successfully!');
        window.close();
    });

    // Initialize the editor
    loadLinks();
});
