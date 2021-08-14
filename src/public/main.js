
const getDate = (separate, date) => {return `${String(date.getDate()).padStart(2, '0')}${separate}${String(date.getMonth()).padStart(2, '0')}${separate}${date.getFullYear()}`}
const getDateTime = (separate, date) => {return `${String(date.getDate()).padStart(2, '0')}${separate}${String(date.getMonth()).padStart(2, '0')}${separate}${date.getFullYear()} | ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`}

const value = {
    1: 'Unha e Gel',
    2: 'Postiça',
    3: 'Pé e mão',
    4: 'Manuntenção'
}

class Messages {
    constructor(block) {
        this.block = block
        this.list = {}
    }
    template(title, message) {
        const id = (Math.random()*10**19).toString()
    
        var newDiv = document.createElement('div')
        newDiv.id = `_${id}`
        newDiv.classList.add('boxMessage')
        newDiv.innerHTML = '<div class="gridMessage">'+
                                `<div id="title" class="up">${title}</div>`+
                                `<div id="close" onclick="events.close(this.parentElement.parentElement.id)" class="up"><svg fill-rule="evenodd" clip-rule="evenodd"><path d="M7 5h17v16h-17l-7-7.972 7-8.028zm7 6.586l-2.586-2.586-1.414 1.414 2.586 2.586-2.586 2.586 1.414 1.414 2.586-2.586 2.586 2.586 1.414-1.414-2.586-2.586 2.586-2.586-1.414-1.414-2.586 2.586z"/></svg></div>`+
                                `<div id="message">${message}</div>`+
                            '</div>'
    
        return [newDiv, id]
    }
    insert(title, msg) {
        var [div, id] = this.template(title, msg)

        this.block.appendChild(div)

        this.list[id] = {
            title: title,
            message: msg,
            time: setTimeout(() => {this.close(id)}, 6000)
        }
        setTimeout(() => { this.show(id) }, 0)
    }
    show(id) {
        this.block.querySelector(`div#_${id}`).style.transform = 'translateX(340px)'
    }
    close(id) {
        id = id.split('_')[1] || id
        clearTimeout(this.list[id].time)

        const item = this.block.querySelector(`div#_${id}`)

        item.style.transform = 'translateX(0px)'
        setTimeout(() => { item.style.maxHeight = 0 }, 1000);
        setTimeout(() => { item.remove() }, 2000) 
    }
}
class Throws {
    search = {
        none: function() {
            this.title = 'Input vazio'
            this.message = 'É necessário que ao menos 1 campo esteja perenchido para a busca'

            events.insert(this.title, this.message)
        },
        duplicated: function() {
            this.title = 'Input duplicado'
            this.message = 'Somente 1 campo pode estar perenchido para a busca'

            events.insert(this.title, this.message)
        }
    }
    insert = {
        none: function() {
            this.title = 'Input vazio'
            this.message = 'É necessário que todos os inputs sejam preenchidos para a inserção'

            events.insert(this.title, this.message)
        }
    }
}
class Query {
    xml(method, url, params=undefined) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest()
            xhr.open(method, url, true)
            xhr.responseType = 'json'
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response)
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    })
                }
            }
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                })
            }
            xhr.send(params)
        })
    }
    query(url) {
        tableMessages.loading()
        this.xml('GET', url)
            .then((finded) => {
                if (finded) if (finded.length == 0) return tableMessages.none()

                tableMessages.insert(finded)
                tableMessages.table()
            })
            .catch(err => {
                tableMessages.error()
                console.log(err)
            })
    }
    insert(url, params) {
        this.xml('POST', url, params)
            .then(() => {
                events.insert('Sucesso!', 'Usuário inserido com sucesso')
                insert.clearInput()
                query.query('/api/search/all')
            })
            .catch(err => {
                console.error(err)
                events.insert('Error!', 'Houve um erro ao inserir o usuário')
            })
    }
}
class TableMessages {
    constructor (block) {
        this.blockTable = block.querySelector('div#table')
        this.blockMessage = block.querySelector('div#messages')
    }
    // message
    error() {
        this.blockTable.style.display = 'none'
        this.blockMessage.style.display = 'flex'

        this.blockMessage.querySelector('div#error').style.display = 'flex'
        this.blockMessage.querySelector('div#loading').style.display = 'none'
        this.blockMessage.querySelector('div#none').style.display = 'none'
    }
    loading() {
        this.blockTable.style.display = 'none'
        this.blockMessage.style.display = 'flex'

        this.blockMessage.querySelector('div#error').style.display = 'none'
        this.blockMessage.querySelector('div#loading').style.display = 'flex'
        this.blockMessage.querySelector('div#none').style.display = 'none'
    }
    none() {
        this.blockTable.style.display = 'none'
        this.blockMessage.style.display = 'flex'

        this.blockMessage.querySelector('div#error').style.display = 'none'
        this.blockMessage.querySelector('div#loading').style.display = 'none'
        this.blockMessage.querySelector('div#none').style.display = 'flex'
    }
    table() {
        this.blockTable.style.display = 'block'
        this.blockMessage.style.display = 'none'

        this.blockMessage.querySelector('div#error').style.display = 'none'
        this.blockMessage.querySelector('div#loading').style.display = 'none'
        this.blockMessage.querySelector('div#none').style.display = 'none'
    }

    // table
    template(data) {
        console.log(data)
        data.Data = getDateTime('/', new Date(data.Data))
        data.DataRetorno = getDate('/', new Date(data.DataRetorno))


        var newDiv = document.createElement('div')
        newDiv.classList.add('row')
        newDiv.innerHTML = `<input type="checkbox" name="cb_${data._id}" id="cb_${data._id}">`+
            '<div id="block">'+
                `<div id="Name"><p>${data.Nome}</p></div>`+
                `<div id="Date"><p>${data.Data}</p></div>`+
                `<div id="btn_more"><label for="cb_${data._id}"><svg id="arrow" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.218 19l-1.782-1.75 5.25-5.25-5.25-5.25 1.782-1.75 6.968 7-6.968 7z"/></svg></label></div>`+
            '</div>'+
            '<div id="More">'+
                `<div id="Return" class="Date item">`+
                    '<p>Obs:</p>'+
                    '<div>'+
                        `<p>${data.DataRetorno}</p>`+
                        `<p>${data.Texto}</p>`+
                    '</div>'+
                `</div>`+
                `<div id="Service" class="item left"><p>Serviço:</p><p>${value[data.Servico]}</p></div>`+
                `<div id="Value" class="item left"><p>Valor: R$</p><p>${data.Valor}</p></div>`+
            '</div>'

        return newDiv
    }
    clear() {
        this.blockTable.querySelectorAll('div.row:not(div#header)').forEach((e) => {
            e.remove()
        })
    }
    insert(data) {
        this.clear()
        data.forEach(e => {
            var div = this.template(e)
            this.blockTable.appendChild(div)
        })
    }
}

class Search {
    constructor (block) {
        this.block = block
    }
    getInput() {
        return {
            Name: this.block.querySelector('input#searchName').value
        }
    }
    clearInput() {
        this.block.querySelectorAll('input.item').forEach((e) => {
            e.value = ''
        })
    }
    name(Name) { query.query(`/api/search/Name?Name=${Name}`) }
    send() {
        var data = this.getInput()

        if (!data['Name']) throw new throws.search.none()
        this.name(data['Name'])
    }
}

class Insert {
    constructor (block) {
        this.block = block
    }
    getInput() {
        return {
            Name: this.block.querySelector('input#name').value.trim(),
            Service: this.block.querySelector('select#service').value.trim(),
            Value: this.block.querySelector('input#value').value.trim(),
            Date: this.block.querySelector('input#date').value.trim(),
            Text: this.block.querySelector('textarea#text').value.trim(),
            DateReturn: this.block.querySelector('input#return').value.trim()
        }
    }
    clearInput() {
        this.block.querySelectorAll('input.item').forEach((e) => {
            e.value = ''
        })
    }
    send() {
        var data = this.getInput()
        console.log(data)

        for (let e of Object.values(data)) {
            if (!e) throw new throws.insert.none()
        }
        var params = `Nome=${data['Name']}&Servico=${data['Service']}&Valor=${data['Value']}&Texto=${data['Text']}&Data=${data['Date']}&DataRetorno=${data['DateReturn']}`
        query.insert('api/insert/newUser', params)
    }
}

const events = new Messages(window.document.querySelector('header div#event'))
const search = new Search(window.document.querySelector('main form#search'))
const insert = new Insert(window.document.querySelector('main form#insert'))
const tableMessages = new TableMessages(window.document.querySelector('main div#down'))

const query = new Query()
const throws = new Throws()

document.addEventListener("DOMContentLoaded", function(event) {
    query.query('/api/search/all')
})