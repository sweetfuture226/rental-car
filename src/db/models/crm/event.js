module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define(
        'Event',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
            },
            applicationId: {
                type: DataTypes.UUID,
            },
            resource: {
                type: DataTypes.STRING,
            },
            action: {
                type: DataTypes.STRING,
            },
            meta: {
                type: DataTypes.JSON,
            },
        },
        {}
    );
    Event.associate = function (models) {
        Event.belongsTo(models.User, {
            foreignKey: 'userId'
        });
        Event.belongsTo(models.Application, {
            foreignKey: 'applicationId'
        });
    };

    return Event;
};
