function createDropdownManager(editor) {
    function getEditorDocument() {
        const iframe = editor.iframeElement;
        return iframe.contentDocument || iframe.contentWindow.document;
    }
    
    function updateValidDropdowns(templates, oldName, newName) {
        const doc = getEditorDocument();
        const dropdowns = doc.querySelectorAll('select.custom-dropdown:not(.error-dropdown)');

        const dropdownStates = [];
        dropdowns.forEach(dropdown => {
            dropdownStates.push({
                id: dropdown.id,
                currentValue: dropdown.value,
                originalValue: editor.originalDropdownValues[dropdown.id] || dropdown.value
            });
        });

        dropdowns.forEach(dropdown => {
            const state = dropdownStates.find(s => s.id === dropdown.id);
            
            if (state.currentValue === oldName) {
                state.currentValue = newName;
                state.originalValue = newName;
                editor.originalDropdownValues[dropdown.id] = newName;
            }

            let optionsHtml = '';
            let valueToSelect = state.currentValue;

            if (!templates.includes(valueToSelect)) {
                if (templates.includes(state.originalValue)) {
                    valueToSelect = state.originalValue;
                } else {
                    valueToSelect = templates[0];
                    editor.originalDropdownValues[dropdown.id] = templates[0];
                }
            }

            templates.forEach(template => {
                const isSelected = template === valueToSelect;
                optionsHtml += `<option value="${template}" ${isSelected ? 'selected' : ''}>${template}</option>`;
            });

            dropdown.innerHTML = optionsHtml;
            dropdown.value = valueToSelect;
        });
    }
    
    function markDeletedDropdowns(deletedTemplate, templates) {
        const doc = getEditorDocument();
        const dropdowns = doc.querySelectorAll('select.custom-dropdown');
        let hasChanges = false;
        
        const currentValues = {};
        dropdowns.forEach(dropdown => {
            currentValues[dropdown.id] = dropdown.value;
        });
        
        dropdowns.forEach(dropdown => {
            const dropdownId = dropdown.id;
            const currentValue = currentValues[dropdownId];
            const isErrorDropdown = dropdown.classList.contains('error-dropdown');
            
            if (isErrorDropdown) return;
            
            if (currentValue === deletedTemplate) {
                dropdown.className = 'custom-dropdown error-dropdown';
                dropdown.style.cssText = `
                    display: inline-block;
                    margin: 0 4px;
                    min-width: 100px;
                    border: 2px solid #ff0000 !important;
                    background-color: #ffebee !important;
                    color: #ff0000 !important;
                `;
                
                dropdown.innerHTML = '<option value="ERROR" class="error-option" selected>ERROR: Template deleted</option>';
                hasChanges = true;
                
                editor.originalDropdownValues[dropdownId] = 'ERROR';
            }
            else {
                dropdown.innerHTML = templates.map(opt => 
                    `<option value="${opt}" ${opt === currentValue ? 'selected' : ''}>${opt}</option>`
                ).join('');
                
                dropdown.value = templates.includes(currentValue)
                    ? currentValue
                    : editor.originalDropdownValues[dropdownId] || templates[0];
                    
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            const content = doc.body.innerHTML;
            editor.setContent(content);
        }
        
        return hasChanges;
    }
    
    function createDropdownHtml(dropdownId, templates, initialValue) {
        return `
            <select id="${dropdownId}" 
                    class="custom-dropdown" 
                    style="display: inline-block; margin: 0 4px; min-width: 100px;">
                ${templates.map(opt => 
                    `<option value="${opt}" ${opt === initialValue ? 'selected' : ''}>${opt}</option>`
                ).join('')}
            </select>
        `;
    }
    
    return {
        updateValidDropdowns,
        markDeletedDropdowns,
        createDropdownHtml
    };
}

module.exports = { createDropdownManager };