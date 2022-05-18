module.exports = (sequelize, DataTypes) => {
  const StoreOrder = sequelize.define(
      'StoreOrder',
      {
          id: {
              type: DataTypes.UUID,
              primaryKey: true,
              defaultValue: DataTypes.UUIDV4,
              allowNull: false,
          },
          orderId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          storeId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          productId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          unitAmount: {
            type: DataTypes.DOUBLE,
          },
          totalAmount: {
            type: DataTypes.DOUBLE,
          },
          quantity: {
            type: DataTypes.INTEGER,
          },
          status: {
            type: DataTypes.STRING, // 'pending', 'processing', 'completed', 'cancelled', 'in-transit', 'delivered', 'returned', 'refunded', 'failed'
          },
          meta: {
            type: DataTypes.JSON,
          },
          expectedDeliveryDate: {
            type: DataTypes.DATE,
          },
          isSettled: {
            type: DataTypes.BOOLEAN,
          },
      },
      {}
  );

  return StoreOrder;
};
