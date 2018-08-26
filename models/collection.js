module.exports = function(sequelize, DataTypes) {
  var Collection = sequelize.define('Collection', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    selected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Collection.associate = function(models) {
    Collection.belongsTo(models.User);
    Collection.hasMany(models.Item);
    // Collection.hasOne(models.Opportunity);
  };

  return Collection;
};
