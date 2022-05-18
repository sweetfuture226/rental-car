module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define(
      'Otp',
      {
          id: {
              type: DataTypes.UUID,
              primaryKey: true,
              defaultValue: DataTypes.UUIDV4,
              allowNull: false,
          },
          entityId: {
            type: DataTypes.UUID,
            },
            applicationId: {
                type: DataTypes.UUID,
                },
            entityType: {
                type: DataTypes.STRING,
            },
          otp: {
              type: DataTypes.STRING,
          },
          type: {
            type: DataTypes.JSON,
        },
        expiredAt: {
              type: DataTypes.DATE,
          },
      },
      {}
  );

  return Otp;
};
