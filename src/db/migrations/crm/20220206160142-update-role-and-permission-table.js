module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('Roles', 'createdBy', {
                    type: Sequelize.UUID
                }, { transaction: t }),
                queryInterface.addColumn('Roles', 'updatedBy', {
                    type: Sequelize.UUID,
                }, { transaction: t })
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('Roles', 'createdBy', { transaction: t }),
                queryInterface.removeColumn('Roles', 'updatedBy', { transaction: t }),
            ])
        })
    }
};