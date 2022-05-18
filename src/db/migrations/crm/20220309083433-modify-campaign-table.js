module.exports = {
  // paid/unpaid, banner, campaignDate, redirectUrl
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.addColumn('Campaigns', 'optionalValues', {
                  type: Sequelize.JSON
              }, { transaction: t }),
          ])
      })
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.removeColumn('Campaigns', 'optionalValues', { transaction: t }),
          ])
      })
  }
};