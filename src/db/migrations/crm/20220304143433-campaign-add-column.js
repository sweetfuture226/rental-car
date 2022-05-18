module.exports = {
    // paid/unpaid, banner, campaignDate, redirectUrl
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('Campaigns', 'facebookHandle', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Campaigns', 'twitterHandle', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Campaigns', 'tiktokHandle', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Campaigns', 'instagramHandle', {
                    type: Sequelize.STRING
                }, { transaction: t }),
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('Campaigns', 'facebookHandle', { transaction: t }),
                queryInterface.removeColumn('Campaigns', 'twitterHandle', { transaction: t }),
                queryInterface.removeColumn('Campaigns', 'tiktokHandle', { transaction: t }),
                queryInterface.removeColumn('Campaigns', 'instagramHandle', { transaction: t })
            ])
        })
    }
};