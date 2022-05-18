module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('Users', 'instagramId', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Users', 'age', {
                    type: Sequelize.INTEGER,
                }, { transaction: t })
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('Users', 'instagramId', { transaction: t }),
                queryInterface.removeColumn('Users', 'age', { transaction: t }),
            ])
        })
    }
};