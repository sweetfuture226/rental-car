module.exports = {
    // paid/unpaid, banner, campaignDate, redirectUrl
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('Users', 'facebookHandle', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Users', 'twitterHandle', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Users', 'tiktokHandle', {
                    type: Sequelize.STRING
                }, { transaction: t }),
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('Users', 'facebookHandle', { transaction: t }),
                queryInterface.removeColumn('Users', 'twitterHandle', { transaction: t }),
                queryInterface.removeColumn('Users', 'tiktokHandle', { transaction: t }),
            ])
        })
    }
};