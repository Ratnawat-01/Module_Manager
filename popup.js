// Wait for the DOM to load
window.addEventListener('DOMContentLoaded', () => {
    const moduleNameInput = document.getElementById('module-name');
    const addModuleButton = document.getElementById('add-module');
    const moduleList = document.getElementById('module-list');

    // Load saved modules from localStorage
    const loadModules = () => {
        const modules = JSON.parse(localStorage.getItem('modules')) || {};
        moduleList.innerHTML = '';
        Object.keys(modules).forEach(moduleName => {
            const li = createModuleListItem(moduleName, modules[moduleName]);
            moduleList.appendChild(li);
        });
    };

    // Save modules to localStorage
    const saveModules = (modules) => {
        localStorage.setItem('modules', JSON.stringify(modules));
    };

    // Create a list item for a module
    const createModuleListItem = (moduleName, links) => {
        const li = document.createElement('li');
        li.classList.add('module-item');

        // Content container for module name and buttons
        const contentDiv = document.createElement('div');
        contentDiv.textContent = moduleName;
        contentDiv.style.flex = '1';
        contentDiv.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return; // Ignore button clicks
            links.forEach(link => {
                chrome.tabs.create({ url: link });
            });
        });

        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.style.flex = '0.7';
        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the open action
            chrome.runtime.sendMessage({
                action: 'openEditWindow',
                editPageUrl: chrome.runtime.getURL(`edit.html?module=${encodeURIComponent(moduleName)}`)
            }, (response) => {
                if (chrome.runtime.lastError) {
                    alert(`Error opening edit window: ${chrome.runtime.lastError.message}`);
                } else if (response && response.status === 'success') {
                    console.log('Edit window opened successfully');
                } else {
                    alert('Unexpected error occurred while opening the edit window.');
                }
            });
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.flex = '0.3';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the open action
            const modules = JSON.parse(localStorage.getItem('modules')) || {};
            delete modules[moduleName];
            saveModules(modules);
            loadModules();
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '5px';
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.justifyContent = 'space-between';
        li.style.cursor = 'pointer';

        li.appendChild(contentDiv);
        li.appendChild(buttonContainer);
        return li;
    };

    // Add a new module
    addModuleButton.addEventListener('click', () => {
        const moduleName = moduleNameInput.value.trim();
        if (!moduleName) {
            alert('Module name cannot be empty.');
            return;
        }

        const modules = JSON.parse(localStorage.getItem('modules')) || {};
        if (modules[moduleName]) {
            alert('A module with this name already exists.');
            return;
        }

        modules[moduleName] = [];
        saveModules(modules);
        moduleNameInput.value = '';
        loadModules();
    });

    // Initialize the module list
    loadModules();

    // Apply cursor style for modules
    const style = document.createElement('style');
    style.textContent = `.module-item { cursor: pointer; }`;
    document.head.appendChild(style);
});
