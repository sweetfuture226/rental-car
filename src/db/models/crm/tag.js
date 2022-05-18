module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
      'Tag',
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
              unique: true,
          },
          meta: {
                type: DataTypes.JSON,
          },
          createdBy: {
            type: DataTypes.UUID,
        },
         updatedBy: {
            type: DataTypes.UUID,
          }
      },
      {}
  );
  Tag.associate = function (models) {
      Tag.hasMany(models.TagUser, {
          foreignKey: 'tagId'
      });
  };

  return Tag;
};
