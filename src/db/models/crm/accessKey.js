module.exports = (sequelize, DataTypes) => {
    const AccessKey = sequelize.define(
        'AccessKey',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            entityId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            entityType: {
                type: DataTypes.STRING,
            },
            key: {
                type: DataTypes.STRING,
                unique: true,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
            },
        },
        {}
    );

    return AccessKey;
};
