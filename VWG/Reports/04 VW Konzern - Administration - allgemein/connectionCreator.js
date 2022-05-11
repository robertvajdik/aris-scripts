const FRAUNHOFER_RELATION_DEFINITION_FIELD = 0;
const FRAUNHOFER_RELATION_DESCRIPTION_FIELD = 5;
const FRAUNHOFER_RELATION_REMARK_FIELD = 6;


function connectionCreator(relations) {

    this.relations = relations;

    this.getConnections = function () {


        if (this.relations === null) return new Packages.java.util.LinkedHashMap();
        var hashMap = new Packages.java.util.LinkedHashMap(this.relations.size());
        var iterator = this.relations.iterator();
        iterator.next(); // Skip first lane;
        while (iterator.hasNext()) {
            var relation = iterator.next();

            var definition = relation.get(FRAUNHOFER_RELATION_DEFINITION_FIELD).replace("\"","");
            var description = relation.get(FRAUNHOFER_RELATION_DESCRIPTION_FIELD).replace("\"","");
            var remark = relation.get(FRAUNHOFER_RELATION_REMARK_FIELD).replace("\"","");

            hashMap.put(definition, [description, remark]);
        }

        return hashMap;

    }
}