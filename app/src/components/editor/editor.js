import React,{Component} from 'react';
import axios from 'axios';

import '../../helpers/iframeLoader.js';
import DOMhelper from '../../helpers/dom-helper';
import EditorText from '../editor-text/editor-text';
import UIkit from 'uikit';
import Spinner from '../spinner/spinner'
import ConfirmModal from '../confirm-modal/confirmModal'
import ChooseModal from '../choose-modal/choose-modal'


export default class Editor extends Component{
    constructor(){
        super();
        this.currentPage = 'index.html';
        this.state = {
            pageList: [],
            newPageName: '',
            loading: true
        }
        this.createNewPage = this.createNewPage.bind(this)
        this.deletePage = this.deletePage.bind(this)
        this.isLoading = this.isLoading.bind(this)
        this.isLoaded = this.isLoaded.bind(this)
        this.save = this.save.bind(this)
        this.init = this.init.bind(this)
    }
    
    componentDidMount(){
        this.init(null, this.currentPage)
    }

    init(e, page){
        if (e){
            e.preventDefault();
        }
        this.isLoading()
        this.iframe = document.querySelector('iframe'); //ждем пока все загрузится
        this.open(page, this.isLoaded);
        this.loadPageList(); //с сервера получаем доступные страницы
    }
    open(page, cb){
        this.currentPage = page;
        axios
            .get(`../${page}?rnd=${Math.random()}`).then( res => {
                return DOMhelper.parseStringtoDOM(res.data) //из сервера приходит строка, парсим ее в ДОМ
            }).then( res => DOMhelper.wrapTextNodes(res) ) //оборачиваем ноды в спциальный тег
            .then( dom => {
                this.virtualDOM = dom // 'чистый' дом записываем в переменную
                return dom
            })
            .then( DOMhelper.serializeDOMtoString) //не можем на сервер отправить ДОМ, поэтому отправляем строку
            .then( html => axios.post('./api/saveTempPage.php', {html})) //на сервере создаем файл с нужной структурой
            .then( () => this.iframe.load('../dnjwk_12312_sad-43.html')) //с помощью библиотеки ждем пока загрузится НОВЫЙ ФАЙЛ, который выше создали
            .then( ()=> axios.post('./api/deleteTempPage.php'))
            .then(() => this.enableEditing()) //включаем редактирование элементов
            .then( () => this.injectStyles())
            .then(cb)
    }
    save(onSucses,onError){ //сохраняем изменения
        this.isLoading(); //спиннер
        const newDom = this.virtualDOM.cloneNode(this.virtualDOM)
        DOMhelper.unwrapTextNodes(newDom);
        const html = DOMhelper.serializeDOMtoString(newDom)
        axios.post('./api/savePage.php', {pageName: this.currentPage, html})
        .then(onSucses)
        .catch(onError)
        .finally(this.isLoaded)
    }

    enableEditing(){ //метод перебора всех тегов 'text-editor' и включения редактирования
        this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach ( element => {
            const id = element.getAttribute('nodeid')
            const virtualElement = this.virtualDOM.body.querySelector(`[nodeid="${id}"]`);

            new EditorText(element, virtualElement)
        })
    }
    injectStyles(){
        const style = this.iframe.contentDocument.createElement('style');
        style.innerHTML= `
            text-editor:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
            text-editor:focus {
                outline: 3px solid red;
                outline-offset: 8px;
            }
        `;
        this.iframe.contentDocument.head.appendChild(style);
    }


    loadPageList(){ //получаем список файлов
        axios.get('./api/pageList.php').then(e => {
            this.setState({pageList: e.data})
        })
    }
    createNewPage(){
        axios.post('./api/createNewPage.php', {'name': this.state.newPageName})
        .then(this.loadPageList()).catch ( () =>  alert('Страница уже существует'));
    }
    deletePage(page){
        const result = confirm('Вы уверены, что нужно удалить?')
        if (result){
            axios.post('./api/deletePage.php', {'name': page})
            .then(this.loadPageList()).catch ( () =>  alert('Такого файла не существует'));
        } else {
            null
        }
    }

    isLoading(){
        this.setState({
            loading: true
        })
    }
    isLoaded(){
        this.setState({
            loading: false
        })
    }

    render(){
        const {loading, pageList} = this.state;
        const modal = true;
        let spinner;
        loading ? spinner = <Spinner active/> : spinner = <Spinner/>
        return(
            <>  
                <iframe src={this.currentPage} frameBorder='0' ></iframe>
                {spinner}
                <div className='panel'>
                    <button uk-toggle="target: #modal-open" className="uk-button uk-button-primary uk-margin-small-right">Открыть</button>
                    <button uk-toggle="target: #modal-save" className="uk-button uk-button-primary">Опубликовать</button>
                </div>
                <ConfirmModal modal={modal} target={'modal-save'} method={this.save} />
                <ChooseModal data={pageList} modal={modal} target={'modal-open'} redirect={this.init}/>
            </>
        )
    }
}