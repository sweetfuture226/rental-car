module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define(
      'Document',
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
        },
        adminId: {
          type: DataTypes.UUID,
        },
        documentUrl: {
          type: DataTypes.STRING,
        },
        key: {
          type: DataTypes.STRING,
        },
        uploadId: {
          type: DataTypes.STRING,
        },
        fileName: {
          type: DataTypes.STRING,
        },
        meta: {
          type: DataTypes.JSON,
        },
        status: {
          type: DataTypes.STRING,
        },
        progress: {
          type: DataTypes.INTEGER,
        },
        deliveryMethod: {
          type: DataTypes.STRING,
        },
        type: {
          type: DataTypes.STRING,
        },
      },
      {}
  );
  Document.associate = function (models) {
      Document.belongsTo(models.Admin, {
          foreignKey: 'adminId'
      });
  };

  return Document;
};
