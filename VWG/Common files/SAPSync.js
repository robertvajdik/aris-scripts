 //******************************
//      Daniel Masek            
//      Skoda Auto a.s.           
//******************************

// ----------------------------------------------------
// manage basic SAP ProcessManagement RestAPI features
// ----------------------------------------------------

function SAPSyncManager(){
// ----------------------------------------------------
// function parsing SAP DATA
// ----------------------------------------------------
this.parseSAPResonse = function (Response, Target) {
    if ((Response.responseCode >= 200) & (Response.responseCode <= 299)) {
        var jsonContent = JSON.parse(Response.response);
        switch (Target) {
            case "testcasedownload": {
                var result = this.getBranchContentObj(jsonContent);
                break;
            }
            case "branchset": {
                var result = jsonContent["d"]["SolutionId"];
                break;
            }
            case "logicalcomponent": {
                var result = this.getLogicalComponenteObj(jsonContent);
                break;
            }
            case "docupload": {
                var result = this.getDocUploadAtributes(jsonContent);
                break;
            }       
            case "docutypes": {
                var result = this.getDocTypeObj(jsonContent);
                break;
            }
            case "solutionsettings": {
                var result = jsonContent["D"];
                break;
            }
        }
        return result;
    } else {
        return null;
    }
}
// ----------------------------------------------------
// function for downloading SAP to ARIS
// ----------------------------------------------------
this.getSAPNode = function (jsonContent, DataNode) {
    switch (DataNode) {
        case "ELEMENT-NAMES": {
            return jsonContent[DataNode]["D"];
            break;
        }
        default: {
            return jsonContent[DataNode];
            break;
        }
    }

}

// ----------------------------------------------------
// function get Branch content
// ----------------------------------------------------
this.getBranchContentObj = function (jsonContent) {
    var result = {};
    for (var i = 0; i < jsonContent.sections.length; i++) {
        var sSectionName = jsonContent["sections"][i]["section-id"];
        result[sSectionName] = JSON.parse(jsonContent["sections"][i]["section-content"])
    }
    return result;
}
// ----------------------------------------------------
// function get SAP logical component object
// ----------------------------------------------------
this.getLogicalComponenteObj = function (jsonContent) {
    var result = new Array();

    for (var i = 0; i < jsonContent["d"]["results"].length; i++) {
        var subresult = {};
        subresult["LogicalComponentGroupId"] = jsonContent["d"]["results"][i]["LogicalComponentGroupId"];
        subresult["LogicalComponentGroupTitle"] = jsonContent["d"]["results"][i]["LogicalComponentGroupTitle"];
        result.push(subresult);
    }
    return result;
}
// ----------------------------------------------------
// function get Document attributes
// ----------------------------------------------------
this.getDocUploadAtributes = function (jsonContent) {
    var result = {};
    result["docurl"] = jsonContent["d"]["__metadata"]["uri"];
    result["docsapid"] = jsonContent["d"]["DocumentId"];
    result["doctitle"] = jsonContent["d"]["DocTitle"];
    return result;
}
// ----------------------------------------------------
// function get SAP document types
// ----------------------------------------------------
this.getDocTypeObj = function (jsonContent) {
    var result = new Array();

    for (var i = 0; i < jsonContent["d"]["results"].length; i++) {
        var subresult = {};
        subresult["DoctypeId"] = jsonContent["d"]["results"][i]["DoctypeId"];
        subresult["DoctypeTitle"] = jsonContent["d"]["results"][i]["DoctypeTitle"];
        result.push(subresult);
    }
    return result;
}
// ----------------------------------------------------
// function get SAP Element name
// ----------------------------------------------------
this.getElementName = function (NodeId, ElementNames) {
    for (var i = 0; i < ElementNames.length; i++) {
        if (ElementNames[i]["occ_id"] == NodeId) {
            return ElementNames[i]["name"];
        }
    }
}
// ----------------------------------------------------
// function get SAP Element type
// ----------------------------------------------------
this.getElementType = function (NodeId, Nodes) {
    for (var i = 0; i < Nodes.length; i++) {
        if (Nodes[i]["occ_id"] == NodeId) {
            return Nodes[i]["obj_type"];
        }
    }
}
// ----------------------------------------------------
// function get SAP Root node
// ----------------------------------------------------
this.getRootNode = function (Nodes) {
    for (var i = 0; i < Nodes.length; i++) {
        if (Nodes[i]["obj_type"] == "ROOT") {
            return Nodes[i]["occ_id"];
        }
    }
}
// ----------------------------------------------------
// function get SAP Reference
// ----------------------------------------------------
this.getReferencedElement = function (NodeId, Nodes) {
    for (var i = 0; i < Nodes.length; i++) {
        if (Nodes[i]["occ_id"] == NodeId) {
            return Nodes[i]["reference"];
        }
    }
}
// ----------------------------------------------------
// function get SAP ExecutibleLibrery
// ----------------------------------------------------
this.getExecutibleLib = function (Nodes) {
    for (var i = 0; i < Nodes.length; i++) {
        if (Nodes[i]["obj_type"] == "LIBEXECROOT") {
            return Nodes[i]["occ_id"];
        }
    }
}
// ----------------------------------------------------
// function get SAP Structural element
// ----------------------------------------------------
this.getStrElement = function (NodeId, StrNode) {
    for (var i = 0; i < StrNode.length; i++) {
        if (StrNode[i]["parent_occ"] == NodeId) return StrNode[i];
    }
}
// ----------------------------------------------------
// function get SAP Element
// ----------------------------------------------------
this.getElement = function (NodeId, Node) {
    for (var i = 0; i < Node.length; i++) {
        if (Node[i]["occ_id"] == NodeId) return Node[i];
    }
}
// ----------------------------------------------------
// function get SAP children
// ----------------------------------------------------
this.getChildren = function (NodeId, StrNode) {
    for (var i = 0; i < StrNode.length; i++) {
        if (StrNode[i]["parent_occ"] == NodeId) return StrNode[i]["children"];
    }
}
// ----------------------------------------------------
// function get SAP Parent
// ----------------------------------------------------
this.getParent = function (NodeId, StrNode) {
    for (var i = 0; i < StrNode.length; i++) {
        for (var ii = 0; i < StrNode[i]["childern"].length; ii++) {
            if (StrNode[i]["children"][ii] == NodeId) return StrNode[i];
        }
    }
}
// ----------------------------------------------------
// function get SAP referent
// ----------------------------------------------------
this.getReference = function (NodeId, Node) {
    for (var i = 0; i < Node.length; i++) {
        if (Node[i]["occ_id"] == NodeId) return Node[i]["reference"];
    }
}
// ----------------------------------------------------
// function get SAP condfirguratuon in JSON file
// ----------------------------------------------------
this.readconfiguration = function (filename, location) {
    try {
        file = Context.getFile(filename, location);
    } catch (e) {
        file = null;
    }
    var StringFile = this.getStringFromStreamFile(file);
    var Configuration = JSON.parse(StringFile);

    return Configuration;
}
// ----------------------------------------------------
// function read file in Commons
// ----------------------------------------------------
this.getStringFromStreamFile = function (file) {
    var filestream = new java.io.ByteArrayInputStream(file);
    var inputstream = java.io.DataInputStream(filestream);
    var bufferreader = java.io.BufferedReader(new java.io.InputStreamReader(inputstream));
    var strline = "";
    var totallines = "";
    while ((strline = bufferreader.readLine()) != null) {
        totallines += strline;
    }
    return totallines;
}

// ----------------------------------------------------
// function for downloading SAP to ARIS
// ----------------------------------------------------
this.doSyncToARIS = function (target,sapsystemobj,jsonstring) {
    var httprequestmanager = new HttpRequestManager();
    var result = httprequestmanager.doGetRequest(sapsystemobj, jsonstring, target);
    return result;
}
    


//--------------------------------------------------
//get SAP IDs
//--------------------------------------------------
this.getSAPIDs = function (tSelectedObjectDef) {
    var result = new Array();
    for (var i = 0; i < tSelectedObjectDef.length; i++) {
        if (tSelectedObjectDef[i].Attribute(AT_SAPID, g_nLoc).IsMaintained()) result.push(tSelectedObjectDef[i].Attribute(AT_SAPID, g_nLoc).getValue());
    }
    return result;
}

// ----------------------------------------------------
// getSAPRootItems
// ----------------------------------------------------
this.getSAPRootItems = function (tStrNode, tNode, tTarget, tSearchItem) {
    switch (tTarget) {
        case "Executive": {
            var tOccIDs = getExecutibleLib(tNode);
        }
        break;
    case "Processes": {
        var tOccIDs = tSearchItem;
    }
    break;

    case "Root": {
        var tOccIDs = getRootNode(tNode);
    }
    break;
    }
    return tOccIDs;
}


this.getNodeScope = function (tNodeIdList, tNode, result) {
    var result = new Array();
    for (var i = 0; i < tNodeIdList.length; i++) {
        for (var ii = 0; ii < tNode.length; ii++) {
            if (tNodeIdList[i].toString() == tNode[ii]["occ_id"].toString()) {
                result.push(tNode[ii]);
            }

        }

    }
    return result;
}


this.getOccScope = function (tNodeId, tNodeStr, result) {
    if (result == null) var result = new Array();
    if (tNodeId != null) result.push(tNodeId);
    for (var i = 0; i < tNodeStr.length; i++) {
        if (tNodeStr[i]["parent_occ"] == tNodeId) {
            if (tNodeStr[i]["children"].length >= 0) {
                for (var e = 0; e < tNodeStr[i]["children"].length; e++) {
                    this.getOccScope(tNodeStr[i]["children"][e], tNodeStr, result);
                }
            }
        }
    }
    return result;
}

//--------------------------------------------------
//get SAP IDs
//--------------------------------------------------
this.getStrNodeScope = function (tNodeId, tNodeStr, tElementNames, tNodes, result) {
    if (result == null) var result = new Array();
    var tNodeStrObj = this.getSAPStrNodeObj(tNodeId, tNodeStr);
    if (tNodeStrObj != null) result.push(tNodeStrObj);
    for (var i = 0; i < tNodeStr.length; i++) {
        if (tNodeStr[i]["parent_occ"] == tNodeId) {
            if (tNodeStr[i]["children"].length >= 0) {
                for (var e = 0; e < tNodeStr[i]["children"].length; e++) {
                    this.getStrNodeScope(tNodeStr[i]["children"][e], tNodeStr, tElementNames, tNodes, result);
                }
            }
        }
    }
    return result;
}

this.getExecutibleLib = function (aNodes) {
    for (var i = 0; i < aNodes.length; i++) {
        if (aNodes[i]["obj_type"] == "LIBEXECROOT") {
            return aNodes[i]["occ_id"];
        }
    }
}

this.getRootNode = function (aNodes) {
    for (var i = 0; i < aNodes.length; i++) {
        if (aNodes[i]["obj_type"] == "ROOT") {
            return aNodes[i]["occ_id"];
        }
    }
}

//--------------------------------------------------
//get SAP IDs
//--------------------------------------------------
this.getSAPStrNodeObj = function (tNodeId, tNodeStr) {
    for (var i = 0; i < tNodeStr.length; i++) {
        if (tNodeStr[i]["parent_occ"].toString() == tNodeId.toString()) {
            return tNodeStr[i];
        }
    }
}

//--------------------------------------------------
//get SAP IDs
//--------------------------------------------------
this.getSAPAttrVal = function (tNodeItem, Key, Lang) {
    for (var i = 0; i < tNodeItem["attributes"].length; i++) {
        if (tNodeItem["attributes"][i]["attr_type"].toString() == Key && tNodeItem["attributes"][i]["lang"] == Lang) {
            return tNodeItem["attributes"][i]["values"];
        }
    }
}

}

