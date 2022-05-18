module.exports = {
  // paid/unpaid, banner, campaignDate, redirectUrl
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.addColumn('Products', 'categoryId', {
                  type: Sequelize.UUID
              }, { transaction: t }),
          ])
      })
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.removeColumn('Products', 'categoryId', { transaction: t }),
          ])
      })
  }
};