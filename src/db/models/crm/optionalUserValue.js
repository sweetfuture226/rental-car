module.exports = (sequelize, DataTypes) => {
  const OptionalUserValue = sequelize.define(
    'OptionalUserValue',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      key: {
        type: DataTypes.STRING,
      },
      value: {
        type: DataTypes.STRING,
      },
    },
    {},
  );
  OptionalUserValue.associate = function (models) {
    OptionalUserValue.belongsTo(models.User, {
      foreignKey: 'phone',
      targetKey: 'phone',
    });
  };

  return OptionalUserValue;
};
