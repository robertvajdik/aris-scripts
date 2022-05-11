const FRAUNHOFER_LANE_NAME_FIELD = 0;

const FRAUNHOFER_ACTIVITY_COUNTER_FIELD = 1;
const FRAUNHOFER_ACTIVITY_NAME_FIELD = 2;
const FRAUNHOFER_ACTIVITY_PROCEDURE_FIELD = 9;

const FRAUNHOFER_ROLE_FIELD = 3;
const FRAUNHOFER_IT_SYSTEM_FIELD = 4;

const FRAUNHOFER_DATA_SOURCE_NAME_FIELD = 6;
const FRAUNHOFER_DATA_SOURCE_SOURCE_FIELD = 5;
const FRAUNHOFER_DATA_SOURCE_DRAIN_FIELD = 7;

const FRAUNHOFER_LOCATION_FIELD = 8;



function laneCreator(definitions) {

    this.definitions = definitions;

    this.getLaneSet = function () {
        if (this.definitions === null) return new Packages.java.util.LinkedHashMap();
        var hashMap = new Packages.java.util.LinkedHashMap(this.definitions.size());
        var iterator = this.definitions.iterator();
        iterator.next(); // Skip first lane;
        while (iterator.hasNext()) {

            var definition = iterator.next();
            var laneName = definition.get(FRAUNHOFER_LANE_NAME_FIELD);

            var activity = this.createProcessStep(definition);
            var role = definition.get(FRAUNHOFER_ROLE_FIELD).replace("\"","");
            var itSystem = definition.get(FRAUNHOFER_IT_SYSTEM_FIELD).replace("\"","");
            var dataSource = this.createDataSource(definition);
            var location = definition.get(FRAUNHOFER_LOCATION_FIELD).replace("\"","");

            if (!hashMap.containsKey(laneName)) {
                hashMap.put(laneName, new Packages.java.util.LinkedList());
            }
            hashMap.get(laneName).addLast([activity,role,itSystem,dataSource,location]);
           


        }
        return hashMap;
    };

    this.createProcessStep = function (definition) {

        var name = definition.get(FRAUNHOFER_ACTIVITY_NAME_FIELD).replace("\"","");
        var step = definition.get(FRAUNHOFER_ACTIVITY_COUNTER_FIELD).replace("\"","");
        var procedure = definition.get(FRAUNHOFER_ACTIVITY_PROCEDURE_FIELD).replace("\"","");

        return {
            name: name,
            step: step,
            procedure: procedure
        };

    };

    this.createDataSource = function (definition) {

        var name = definition.get(FRAUNHOFER_DATA_SOURCE_NAME_FIELD).replace("\"","");
        var source = definition.get(FRAUNHOFER_DATA_SOURCE_SOURCE_FIELD).replace("\"","");
        var drain = definition.get(FRAUNHOFER_DATA_SOURCE_DRAIN_FIELD).replace("\"","");

        return {
            name:name,
            dataSource : source,
            dataDrain : drain
        };

    }
}