 //******************************
//      Daniel Masek            
//      Skoda Auto a.s.
//      Series of functions for handling SAP Process managment OData API           
//******************************

// ----------------------------------------------------
// function for downloading SAP to ARIS
// ----------------------------------------------------
function parsSAPBranchDwnld(GETrequest){
var response = JSON.parse(GETrequest.response);
var result = {};
for (var i = 0; i < response.sections.length; i++) {
    var section = response["sections"][i]["section-id"];
    result[section] = JSON.parse(response["sections"][i]["section-content"])
    }
return result;
}

// ----------------------------------------------------
// function for downloading SAP to ARIS
// ----------------------------------------------------
function getSAPNode(ParsedBrandDwnld,node){
return ParsedBrandDwnld[node];
}