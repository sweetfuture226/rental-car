module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
      'Address',
      {
          id: {
              type: DataTypes.UUID,
              primaryKey: true,
              defaultValue: DataTypes.UUIDV4,
              allowNull: false,
          },
          userId: {
              type: DataTypes.UUID,
              allowNull: true,
          },
          applicationId: {
              type: DataTypes.UUID,
              allowNull: true,
          },
          address: {
              type: DataTypes.STRING,
          },
          city: {
              type: DataTypes.STRING,
          },
          state: {
              type: DataTypes.STRING,
          },
          country: {
              type: DataTypes.STRING,
          },
          postalCode: {
              type: DataTypes.STRING,
          },
          type: {
            type: DataTypes.STRING,
        },
      },
      {}
  );

  return Address;
};