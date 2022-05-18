module.exports = {
    // paid/unpaid, banner, campaignDate, redirectUrl
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('Users', 'gender', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Users', 'address2', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Users', 'address3', {
                    type: Sequelize.STRING
                }, { transaction: t }),
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('Users', 'gender', { transaction: t }),
                queryInterface.removeColumn('Users', 'address2', { transaction: t }),
                queryInterface.removeColumn('Users', 'address3', { transaction: t })
            ])
        })
    }
};