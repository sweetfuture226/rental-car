module.exports = {
  // paid/unpaid, banner, campaignDate, redirectUrl
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.addColumn('Documents', 'uploadId', {
                  type: Sequelize.STRING
              }, { transaction: t }),
              queryInterface.addColumn('Documents', 'fileName', {
                type: Sequelize.STRING
            }, { transaction: t }),
            queryInterface.addColumn('Documents', 'key', {
                type: Sequelize.STRING
            }, { transaction: t }),
          ])
      })
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.removeColumn('Documents', 'uploadId', { transaction: t }),
              queryInterface.removeColumn('Documents', 'fileName', { transaction: t }),
              queryInterface.removeColumn('Documents', 'key', { transaction: t }),
          ])
      })
  }
};