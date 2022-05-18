module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define(
        'Transaction',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            amount: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
            },
            applicationId: {
                type: DataTypes.UUID,
            },
            status: {
                type: DataTypes.STRING,
            },
            transactionReference: {
                type: DataTypes.STRING,
            },
            narration: {
                type: DataTypes.STRING,
            },
            meta: {
                type: DataTypes.JSON,
            },
        },
        {}
    );
    Transaction.associate = function (models) {
        Transaction.belongsTo(models.User, {
            foreignKey: 'userId'
        });
        Transaction.belongsTo(models.Application, {
            foreignKey: 'applicationId'
        });
    };

    return Transaction;
};
