function initEditor() {
    return tinymce.init({
        selector: '#editor',
        content_css: '/editorContent.css',
        plugins: 'lists link',
        toolbar: false,
        menubar: false,
        statusbar: false,
        setup: function(editor) {
            window.editor = editor;
            editor.originalDropdownValues = {};
        }
    });
}

module.exports = { initEditor };