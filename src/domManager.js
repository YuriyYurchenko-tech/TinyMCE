function createDOMManager(state) {
    const templatesList = document.getElementById('templates-list');
    const addBtn = document.getElementById('add-template');
    const removeBtn = document.getElementById('remove-template');
    const editInput = document.getElementById('template-edit');
    const insertBtn = document.getElementById('insert-button');
    
    let onTemplateSelectedCallback = null;
    
    function updateTemplatesList(selectedIndex) {
        templatesList.innerHTML = '';
        state.templates.forEach((template, index) => {
            const item = document.createElement('div');
            item.className = `template-item ${index === selectedIndex ? 'selected' : ''}`;
            item.textContent = template;
            item.addEventListener('click', () => {
                if (onTemplateSelectedCallback) onTemplateSelectedCallback(index);
            });
            templatesList.appendChild(item);
        });
        
        const editInput = document.getElementById('template-edit');
        if (selectedIndex >= 0 && selectedIndex < state.templates.length) {
            editInput.value = state.templates[selectedIndex];
        } else {
            editInput.value = '';
        }
    }
    
    function bindEvents(callbacks) {
        onTemplateSelectedCallback = callbacks.onTemplateSelected;
        
        addBtn.addEventListener('click', callbacks.onAddTemplate);
        removeBtn.addEventListener('click', callbacks.onRemoveTemplate);
        insertBtn.addEventListener('click', callbacks.onInsertDropdown);
        editInput.addEventListener('change', callbacks.onUpdateTemplate);
        editInput.addEventListener('blur', callbacks.onUpdateTemplate);
    }
    
    function showError(message) {
        alert(message);
    }
    
    function confirmAction(message) {
        return confirm(message);
    }
    
    
    return {
        updateTemplatesList,
        bindEvents,
        showError,
        confirmAction,
    };
}

module.exports = { createDOMManager };