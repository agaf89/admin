import React from 'react';
import ReactDOM from 'react-dom'
import Editor from './components/editor/editor'

ReactDOM.render(<Editor/> , document.getElementById('root'))

/* 
function getPageList(){
    $('h1').remove();
    $.get('./api', data => {
        data.forEach( item => {
            $('body').append(`<h1>${item}</h1>`);
        });
    }, 'JSON');
}
getPageList();

$('button').click(()=>{
    $.post('./api/createNewPage.php', {
        'name': $('input').val()
    },() => {
        getPageList();
    })
    .fail( () => {
        alert('Страница уже существует');
    });

}); */