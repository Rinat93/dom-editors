Управление DOM элементами, поиск необходимых элементов
* Передавать в объект(метод start) надо объект(словарь)
* el - Элемент который надо найти в DOM элементе
*   startWith - . = Class
*               # = ID
*               @ = Name
* document - Элемент внутри которого нужно найти другие элементы(контейнер), используется поиск через querySelector
* .start(options) - Запускает процесс поиска DOM элементов
    
        example:
            $ = new dom_j().filter
            --name search
            $({el:'@region'})
            -- class search
            $({el:'.region'})
            -- ID search
            $({el:'#region'})
            $({el:'.container', document: ".informer"})


* CREATE:

  {
  
    * type - [div, a, p and etc]
   
    * options - [id, name, class]
    * root - элемент который если начинаетс на + то означает что перед ним должен встать новый элемент, если - то после
    если positions не указана то по умолчанию будет добавляться к document.appendChild
   
    * child - Создать сразу дочерные элементы
   
  }
   
* Формат создания должен быть elements - 

        {type: "div", root: document, id:"id", class:"class",body:"text", href:"//", src:"//", task:[{type:'click', func: func}] child: [{type:"div" ...}] }

* Example
   
       new dom_j().init("create",{type:"div", root:"-.profile-header", id:"sections-23", child:[{type:"a",body:"Привет ", href:"#"}]})
       
       new dom_j().init("create",{type:"a", root:"-.profile-header", id:"sections-23",body:"Привет ",href:"#"})
       
       new dom_j().init("create",{type:"div", root:"-.profile-header", id:"sections-23", child:[{type:"p",body:"Кликни меня", href:"#", tasks:[{type:'click', func:function(){ console.log("Ура")} }]}]})
       
       new dom_j().init("create",{type:"div", root:"-.profile-header", id:"sections-23", child:[{type:"p",body:"Кликни меня", href:"#"}], tasks:[{type:'click', func:function(){ console.log("Ура")} }]})

Используется другая моя библиотека event-machine для создания событии, почитать документацию по ней можно тут:
    
    https://github.com/Rinat93/event_machine