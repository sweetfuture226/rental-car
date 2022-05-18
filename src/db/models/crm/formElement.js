module.exports = (sequelize, DataTypes) => {
  const FormElement = sequelize.define(
    'FormElement',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      meta: {
        type: DataTypes.JSON,
      },
      status: {
        type: DataTypes.STRING,
      },
    },
    {},
  );

  return FormElement;
};
