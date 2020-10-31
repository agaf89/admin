import React,{Component} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
export default class Editor extends Component{
    constructor(){
        super();
        this.state = {
            pageList: [],
            newPageName: ''
        }
        this.createNewPage = this.createNewPage.bind(this)
    }
    
    componentDidMount(){
        this.loadPageList()
    }

    loadPageList(){
        axios.get('./api').then(e => {
            console.log(e)
            this.setState({pageList: e.data})
        })
    }
    createNewPage(){
        axios.post('./api/createNewPage.php', {'name': this.state.newPageName})
        .then(this.loadPageList()).catch ( () =>  alert('Страница уже существует'));
    }


    render(){
        const {pageList} = this.state
        const pages = pageList.map ( page => {
            return(
                <h1 key={uuidv4()}>{page}</h1>
            )
        })
        return(
            <>
                <input
                onChange={(e) => this.setState({ newPageName: e.target.value})}
                type='text'/>
                <button onClick={this.createNewPage}>Создать страницу</button>
                {pages}
            </>
        )
    }
}