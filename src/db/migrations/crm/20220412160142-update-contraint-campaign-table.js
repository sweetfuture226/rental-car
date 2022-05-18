module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addConstraint('UserCampaigns', {
                fields: ['userId', 'campaignId'],
                type: 'unique',
                name: 'user_campaign_unique'
            }),
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([])
    }
};