module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('FormElements', 'name', {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('FormElements', 'name', {
                type: Sequelize.STRING,
                allowNull: false,
                unique: false
            }, {transaction: t})
        ])
    }
};