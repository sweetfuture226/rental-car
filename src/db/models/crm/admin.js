const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
      'Admin',
      {
          id: {
              type: DataTypes.UUID,
              primaryKey: true,
              defaultValue: DataTypes.UUIDV4,
              allowNull: false,
          },
          email: {
              type: DataTypes.STRING,
              allowNull: false,
              unique: true,
          },
          firstName: {
              type: DataTypes.STRING,
              allowNull: false,
          },
          lastName: {
              type: DataTypes.STRING,
              allowNull: false,
          },
          phone: {
              type: DataTypes.STRING,
              allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
          },
          stripeAcctId: {
            type: DataTypes.STRING,
          },
          gender: {
            type: DataTypes.STRING,
          },
          dateOfBirth: {
            type: DataTypes.STRING,
          },
          avatar: {
            type: DataTypes.STRING,
          },
          address1: {
            type: DataTypes.STRING,
          },
          address2: {
            type: DataTypes.STRING,
          },
          country: {
            type: DataTypes.STRING,
          },
          state: {
            type: DataTypes.STRING,
          },
          city: {
            type: DataTypes.STRING,
          },
          zipCode: {
            type: DataTypes.STRING,
          },
          roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
      },
      {}
  );
  Admin.associate = function (models) {
      Admin.belongsTo(models.Role, {
          as: 'role',
          foreignKey: 'roleId'
      });
      Admin.hasMany(models.AdminApplication, {
        foreignKey: 'adminId',
        as: 'adminApps'
    });
  };

  return Admin;
};
