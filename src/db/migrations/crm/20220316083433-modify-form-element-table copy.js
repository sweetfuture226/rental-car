module.exports = {
  // paid/unpaid, banner, campaignDate, redirectUrl
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.addColumn('FormElements', 'createdBy', {
                  type: Sequelize.UUID
              }, { transaction: t }),
              queryInterface.addColumn('FormElements', 'updatedBy', {
                type: Sequelize.UUID
            }, { transaction: t }),
          ])
      })
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.removeColumn('FormElements', 'createdBy', { transaction: t }),
              queryInterface.removeColumn('FormElements', 'updatedBy', { transaction: t }),
          ])
      })
  }
};