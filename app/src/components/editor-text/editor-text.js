export default class EditorText {
    constructor(element, virtual){
        this.element = element;
        this.virtual = virtual;
        this.element.addEventListener('click',() => this.onClick());
        this.element.addEventListener('blur',() => this.onBlur());
        this.element.addEventListener('keypress',(e) => this.onKeypress(e));
        this.element.addEventListener('input',() => this.onTextEdit());
        if (this.element.parentNode.nodeName === 'A' || this.element.parentNode.nodeName === 'BUTTON'  ){
            this.element.addEventListener('contextmenu',(e) => this.onCtxMenu(e));
        }
        
    }
    onCtxMenu(e){
        e.preventDefault()
        this.onClick()
    }



    onClick(){
        this.element.contentEditable = 'true'; //добавялем атрибут редактирвоания тега
        this.element.focus() //делаем фокус на элементе, чтобы не жать 2 раза клик
    }
    onBlur(){
        this.element.removeAttribute('contenteditable');
    }
    onKeypress(e){
        if(e.keyCode === 13){
            this.element.blur();
        }
    }
    onTextEdit(){
        this.virtual.innerHTML = this.element.innerHTML; //записываем в читсую копию изменения
    }
}