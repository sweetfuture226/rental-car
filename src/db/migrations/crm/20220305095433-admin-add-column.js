module.exports = {
    // paid/unpaid, banner, campaignDate, redirectUrl
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('Admins', 'gender', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Admins', 'avatar', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Admins', 'dateOfBirth', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Admins', 'address1', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Admins', 'address2', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Admins', 'state', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Admins', 'country', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Admins', 'zipCode', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Admins', 'city', {
                    type: Sequelize.STRING
                }, { transaction: t }),
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('Admins', 'gender', { transaction: t }),
                queryInterface.removeColumn('Admins', 'dateOfBirth', { transaction: t }),
                queryInterface.removeColumn('Admins', 'address1', { transaction: t }),
                queryInterface.removeColumn('Admins', 'address2', { transaction: t }),
                queryInterface.removeColumn('Admins', 'country', { transaction: t }),
                queryInterface.removeColumn('Admins', 'state', { transaction: t }),
                queryInterface.removeColumn('Admins', 'city', { transaction: t }),
                queryInterface.removeColumn('Admins', 'zipCode', { transaction: t }),
                queryInterface.removeColumn('Admins', 'avatar', { transaction: t })
            ])
        })
    }
};