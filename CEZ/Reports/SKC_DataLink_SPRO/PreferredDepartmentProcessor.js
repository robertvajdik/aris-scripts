function PreferredDepartmentProcessor(roles,locale) {
    this.roles = roles;
    this.locale = locale;
}

PreferredDepartmentProcessor.OLD_NUMBER_OF_POSITION = 0;
PreferredDepartmentProcessor.NEW_NUMBER_OF_POSITION = 1;
PreferredDepartmentProcessor.COMMA_DELIMITER = ";";

PreferredDepartmentProcessor.prototype.process = function (content) {

    var object = this.createDepartments(content);
    return this.insert(object);
}

PreferredDepartmentProcessor.prototype.createDepartments = function (content) {

    return content.map(function (record) {

        var oldDepartment = record[PreferredDepartmentProcessor.OLD_NUMBER_OF_POSITION].substr(0, record[PreferredDepartmentProcessor.OLD_NUMBER_OF_POSITION].indexOf(".")).trim();
        var newDepartment = record[PreferredDepartmentProcessor.NEW_NUMBER_OF_POSITION].substr(0, record[PreferredDepartmentProcessor.NEW_NUMBER_OF_POSITION].indexOf(".")).trim();
        return {oldDepartment: oldDepartment, newDepartment: newDepartment};

    }).reduce(function (groups, record) {
        const val = record.oldDepartment;
        groups[val] = groups[val] || []
        groups[val].push(record.newDepartment)
        return groups
    }, {});
}

PreferredDepartmentProcessor.prototype.insert = function(object) {

    var those = this;
    var affectedRoles = [];
    Object.keys(object).forEach(function (key) {

        var addition = object[key].filter(function (value, index) {
            return object[key].indexOf(value) === index;
        });

        var filtered = those.roles.filter(function (role) {
            var preferredDepartments = role.Attribute(ORG_AT_PREFERRED,those.locale).getValue();
            return preferredDepartments.split(PreferredDepartmentProcessor.COMMA_DELIMITER).some(function (department) {
                return department.indexOf(key) !== -1;
            });
        });

        filtered.forEach(function (role) {
            var preferredDepartments = role.Attribute(ORG_AT_PREFERRED, those.locale).getValue();
            var array = preferredDepartments.split(PreferredDepartmentProcessor.COMMA_DELIMITER);
            var difference = addition.filter(function (item) {
                return !array.some(function (record) {
                    return record.toLowerCase().localeCompare(item.toLowerCase()) === 0;
                });
            });

            if (difference.length > 0) {
                affectedRoles.push([role,difference]);
                var newValue = array.concat(difference).join(PreferredDepartmentProcessor.COMMA_DELIMITER);
                role.Attribute(ORG_AT_PREFERRED, those.locale).setValue(newValue);
            }

        });
    });
    return affectedRoles;
}