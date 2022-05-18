module.exports = {
    // paid/unpaid, banner, campaignDate, redirectUrl
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('Campaigns', 'paidType', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Campaigns', 'banner', {
                    type: Sequelize.STRING,
                }, { transaction: t }),
                queryInterface.addColumn('Campaigns', 'redirectUrl', {
                    type: Sequelize.STRING,
                }, { transaction: t }),
                queryInterface.addColumn('Campaigns', 'status', {
                    type: Sequelize.STRING,
                }, { transaction: t }),
                queryInterface.addColumn('Campaigns', 'campaignDate', {
                    type: Sequelize.DATE,
                }, { transaction: t }),
                queryInterface.addColumn('Campaigns', 'formData', {
                    type: Sequelize.JSON,
                }, { transaction: t }),
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('Campaigns', 'paidType', { transaction: t }),
                queryInterface.removeColumn('Campaigns', 'banner', { transaction: t }),
                queryInterface.removeColumn('Campaigns', 'redirectUrl', { transaction: t }),
                queryInterface.removeColumn('Campaigns', 'campaignDate', { transaction: t }),
                queryInterface.removeColumn('Campaigns', 'formData', { transaction: t }),
            ])
        })
    }
};