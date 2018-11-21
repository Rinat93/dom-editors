'use strict';
/*
* CREATE:
*   {
*       type - [div, a, p and etc]
*       options - [id, name, class]
*       root - элемент который если начинаетс на + то означает что перед ним должен встать новый элемент, если - то после
*           если positions не указана то по умолчанию будет добавляться к document.appendChild
*       child - Создать сразу дочерные элементы
*   }
* UPDATE
*   {
*      el - Элемент который надо обновить
*
*   }
* Формат создания должен быть elements - {type: "div", root: document, id:"id", class:"class",body:"text", href:"//", src:"//", task:[{type:'click', func: func}] child: [{type:"div" ...}] }
*
* Example
*   new dom_j().init("create",{type:"div", root:"-.profile-header", id:"sections-23", child:[{type:"a",body:"Привет ", href:"#"}]})
*   new dom_j().init("create",{type:"a", root:"-.profile-header", id:"sections-23",body:"Привет ",href:"#"})
*   new dom_j().init("create",{type:"div", root:"-.profile-header", id:"sections-23", child:[{type:"p",body:"Кликни меня", href:"#", tasks:[{type:'click', func:function(){ console.log("Ура")} }]}]})
*   new dom_j().init("create",{type:"div", root:"-.profile-header", id:"sections-23", child:[{type:"p",body:"Кликни меня", href:"#"}], tasks:[{type:'click', func:function(){ console.log("Ура")} }]})
* */
import {DOM_J} from "./dom.js";
import {Events} from "./events.js";
class Create_Dom extends DOM_J {
    constructor(){
        super();
        this.init = this.init.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.add_child = this.add_child.bind(this);
        this.add_tasks = this.add_tasks.bind(this);
        this.positions_append = this.positions_append.bind(this);
    }

    init(status,elements){
        if (status==="create"){
            this.create(elements);
        } else if (status==="update") {
            this.update(elements);
        }
    }

    // update elements
    update(options){
        this.filter(options).then((cr_el)=>{
            if (cr_el){
                cr_el.id = options.id;
            }
        });
    }

    // create elements
    async create(elements){
        if (elements.type){
            let cr_el = document.createElement(elements.type);
            cr_el.id = elements.id !== undefined ? elements.id  : '';
            cr_el.className = elements.class !== undefined ? elements.class  : '';
            cr_el.name = elements.name !== undefined? elements.name : '';
            if (elements.type === "a")
                cr_el.href = elements.href !== undefined ? elements.href  : '';
            if (elements.type === "img")
                cr_el.src = elements.src !== undefined ? elements.src : '';
            else
                cr_el.innerText = elements.body !== undefined  ? elements.body : '';
            console.log(cr_el);
            await this.positions_append(cr_el, elements.root);
            if (elements.child){
                this.add_child(elements.child, cr_el)
            }
            if (elements.tasks) {
                this.add_tasks(elements.tasks, cr_el);
            }
        } else {
            console.log("Не указали type");
            return false;
        }
    }

    // добавляем дочерные элементы
    add_child(child, root){
        for (let c of child){
            c['root'] = root;
            this.create(c);
        }
    }


    add_tasks(events,el) {
        events.forEach(ev => {
            if (ev.type && ev.func) {
                new Events().create(el, ev.type, ev.func);
            }
        });
    }

    /*
    * el элемент в который добавляем созданный элемент
    * pos_el - + or -
    * elements - Созданный элемент
    * */
    add_pos(el,elements,pos_el){
        if (el){
            if (pos_el === "+"){
                el.appendChild(elements)
            } else if (pos_el === "-") {
                el.insertBefore(elements,el.firstChild);
            } else {
                el.appendChild(elements)
            }
        }
    }

    async positions_append(elements, position_el){
        if (position_el) {
            let pos_el = position_el[0];
            if (typeof position_el === "string") {
                let pos = this.filter({el: position_el.slice(1)});
                pos.then((el) => {
                    console.log(el);
                    this.add_pos(el[0], elements,pos_el)
                })
            } else if (typeof position_el === "object"){
                this.add_pos(position_el, elements,pos_el);
            }
        }
    }
}

window.dom_j = Create_Dom;
export {Create_Dom}