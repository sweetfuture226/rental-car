'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserCampaign = sequelize.define(
    'UserCampaign',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      campaignId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: true,
      }
    },
    {}
  );
  UserCampaign.associate = function (models) {
      UserCampaign.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      UserCampaign.belongsTo(models.Campaign, {
        foreignKey: 'campaignId',
      });
  };

  return UserCampaign;
};