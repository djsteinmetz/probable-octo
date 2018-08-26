module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    permissions: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Item);
    User.hasMany(models.Collection);
  };

  return User;
};
