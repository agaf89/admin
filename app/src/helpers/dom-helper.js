export default class DOMhelper{
    static parseStringtoDOM(str){ //преобразуем строковое представление ДОМ в валидный ДОМ
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");
    }
    static wrapTextNodes(dom){
        const body = dom.body;
        let textNodes = []
        function rec(el){ //рекурисвно перебираем все ноды
            el.childNodes.forEach( node => {
                if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0  ){ //регулярное выражение убирает все пробелы и проверяет длину строки
                    textNodes.push(node)//пушим все ноды в массив
                } else {
                    rec(node)
                }
            })
        }
        rec(body)
        textNodes.forEach( (node, i) => {
            const wrapper = dom.createElement('text-editor');
            node.parentNode.replaceChild(wrapper, node) //создаем обертку из wrapper
            wrapper.appendChild(node) //добавляем ребенка
            wrapper.setAttribute('nodeid', i)
        })

        return dom;
    }
    static serializeDOMtoString(dom){//прнимаем ДОМ и делаем из него строку
        const serializer = new XMLSerializer();
        const str = serializer.serializeToString(dom);
        return str
    }
    static unwrapTextNodes(dom){ //
        dom.body.querySelectorAll('text-editor').forEach( element => {
            element.parentNode.replaceChild(element.firstChild, element)
        })
    }

    static wrapImages(dom){//создаем атрибуты для редактируемой версии дом
        dom.body.querySelectorAll('img').forEach( (img, i) => {
            img.setAttribute('editableimgid', i)
        })
        return dom
    }
    static unwrapImages(dom){ //удаляем атрибуты для чистой версии дом
        dom.body.querySelectorAll('[editableimgid]').forEach( (img) => {
            img.removeAttribute('editableimgid')
        })
    }
}