
const service = {
    getAllCapsules(knex) {
        return knex.select('*').from('capsules')
    },
    insertCapsule(knex, newCapsules) {
        console.log(newCapsules)
        return knex
            .insert(newCapsules)
            .into('capsules')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('capsules').select('*').where('id', id).first()
    },
    getByusernumber(knex, usernumber) {
        return knex.from('capsules').select('*').where('usernumber', usernumber)
    },
    deleteCapsule(knex, id) {
        return knex('capsules')
            .where({ id })
            .delete()
    },
    updateCapsule(knex, id, newCapsuleFields) {
        return knex('capsules')
            .where({ id })
            .update(newCapsuleFields)
    },
}

module.exports = service;