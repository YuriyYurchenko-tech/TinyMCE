const { initEditor } = require('./initEditor');
const { createState } = require('./state');
const { createDOMManager } = require('./domManager');
const { createDropdownManager } = require('./dropdownManager');
import './styles.css';

document.addEventListener('DOMContentLoaded', async function() {
    try {
        await initEditor();
        const state = createState();
        const domManager = createDOMManager(state);
        const dropdownManager = createDropdownManager(window.editor);
        
        let selectedIndex = -1;

        function selectTemplate(index) {
            selectedIndex = index;
            domManager.updateTemplatesList(selectedIndex);
            dropdownManager.updateValidDropdowns(state.templates);
        }

        domManager.bindEvents({
            onAddTemplate: () => {
                if (state.addTemplate()) {
                    selectTemplate(state.templates.length - 1);
                    document.getElementById('template-edit').focus();
                    document.getElementById('template-edit').select();
                }
            },
            
            onRemoveTemplate: () => {
                if (selectedIndex >= 0) {
                    if (!domManager.confirmAction('Are you sure you want to delete this template?')) return;
                    
                    const removedTemplate = state.removeTemplate(selectedIndex);
                    if (removedTemplate) {
                        dropdownManager.markDeletedDropdowns(removedTemplate, state.templates);
                        selectedIndex = -1;
                        domManager.updateTemplatesList(selectedIndex);
                    }
                }
            },
            
            onUpdateTemplate: () => {
                if (selectedIndex >= 0) {
                    const oldName = state.templates[selectedIndex];
                    const newName = document.getElementById('template-edit').value.trim();
                    
                    if (state.updateTemplate(selectedIndex, newName)) {
                        dropdownManager.updateValidDropdowns(state.templates, oldName, newName);
                        domManager.updateTemplatesList(selectedIndex);
                    } else {
                        domManager.showError('Template with this name already exists!');
                        document.getElementById('template-edit').value = oldName;
                    }
                }
            },
            
            onInsertDropdown: () => {
                if (state.templates.length === 0) {
                    domManager.showError('Add at least one template first!');
                    return;
                }

                const dropdownId = 'dropdown-' + Math.random().toString(36).substr(2, 9);
                const initialValue = state.templates[0];
                const dropdownHtml = dropdownManager.createDropdownHtml(dropdownId, state.templates, initialValue);
                
                window.editor.originalDropdownValues[dropdownId] = initialValue;
                window.editor.insertContent(dropdownHtml);
            },
            
            onTemplateSelected: selectTemplate
        });

        domManager.updateTemplatesList(selectedIndex);
    } catch (error) {
        console.error('Application initialization failed:', error);
    }
});