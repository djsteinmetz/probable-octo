module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
  });

  Item.associate = function(models) {
    Item.belongsTo(models.User);
    Item.belongsTo(models.Collection);
  };

  return Item;
};
