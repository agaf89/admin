import React, {Component} from 'react'


export default class EditorMeta extends Component {
    constructor(props){
        super(props);
        this.state = {
            meta: {
                title: '',
                keywords: '',
                description: ''
            }
        }
    }
    componentDidMount(){
        this.getMeta(this.props.virtualDOM)
    }
    componentDidUpdate(prevProps){
        if (this.props.virtualDOM !== prevProps.virtualDOM ){ //на случай открытия новой страницы меняем на новый virtualDOM
            this.getMeta(this.props.virtualDOM)
        }
    }


    getMeta(virtualDOM){
        this.title = virtualDOM.head.querySelector('title') || virtualDOM.head.appendChild(virtualDOM.createElement('title')) //полчаем тайтл или создаем если его нет
        this.keywords = virtualDOM.head.querySelector('meta[name="keywords"]');
        if (!this.keywords) { // если нет мета, то создаем мета и keywords 
            this.keywords = virtualDOM.head.appendChild(virtualDOM.createElement('meta'))
            this.keywords.setAttribute('name', 'keywords')
            this.keywords.setAttribute('content', '')//решаем проблему при открытии новой страницы (сохранение мета с прошлой страницы)
        }

        this.description = virtualDOM.head.querySelector('meta[name="description"]');
        if (!this.description) { // если нет мета, то создаем мета и description 
            this.description = virtualDOM.head.appendChild(virtualDOM.createElement('meta'))
            this.description.setAttribute('name', 'description')
            this.description.setAttribute('content', '') //решаем проблему при открытии новой страницы (сохранение мета с прошлой страницы)
        }
        this.setState({
            meta: {
                title: this.title.innerHTML,
                keywords: this.keywords.getAttribute('content'),
                description: this.description.getAttribute('content')
            }
        })
    }

    applyMeta(){
        this.title.innerHTML = this.state.meta.title;
        this.keywords.setAttribute('content', this.state.meta.keywords );
        this.description.setAttribute('content', this.state.meta.description )
    }

    onValueChange(e){
        if (e.target.getAttribute('data-title')) {
            e.persist();
            this.setState(({meta})=> {
                const newMeta = {
                    ...meta,
                    title: e.target.value
                }
                return {
                    meta: newMeta
                }
            })
        } else if (e.target.getAttribute('data-key')) {
            e.persist();
            this.setState(({meta})=> {
                const newMeta = {
                    ...meta,
                    keywords: e.target.value
                }
                return {
                    meta: newMeta
                }
            })
        } else {
            e.persist();
            this.setState(({meta})=> {
                const newMeta = {
                    ...meta,
                    description: e.target.value
                }
                return {
                    meta: newMeta
                }
            })
        }
        
    }

    render(){
        const {modal, target} = this.props
        const {title, description, keywords} = this.state.meta

        return (
            <div container='false' id={target} uk-modal={modal.toString()}>
                <div className="uk-modal-dialog uk-modal-body">
                    <h2 className="uk-modal-title">Редактирование Meta-тегов</h2>
                    <form>
                        <div className="uk-margin">
                            <input 
                                data-title
                                onChange={(e) => this.onValueChange(e)}
                                className="uk-input" 
                                type="text" 
                                placeholder="Title" 
                                value={title}/>
                        </div>
                        <div className="uk-margin">
                            <textarea 
                                data-key
                                onChange={(e) => this.onValueChange(e)}
                                className="uk-textarea" 
                                rows="5" 
                                placeholder="Keywords" 
                                value={keywords}>

                            </textarea>
                        </div>
                        <div className="uk-margin">
                            <textarea 
                                data-description
                                onChange={(e) => this.onValueChange(e)}
                                className="uk-textarea" 
                                rows="5" 
                                placeholder="Description" 
                                value={description}>

                            </textarea>
                        </div>
                    </form>
                    <p className="uk-text-right">
                        <button className="uk-button uk-button-default uk-modal-close uk-margin-small-right" type="button">Отменить</button>
                        <button
                        onClick={() => this.applyMeta()}
                        className="uk-button uk-button-primary uk-modal-close" type="button"
                        >Применить</button>
                    </p>
                </div>
            </div>
        )
    }
}