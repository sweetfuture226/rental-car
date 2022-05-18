module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            avatar: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            firstName: {
                type: DataTypes.STRING,
            },
            lastName: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            },
            city: {
                type: DataTypes.STRING,
            },
            age: {
                type: DataTypes.INTEGER,
            },
            dateOfBirth: {
                type: DataTypes.STRING,
            },
            instagramId: {
                type: DataTypes.STRING,
            },
            socialMediaHandle: {
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
            gender: {
                type: DataTypes.STRING,
            },
            address2: {
                type: DataTypes.STRING,
            },
            address3: {
                type: DataTypes.STRING,
            },
            facebookHandle: {
                type: DataTypes.STRING,
            },
           tiktokHandle: {
                type: DataTypes.STRING,
            },
            twitterHandle: {
                type: DataTypes.STRING,
            },
            uploadedBy: {
                type: DataTypes.STRING,
            },
        },
        {}
    );
    User.associate = function (models) {
        User.hasMany(models.UserApplication, {
            foreignKey: 'userId'
        });
        User.hasMany(models.UserCampaign, {
            foreignKey: 'userId'
        });
        User.hasMany(models.OptionalUserValue, {
            foreignKey: 'phone',
            sourceKey: 'phone'
        });
        User.hasMany(models.TagUser, {
            foreignKey: 'phone',
            sourceKey: 'phone'
        });
        User.hasMany(models.Transaction, {
            foreignKey: 'userId'
        });
        User.hasMany(models.Event, {
            foreignKey: 'userId'
        });
    };

    return User;
};
