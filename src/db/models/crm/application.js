module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define(
        'Application',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
            },
            description: {
                type: DataTypes.STRING,
            },
            slug: {
                type: DataTypes.STRING,
            },
        },
        {}
    );
    Application.associate = function (models) {
        Application.hasMany(models.UserApplication, {
            foreignKey: 'applicationId',
        });
        Application.hasMany(models.Transaction, {
            foreignKey: 'applicationId',
        });
        Application.hasMany(models.Event, {
            foreignKey: 'applicationId',
        });
        Application.hasMany(models.AdminApplication, {
            foreignKey: 'applicationId',
            as: 'adminApps'
        });
    };

    return Application;
};
