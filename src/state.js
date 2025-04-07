function createState() {
    const state = {
        templates: ['template 1', 'template 2', 'template 3'],
        selectedIndex: -1,
        
        addTemplate: function() {
            let templateName = 'template';
            let counter = 1;
            while (this.templates.includes(`${templateName} ${counter}`)) {
                counter++;
            }
            const newName = `${templateName} ${counter}`;
            this.templates.push(newName);
            return true;
        },
        
        removeTemplate: function(index) {
            if (index >= 0 && index < this.templates.length) {
                return this.templates.splice(index, 1)[0];
            }
            return null;
        },
        
        updateTemplate: function(index, newName) {
            const trimmedName = newName.trim();
            if (index >= 0 && index < this.templates.length && 
                !this.templates.some((t, i) => i !== index && t === trimmedName)) {
                this.templates[index] = trimmedName;
                return true;
            }
            return false;
        }
    };
    
    return state;
}

module.exports = { createState };