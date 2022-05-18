module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addConstraint('RolePermissions', {
                fields: ['roleId', 'permissionId'],
                type: 'unique',
                name: 'role_permission_unique'
                }),
            queryInterface.changeColumn('Permissions', 'name', {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Permissions', 'name', {
                type: Sequelize.STRING,
                allowNull: false,
                unique: false
            }, {transaction: t})
        ])
    }
};