module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
      'Category',
      {
          id: {
              type: DataTypes.UUID,
              primaryKey: true,
              defaultValue: DataTypes.UUIDV4,
              allowNull: false,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          description: {
            type: DataTypes.STRING,
          },
      },
      {}
  );

  Category.associate = function (models) {
    Category.hasMany(models.Product, {
        foreignKey: 'categoryId',
    });
};

  return Category;
};
