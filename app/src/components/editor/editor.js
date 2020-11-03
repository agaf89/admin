import React,{Component} from 'react';
import axios from 'axios';

import '../../helpers/iframeLoader.js';
import DOMhelper from '../../helpers/dom-helper';
import EditorText from '../editor-text/editor-text';
import UIkit from 'uikit';
import Spinner from '../spinner/spinner'
import ConfirmModal from '../confirm-modal/confirmModal'
import ChooseModal from '../choose-modal/choose-modal'
import Panel from '../panel/panel'
import EditorMeta from '../editor-meta/editor-meta'
import EditorImages from '../editor-images/editor-images'

export default class Editor extends Component{
    constructor(){
        super();
        this.currentPage = 'index.html'; //стартовая страница
        this.state = {
            pageList: [],
            backupsList: [],
            newPageName: '',
            loading: true
        }
        this.isLoading = this.isLoading.bind(this)
        this.isLoaded = this.isLoaded.bind(this)
        this.save = this.save.bind(this)
        this.init = this.init.bind(this)
        this.restoreBackup =this.restoreBackup.bind(this)
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
        this.loadBackupsList();
    }
    open(page, cb){
        this.currentPage = page;
        axios
            .get(`../${page}?rnd=${Math.random()}`).then( res => {
                return DOMhelper.parseStringtoDOM(res.data) //из сервера приходит строка, парсим ее в ДОМ
            })
            .then( res => DOMhelper.wrapTextNodes(res) ) //оборачиваем ноды в спциальный тег
            .then( res => DOMhelper.wrapImages(res) ) //оборачиваем ноды в спциальный тег для картинок
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
            .then(cb);
        this.loadBackupsList();   
    }
    async save(){ //сохраняем изменения для публикации
        this.isLoading(); //спиннер
        const newDom = this.virtualDOM.cloneNode(this.virtualDOM)
        DOMhelper.unwrapTextNodes(newDom);
        DOMhelper.unwrapImages(newDom);
        const html = DOMhelper.serializeDOMtoString(newDom)
        await axios
            .post('./api/savePage.php', {pageName: this.currentPage, html})
            .then(()=> this.showNotifications('Успешно сохранено','success'))
            .catch(()=> this.showNotifications('Ошибка сохранения','danger'))
            .finally(this.isLoaded)
        this.loadBackupsList();
    }

    enableEditing(){ //метод перебора всех тегов 'text-editor' и включения редактирования
        this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach ( element => {
            const id = element.getAttribute('nodeid')
            const virtualElement = this.virtualDOM.body.querySelector(`[nodeid="${id}"]`);

            new EditorText(element, virtualElement)
        })
        //метод перебора всех тегов 'editableimgid' и включения редактирования
        this.iframe.contentDocument.body.querySelectorAll('[editableimgid]').forEach ( element => {
            const id = element.getAttribute('editableimgid')
            const virtualElement = this.virtualDOM.body.querySelector(`[editableimgid="${id}"]`);

            new EditorImages(element, virtualElement, this.isLoading, this.isLoaded, this.showNotifications)
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
            [editableimgid]:hover{
                outline: 3px solid orange;
                outline-offset: 8px;
            }
        `;
        this.iframe.contentDocument.head.appendChild(style);
    }
    showNotifications(message, status){ //метод для размещения уведомлений
        UIkit.notification({message, status})
    }

    loadPageList(){ //получаем список файлов
        axios.get('./api/pageList.php').then(e => {
            this.setState({pageList: e.data})
        })
    }
    loadBackupsList(){
        axios
        .get('./backups/backups.json')
        .then( res => this.setState({backupsList: res.data.filter(backup => {
            return backup.page === this.currentPage;
        })}))
    }
    restoreBackup(e, backup){
        if (e){
            e.preventDefault();
        }
        UIkit.modal.confirm('Вы действительно хотите восстанновить страницу из этой резервной копии? Все несохраненные данные будут потеряны!', {labels: {ok: 'Восстановить', cancel: 'Отмена' }})
        .then(() => {
            this.isLoading();
            return axios
            .post('./api/restoreBackup.php', {'page': this.currentPage, 'file': backup })
        })
        .then(() => {
            this.open(this.currentPage, this.isLoaded)
        })
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
        const {loading, pageList, backupsList} = this.state;
        const modal = true;
        let spinner;

        loading ? spinner = <Spinner active/> : spinner = <Spinner/>
        return(
            <>  
                <iframe src='' frameBorder='0' ></iframe>
                <input style={{display: 'none'}} id='img-upload' type='file' accept='image/*'></input>
                {spinner}
                <Panel/>

                <ChooseModal data={backupsList} modal={modal} target={'modal-backup'} redirect={this.restoreBackup}/>
                <ConfirmModal modal={modal} target={'modal-save'} method={this.save} />
                <ChooseModal data={pageList} modal={modal} target={'modal-open'} redirect={this.init}/>
                {this.virtualDOM ? <EditorMeta modal={modal} target={'modal-meta'} virtualDOM={this.virtualDOM}/> : false}
            </>
        )
    }
}