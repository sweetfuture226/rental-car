module.exports = {
    // paid/unpaid, banner, campaignDate, redirectUrl
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('Admins', 'stripeAcctId', {
                    type: Sequelize.STRING
                }, { transaction: t }),
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('Admins', 'stripeAcctId', { transaction: t }),
            ])
        })
    }
};