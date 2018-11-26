'use strict';
/*
* Управление DOM элементами, поиск необходимых элементов
* Передавать в объект(метод start) надо объект(словарь)
* el - Элемент который надо найти в DOM элементе
*   startWith - . = Class
*               # = ID
*               @ = Name
* document - Элемент внутри которого нужно найти другие элементы(контейнер), используется поиск через querySelector
* .start(options) - Запускает процесс поиска DOM элементов
* example:
*   $ = new dom_j().filter
*   --name search
*   $({el:'@region'})
*   -- class search
*   $({el:'.region'})
*   -- ID search
*   $({el:'#region'})
*   $({el:'.container', document: ".informer"})
* */

class DOM_J {
    constructor(){
        this.start_j = this.start_j.bind(this);
        this.id_elements = this.id_elements.bind(this);
        this.class_elements = this.class_elements.bind(this);
        this.name_elements = this.name_elements.bind(this);
        this.documents_href = this.documents_href.bind(this);
        this.append_res = this.append_res.bind(this);
    }

    // Инициализируем запуск поиска
    async filter(options){
        this.options = options;
        this.documents = undefined;
        this.result = [];
        this.el = options['el'];
        await this.start_j(this.el);
        return this.result;
    }

    // Запускаем процесс поиска
    async start_j(el){
        console.log(el);
        if (Array.isArray(el)){
            for (let i of el) {
                this.formating_elements(i);
            }
        } else {
            this.formating_elements(el);
        }
        if (this.documents !== undefined){
            if (this.documents.multi){
                this.documents = this.documents.multi[0] ? this.documents.multi.length>0 : [];
                if (this.documents.multi.length>0) {
                    delete this.documents.multi[0];
                    return this.start_j(el);
                }
            }
        }
    }

    // ищем родителя в ком нужно проводить поиск элементов
    documents_href(el){
        let doc_ = document.querySelectorAll(el);
        if (doc_.length>0) {
            this.documents = doc_[0];
            // Если элементов родителей найдено более одного то включаем режим multi что означает что поиск будет идти по нескольким элементам
            if (doc_.length > 1) {
                delete doc_[0];
                this.documents.__proto__.multi = doc_;
            }
        } else {
            this.documents = window.document;
            console.log("Запращиваемый родитель небыл обнаружен в DOM дереве");
        }

    }

    // Форматируем запрос к DOM
    async formating_elements(el){
        // Если есть родитель где именно искать то нужно запомнить
        if (this.options["document"] && this.documents === undefined) {
            if (typeof this.options["document"] === 'string') {
                let documents = this.options["document"];
                await this.documents_href(documents);
            } else if (typeof this.options['document'] === 'object') {
                this.documents = this.options['document']
            }
        }
        if (el.startsWith('#')){
            await this.id_elements(el)
        } else if (el.startsWith(".")){
            await this.class_elements(el)
        } else if (el.startsWith("@")){
            await this.name_elements(el)
        }
    }

    // Добавляем в результат
    append_res(el){
        if (Array.isArray(el)) {
            if (el.length > 0) {
                this.result.push(el);
            } else {
                console.log("entry");
            }
        } else {
            this.result.push(el);
        }
    }
    // Выбор по ID
    async id_elements(el){
        console.log(this.documents);
        if (this.documents === undefined) {
            this.append_res(document.getElementById(el.slice(1)));
        } else {
            this.append_res(this.documents.querySelectorAll(el));
        }
    }

    // Выбор по class Name
    async class_elements(el){
        el=el.slice(1);
        if (this.documents === undefined) {
            for (let i of document.getElementsByClassName(el)) {
                this.append_res(i);
            }
        } else {
            for (let i of this.documents.getElementsByClassName(el)) {
                this.append_res(i);
            }
        }
    }

    // Выбор по name атрибуту
    async name_elements(el){
        el=el.slice(1);

        if (this.documents === undefined) {
            for (let i of document.getElementsByName(el)) {
                this.append_res(i);
            }
        } else {
             let lists_mask = [`form[name=${el}]`, `input[name=${el}]`, `a[name=${el}]`, `select[name=${el}]`, `textarea[name=${el}]`];
             let formatings = false;
             // Проверяем есть ли необходимая маска для поиска по name атрибутам
             if (el.search("form[") !== -1 || el.search("input[") !== -1 ||
                 el.search("a[") !== -1 || el.search("select[") !== -1 || el.search("textarea[") !== -1) {
                 formatings = true;
             }
             if (formatings) {
                 for (let i of this.documents.querySelectorAll(el)) {
                     this.append_res(i);
                 }
             } else {
                 for (let masks of lists_mask){
                    for (let i of this.documents.querySelectorAll(masks)) {
                        this.append_res(i);
                    }
                 }
             }
        }
    }


}

export {DOM_J}