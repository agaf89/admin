import React,{Component} from 'react';
import axios from 'axios';

export default class Editor extends Component{
    constructor(){
        super();
        this.state = {
            pageList: [],
            newPageName: ''
        }
    }
    loadPageList(){
        
    }
    render(){
        return(
            <>
                <input type='text'/>
                <button>Создать страницу</button>
            </>
        )
    }
}