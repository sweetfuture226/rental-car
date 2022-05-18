module.exports = (sequelize, DataTypes) => {
  const UIContent = sequelize.define(
      'UIContent',
      {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        resource: {
            type: DataTypes.STRING,
        },
        page: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
        },
        content: {
            type: DataTypes.JSON,
        },
        meta: {
            type: DataTypes.JSON,
        }
      },
      {}
  );

  return UIContent;
};
