'use strict';

module.exports = (sequelize, DataTypes) => {
  const TagUser = sequelize.define(
    'TagUser',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tagId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: true,
      }
    },
    {}
  );
  TagUser.associate = function (models) {
      TagUser.belongsTo(models.User, {
        foreignKey: 'phone',
        targetKey: 'phone',
      });
      TagUser.belongsTo(models.Campaign, {
        foreignKey: 'tagId',
      });
  };

  return TagUser;
};