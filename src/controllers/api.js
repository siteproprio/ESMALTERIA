const DB = require('../functions/queryDB.js')

function filter(data) {
    data.Valor = Number(data.Valor)
    data.Data = Date.parse(data.Data)
    data.DataRetorno = Date.parse(data.DataRetorno)

    if (data.Nome.match(/[^a-z ]/g)) throw 'Nome invalido'
    if (isNaN(data.Valor)) throw 'Valor invalido'
    if (isNaN(data.Data)) throw 'Data invalida'
    if (isNaN(data.DataRetorno)) throw 'Data invalida'

    data.Data = new Date(data.Data)
    data.DataRetorno = new Date(data.DataRetorno)

    return data
}
function err(res) {
    return res.status(500).send({message: `Server error`})
}

module.exports = {
    search: {
        Name: async (req, res) => {
            var name = (req.query.Name || '').toString().toLowerCase().trim()
            
            if (!name) return err(res)
            if (name.match(/[^a-z ]/g)) return err(res)

            return res.send(await DB.search.name(name))
        },
        all: async (req, res) => {
            return res.send(await DB.all())
        }
    },
    insert: {
        newUser: async (req, res) => {
            var user = {
                Nome: (req.body.Nome || '').toString().toLowerCase().trim(),
                Valor: (req.body.Valor || '').toString().trim(),
                Servico: (req.body.Servico || '').toString().trim(),
                Data: (req.body.Data || '').toString().trim(),
                DataRetorno: (req.body.DataRetorno || '').toString().trim(),
                Texto: (req.body.Texto || '').toString().trim()
            }
            for (let e in user) if (!user[e]) return err(res)

            try { user = filter(user) }
            catch { return err(res) }

            console.log(user)

            await DB.insert(user)
            return res.status(200).send()
        }
    }
}