module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define(
    'Campaign',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      ownerId: {
        type: DataTypes.UUID,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
      },
      slug: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      paidType: {
        type: DataTypes.STRING,
      },
      banner: {
        type: DataTypes.STRING,
      },
      campaignDate: {
        type: DataTypes.STRING,
      },
      redirectUrl: {
        type: DataTypes.STRING,
      },
      facebookHandle: {
        type: DataTypes.STRING,
      },
      tiktokHandle: {
        type: DataTypes.STRING,
      },
      instagramHandle: {
        type: DataTypes.STRING,
      },
      twitterHandle: {
        type: DataTypes.STRING,
      },
      prices: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      formData: {
        type: DataTypes.JSON,
      },
    },
    {},
  );
  Campaign.associate = function (models) {
    Campaign.hasMany(models.UserCampaign, {
      foreignKey: 'campaignId',
    });
    Campaign.hasOne(models.EmailSmsRecord, {
      foreignKey: 'campaignId',
    });
  };

  return Campaign;
};
