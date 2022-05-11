var CENTER_POSITION = 0;
var LEFT_PLACEMENT = 1;
var RIGHT_PLACEMENT = 2;
var INPUT = 100;
var OUTPUT = 101;

//const g_Attr_Frequency_Annual = Constants.AT_FRQ_ANNO; //Frequency, annually - for EVENTS only

function examineSummaryModel(model) {
    /*
    var bq = model.BuildGraph(true);
    var startNodes = model.StartNodeList(); // all start nodes (objOccs) in Model
    var cycles = model.Cycles();
    var branch = 0.0;
    var summary = new Packages.java.util.TreeMap();

    for (var startNodesPosition = 0; startNodesPosition < startNodes.length; startNodesPosition++) {
        var objOcc = startNodes[startNodesPosition];
        if (objOcc.SymbolNum() === SYM_STAT) continue;
        var position = 0;
        var rules = markRules(model, objOcc, position, cycles);
        var startList = examineBranches(model, objOcc, cycles);

        for (var i = 0; i < startList.size(); i++) {
            if (!summary.containsKey(parseFloat(branch))) {
                summary.put(parseFloat(branch), new Packages.java.util.LinkedList());
            }
            addObjectToSummary(summary, branch, false, startList.get(i), null, false);
        }
        var lastBussinesObjects = new Packages.java.util.LinkedList();

        for (var rulePosition = 0; rulePosition < rules.size(); rulePosition++) {
            var rule = rules.get(rulePosition);
            branch++;
            var leafs = rule.leafs;
            var ruleType = rule.type;
            if (ruleType === OUTPUT) {
                lastBussinesObjects.clear();
                for (var i = 0; i < leafs.size(); i++) {
                    var leaf = leafs.get(i);
                    for (var j = leaf.subBranch.size() - 1; j > -1; j--) {
                        if (leaf.subBranch.get(j).ObjDef().TypeNum() === 18) {
                         //   var value = leaf.subBranch.get(j).ObjDef().Attribute(g_Attr_Frequency_Annual, g_nLoc).getValue();
                          //  if (value.length() > 0) {
                                lastBussinesObjects.addLast(leaf.subBranch.get(j));
                                break;
                         //   }
                        }
                    }

                }
            }
            for (var leafPosition = 0; leafPosition < leafs.size(); leafPosition++) {
                var withOutBussinesObject = false;
                var leaf = leafs.get(leafPosition);

                if (ruleType === INPUT) {
                    for (var j = 0; j < leaf.subBranch.size(); j++) {
                        if (leaf.subBranch.getFirst().ObjDef().TypeNum() === 22) {
                            withOutBussinesObject = true;
                        }
                    }
                }
                if (!summary.containsKey(parseFloat(branch))) {
                    summary.put(parseFloat(branch), new Packages.java.util.LinkedList());
                }
                for (var subLeafPosition = 0; subLeafPosition < leaf.subBranch.size(); subLeafPosition++) {
                    addObjectToSummary(summary, branch, false, leaf.subBranch.get(subLeafPosition), null, false);
                }
                if (ruleType === OUTPUT) {
                    addObjectToSummary(summary, branch, false, rule.objOcc, null, true);
                } else if (ruleType === INPUT && withOutBussinesObject === false) {
                    addObjectToSummary(summary, branch, false, rule.objOcc, null, true)
                } else if (ruleType === INPUT && withOutBussinesObject === true) {
                    addObjectToSummary(summary, branch, true, null, lastBussinesObjects, true);
                    addObjectToSummary(summary, branch, false, rule.objOcc, null, true)
                }

                branch++;
            }
        }
    }
    return summary;
  */
    var bq = model.BuildGraph(true);
    var startNodes = model.StartNodeList().filter(function (objOcc){
        return objOcc.SymbolNum() !== SYM_STAT;
    });
    var results = [];

    startNodes.forEach(function(startNode){
       var node = model.DFSGetFirstNode(startNode);
       while(node.IsValid()) {

           if (node.ObjDef().TypeNum() === Constants.OT_FUNC) {
               results.push(node)
           }
           node = model.DFSNextNode();
       }
    });
    return results;

}

function examineSummaryModelUnique(model) {

     var bq = model.BuildGraph(true);
    var startNodes = model.StartNodeList().filter(function (objOcc){
        return objOcc.SymbolNum() !== SYM_STAT;
    });
    var results = [];

    startNodes.forEach(function(startNode){
       var node = model.DFSGetFirstNode(startNode);
       while(node.IsValid()) {

           if (node.ObjDef().TypeNum() === Constants.OT_FUNC) {
               if (!results.some(function(objOcc) {
                   return objOcc.ObjDef().IsEqual(node.ObjDef());
               })) {
                   results.push(node)
               }
           }
           node = model.DFSNextNode();
       }
    });
    return results;
}



function addCycleBranch(successorNodes, length, branchList, model) {
    var list = new Packages.java.util.LinkedList();
    var outEdges = successorNodes[length - 1].OutEdges(Constants.EDGES_STRUCTURE);
    if (outEdges.length > 1) {
        for (var outEdgesPosition = 0; outEdgesPosition < outEdges.length; outEdgesPosition++) {
            if (!isInsideCycle(outEdges[outEdgesPosition].getTarget())) {
                addLeafCorrectly(list, successorNodes[length - 1]);
                var innerSuccessorNodes = model.GetSuccNodes(successorNodes[length - 1]);
                var innerLength = innerSuccessorNodes.length;

                while (innerLength > 0 && innerSuccessorNodes[innerSuccessorNodes.length - 1].ObjDef().TypeNum() !== 50) {
                    if (length === 1) {
                        addLeafCorrectly(list, innerSuccessorNodes[length - 1]);
                        innerSuccessorNodes = model.GetSuccNodes(innerSuccessorNodes[length - 1]);
                        innerLength = innerSuccessorNodes.length;
                    }
                }
            }
        }
    }
    return list;
}

function addLastAll(input, output) {
    if (input.size() > 0) {
        for (var i = 0; i < input.size(); i++) {
            output.addLast(input.get(i));
        }
    }
}

function examineBranches(model, objOcc, cycles) {
    var successorNodes = model.GetSuccNodes(objOcc);
    var length = successorNodes.length;
    var branchList = new Packages.java.util.LinkedList();
    addLeafCorrectly(branchList, objOcc);
    while (length > 0 && successorNodes[successorNodes.length - 1].ObjDef().TypeNum() !== 50) {
        if (length === 1) {
            addLeafCorrectly(branchList, successorNodes[length - 1]);
            successorNodes = model.GetSuccNodes(successorNodes[length - 1]);
            length = successorNodes.length;

        } else if (length === 2) {
            //TODO
            isTooComplex = true;
            break;  //fix
            //  successorNodes = model.GetSuccNodes(successorNodes[length - 1]);
            // length = successorNodes.length;
        }

    }
    var isCycleJurisdiction = isInsideCycle(successorNodes[successorNodes.length - 1], cycles);
    if (isCycleJurisdiction === true) {
        var end = false;
        while (end === false) {
            if (length === 0) break;

            addLeafCorrectly(branchList, successorNodes[length - 1]);
            successorNodes = model.GetSuccNodes(successorNodes[length - 1]);
            length = successorNodes.length;
            if (successorNodes[successorNodes.length - 1].ObjDef().TypeNum() === 50) {
                var cycleBranch = addCycleBranch(successorNodes, length, branchList, model);
                addLastAll(cycleBranch, branchList);

            }
            if (length === 1 && successorNodes[successorNodes.length - 1].ObjDef().TypeNum() === 50) break;
        }
    }
    return branchList;
}

function addLeafCorrectly(list, object) {
    if (!list.contains(object)) {
        list.addLast(object);
    }
}

function addRule(objOcc, counter, leafs, type, list) {
    list.addLast({"objOcc": objOcc, "position": counter, "leafs": leafs, "type": type});
    return counter++;
}

function isInsideCycle(objOcc, cycles) {
    if (objOcc == null || cycles == null) {
        return false;
    }
    for (var outsidePosition = 0; outsidePosition < cycles.length; outsidePosition++) {
        var insideCycle = cycles[outsidePosition];
        for (var insidePosition = 0; insidePosition < insideCycle.length; insidePosition++) {
            var cycleObjOcc = insideCycle[insidePosition];
            if (objOcc.IsEqual(cycleObjOcc)) return true;
        }
    }
    return false;
}

function markRules(model, objOcc, position, cycles) {

    var successorNodes = model.GetSuccNodes(objOcc);
    var length = successorNodes.length;
    var results = new Packages.java.util.LinkedList();
    while (length > 0) {
        if (length == 1) {
            if (successorNodes[length - 1].ObjDef().TypeNum() == 50) {
                var isCycleJurisdiction = isInsideCycle(successorNodes[length - 1], cycles);
                if (isCycleJurisdiction === false) {
                    var outEdges = successorNodes[length - 1].OutEdges(Constants.EDGES_STRUCTURE);
                    var leafs = findLeafPosition(outEdges, successorNodes[length - 1], model, position, cycles);
                    if (outEdges.length > 1) {
                        position = addRule(successorNodes[length - 1], position, leafs, OUTPUT, results);
                    } else if (outEdges.length === 1) {
                        position = addRule(successorNodes[length - 1], position, leafs, INPUT, results);
                    }
                }
            }

            successorNodes = model.GetSuccNodes(successorNodes[length - 1]);
            length = successorNodes.length;

        } else {
            for (var next = 0; next < length; next++) {
                var isCycleJurisdiction = isInsideCycle(successorNodes[next], cycles);
                if (isCycleJurisdiction === false) {
                    var subresults = markRules(model, successorNodes[next], position, cycles);
                    for (var item = 0; item < subresults.size(); item++) {
                        var subItem = subresults.get(item);
                        var found = false;
                        for (var resultPosition = 0; resultPosition < results.size(); resultPosition++) {
                            var resultItem = results.get(resultPosition);
                            if (resultItem.objOcc.equals(subItem.objOcc)) {
                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            results.addLast(subresults.get(item));
                        }
                    }
                }
            }
            break;
        }
    }
    return results;
}

function addObjectToSummary(summary, branch, withoutBusiness, objOcc, lastBusinessObjects, isFirst) {
    var objects = null;
    if (lastBusinessObjects !== null) {
        objects = new Packages.java.util.LinkedList();
        objects = lastBusinessObjects.clone();
    }

    var item = {"withOutBussinesObject": withoutBusiness, "objOcc": objOcc, "lastBussinesObjects": objects};
    if (isFirst === true) summary.get(parseFloat(branch)).addFirst(item);
    else summary.get(parseFloat(branch)).addLast(item);
}


function findLeafPosition(edges, inputObjOcc, model, rulePosition, cycles) {
    var result = new Packages.java.util.LinkedList();
    for (var position = 0; position < edges.length; position++) {
        var edgeTarget = edges[position].getTarget();
        var leaf = clarifyLeafPosition(edgeTarget, inputObjOcc);
        leaf.subBranch = examineBranches(model, edgeTarget, cycles);
        if (leaf.placement === LEFT_PLACEMENT) result.addFirst(leaf);
        else if (leaf.placement === RIGHT_PLACEMENT) result.addLast(leaf);
        else result.addLast(leaf);


    }
    return result;
}

function clarifyLeafPosition(target, source) {
    var targetCenterX = calculateCenter(target.X(), target.Width());
    var targetCenterY = calculateCenter(target.Y(), target.Height());

    var sourceCenterX = calculateCenter(source.X(), source.Width());
    var sourceCenterY = calculateCenter(source.Y(), source.Height());

    var position = calculateObjectPosition(sourceCenterX, sourceCenterY, targetCenterX, targetCenterY);
    var result = {
        "source": target,
        "placement": position
    };

    return result;
}

function calculateCenter(coordinate, dimension) {
    return Math.round((coordinate + (dimension / 2.0)));
}

function calculateObjectPosition(sourceX, sourceY, targetX, targetY) {
    var angle = Math.atan2(targetY - sourceY, targetX - sourceX) * 180.0 / Math.PI;
    var corrected = Math.round(angle);

    if (corrected === 90.0 || corrected === -90.0) return CENTER_POSITION;
    if (corrected < -90.0 || corrected > 90.0) return LEFT_PLACEMENT;
    return RIGHT_PLACEMENT;
}

function examinePath(model, startOcc, endOcc, paths) {
    var isVisited = new Packages.java.util.HashMap();
    var innerPath = new Packages.java.util.ArrayList();
    innerPath.add(startOcc);
    examineInnerPath(model, startOcc, endOcc, isVisited, innerPath, paths);
}

function examineInnerPath(model, startOcc, endOcc, isVisited, currentPath, paths) {

    if (isVisited.containsKey(startOcc)) {
        isVisited.remove(startOcc);
        isVisited.put(startOcc, true);
    } else {
        isVisited.put(startOcc, true);
    }

    if (startOcc.equals(endOcc)) {
        isVisited.replace(startOcc, true, false);
        var count = paths.keySet().size();
        paths.put(count + 1, new Packages.java.util.ArrayList());
        var iterator = currentPath.iterator();
        while (iterator.hasNext()) {
            paths.get(count + 1).add(iterator.next());
        }
        return;

    }
    var outEdges = startOcc.OutEdges(Constants.EDGES_STRUCTURE);
    for (var position = 0; position < outEdges.length; position++) {
        var objOcc = outEdges[position].getTarget();
        if (!isVisited.containsKey(objOcc)) {
            isVisited.put(objOcc, false);
        }
        if (isVisited.get(objOcc) == false) {
            currentPath.add(objOcc);
            examineInnerPath(model, objOcc, endOcc, isVisited, currentPath, paths);
            currentPath.remove(objOcc);
        }
    }
    isVisited.replace(startOcc, true, false);
}
