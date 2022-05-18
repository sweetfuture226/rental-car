module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
      'Payment',
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
          campaignId: {
            type: DataTypes.UUID,
          },
          paymentType: {
            type: DataTypes.STRING,
          },
          status: {
            type: DataTypes.STRING,
          },
          paymentId: {
            type: DataTypes.STRING,
          },
          receiptUrl: {
            type: DataTypes.STRING,
          },
          amount: {
            type: DataTypes.DOUBLE,
          },
          processing: {
            type: DataTypes.STRING,
          },
          currency: {
            type: DataTypes.STRING,
          },
          meta: {
            type: DataTypes.JSON,
          },
          splitStatus: {
            type: DataTypes.BOOLEAN,
          },
      },
      {}
  );

  return Payment;
};
