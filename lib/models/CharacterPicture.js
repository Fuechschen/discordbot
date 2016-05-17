module.exports = function (sequelize, Sequelize) {
    return sequelize.define('CharacterPicture', {
        id: {type: Sequelize.INTEGER.UNSIGNED, unique: true, autoIncrement: true, primaryKey: true},
        link: {type: Sequelize.STRING(191), allowNull: false},
        source: {type: Sequelize.STRING(191), allowNull: false}
    }, {
        underscored: true,
        tableName: 'characterpictures'
    })
};