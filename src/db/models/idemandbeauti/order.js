module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
      'Order',
      {
          id: {
              type: DataTypes.UUID,
              primaryKey: true,
              defaultValue: DataTypes.UUIDV4,
              allowNull: false,
          },
          userId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          addressId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          amount: {
            type: DataTypes.DOUBLE,
          },
          quantity: {
            type: DataTypes.INTEGER,
          },
          status: {
            type: DataTypes.STRING, // 'pending', 'processing', 'completed', 'cancelled'
          },
          isPaid: {
            type: DataTypes.BOOLEAN,
          },
          paymentRef: {
            type: DataTypes.STRING,
          },
          meta: {
            type: DataTypes.JSON,
          },
          expectedDeliveryDate: {
            type: DataTypes.DATE,
          },
      },
      {}
  );

  return Order;
};
