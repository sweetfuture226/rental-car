module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addConstraint('OptionalUserValues', {
                fields: ['phone', 'key'],
                type: 'unique',
                name: 'phone_key_unique'
            }),
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([])
    }
};