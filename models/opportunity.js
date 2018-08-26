module.exports = function(sequelize, DataTypes) {
  var Opportunity = sequelize.define('Opportunity', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    deadline: DataTypes.DATE,
    selectedCollection: DataTypes.INTEGER
  });

  Opportunity.associate = function(models) {
    Opportunity.belongsTo(models.User);
    Opportunity.hasMany(models.Collection);
  };

  return Opportunity;
};