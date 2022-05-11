//******************************
//      Daniel Masek            
//      Skoda Auto a.s.           
//******************************


// ----------------------------------------------------
// manage Web requests to SAP OData Rest API
// ----------------------------------------------------
function HttpRequestManager(){
    
    this.getURL = function(SapSystemObj,dataJsonString,target,DocProp,ChangeDocId){
    var url = ""
    switch(target){
    
    case "xcsrf":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata//SAP/ProcessManagement/?sap-client="+SapSystemObj.client;
    break;
    
    case "solutuiondownload":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/BranchContentSet(BranchId='"+SapSystemObj.branchid+"',ScopeId='"+SapSystemObj.scopeid+"',SiteId='"+SapSystemObj.sideid+"',SystemRole='"+SapSystemObj.systemrole+"')/$value?";
    //url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/BranchContentSet(BranchId='"+SapSystemObj.branchid+"',ScopeId='"+SapSystemObj.scopeid+"',SiteId='"+SapSystemObj.sideid+"',SystemRole='"+SapSystemObj.systemrole+"')/$value?$filter=CategoryId eq 'DOCUMENTATION' or CategoryId eq 'TESTCASES' or CategoryId eq 'EXECUTABLES'";
    //url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/BranchContentSet(BranchId='"+SapSystemObj.branchid+"',ScopeId='"+SapSystemObj.scopeid+"',SiteId='"+SapSystemObj.sideid+"',SystemRole='"+SapSystemObj.systemrole+"')/$value?";
    break;
    
    case "testcasedownload":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/BranchContentSet(BranchId='"+SapSystemObj.branchid+"',ScopeId='"+SapSystemObj.scopeid+"',SiteId='"+SapSystemObj.sideid+"',SystemRole='"+SapSystemObj.systemrole+"')/$value?$filter=CategoryId eq 'TESTCASES' or CategoryId eq 'EXECUTABLES'";
    //url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/BranchContentSet(BranchId='"+SapSystemObj.branchid+"',ScopeId='"+SapSystemObj.scopeid+"',SiteId='"+SapSystemObj.sideid+"',SystemRole='"+SapSystemObj.systemrole+"')/$value?$filter=CategoryId eq 'DOCUMENTATION' or CategoryId eq 'TESTCASES' or CategoryId eq 'EXECUTABLES'";
    //url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/BranchContentSet(BranchId='"+SapSystemObj.branchid+"',ScopeId='"+SapSystemObj.scopeid+"',SiteId='"+SapSystemObj.sideid+"',SystemRole='"+SapSystemObj.systemrole+"')/$value?";
    break;
    
    case "branchcontentimportset":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/BranchContentImporterSet(BranchId='"+SapSystemObj.branchid+"',ChangeDocumentId='"+ChangeDocId+"')/$value";
    break;

    case "branchset":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/BranchSet('"+SapSystemObj.branchid+"')?$format=json";
    break;
    
    case "logicalcomponent":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/SolutionSet('"+SapSystemObj.solutionid+"')/LogicalComponentGroupSet?$format=json";
    break;
    
    case "testcase":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/ALM/TM_TS_IF_SRV/TestCaseSet?";
    break;
    
    case "doccreate":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/CreateDocument?BranchId='"+SapSystemObj.branchid+"'&ChangeDocumentId='"+ChangeDocId+"'&DoctypeName='0TD1'&DocTitle='"+DocProp+"'&Language='"+SapSystem.language+"'&DocumentURL=''&$format=json";
    break;
    
    case "docinfodownload":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/DocumentSet(BranchId='"+SapSystemObj.branchid+"',DocumentId='"+DocProp+"')?$format=json";
    break;
    
    case "docupdate":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/DocumentContentImporterSet(BranchId='"+SapSystemObj.branchid+"',DocumentId='"+DocProp+"',ChangeDocumentId='"+ChangeDocId+"')/$value";
    break;
    
    case "docdownload":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/DocumentSet(BranchId='"+SapSystemObj.branchid+"',DocumentId='"+DocProp+"')/$value";
    break;
    
    case "docutypes":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/SolutionSet('"+SapSystemObj.solutionid+"')/DocumentTypeSet?$format=json";
    break;
    
    case "solutionsettings":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/ContentModelSet('1.0')/$value";
    break;
    
    case "processmanagement":
    url = "https://"+SapSystemObj.host+SapSystemObj.port+"/sap/opu/odata/SAP/ProcessManagement/?$format=json";
    break;
    
    }
    return url;
    }

    
    this.doGetRequest = function(SapSystemObj,dataJsonString,target,DocProp,ChangeDocId) {
    var error;
    var responseCode;
    var response;
    var sapurl = this.getURL(SapSystemObj,dataJsonString,target,DocProp,ChangeDocId);
    
    setAllowUntrustedConnection() 
    
    try{
            var url = new java.net.URL(encodeURI(sapurl));
            var urlConnection = url.openConnection();
            urlConnection.setConnectTimeout(55*10000);
            urlConnection.setReadTimeout(55*10000);
            
            urlConnection.setRequestMethod("GET");

            if (SapSystemObj.user != null && SapSystemObj.pwd != null){
                var authorizationHeader = getAuthorizationHeader(SapSystemObj.user, SapSystemObj.pwd);
                urlConnection.addRequestProperty("Authorization", "Basic " + authorizationHeader);
            }
            urlConnection.setRequestProperty("Content-type", "application/json; charset=UTF-8");
            // urlConnection.setRequestProperty("x-csrf-token", "fetch"); // for get it is redundant
            urlConnection.setUseCaches(false);
            urlConnection.connect();       
            
            responseCode = urlConnection.getResponseCode();
            // get Response
            try {
                var inStream = urlConnection.getInputStream(); //InputStream
                response = this.getStringFromInStream(inStream);
                inStream.close();
                
            } catch (e) {
                var errStream = urlConnection.getErrorStream();
                var errMessage = null;
                if (errStream != null) {
                    errMessage = this.getStringFromInStream(errStream);
                    errStream.close();
                }
                error = errMessage;
            }
            
        } catch (e) {
            error = e
            
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
                URL = null;
            }
        }
        return new doResponseWrapper(responseCode, response, error);
    }

// Get x-csfr token and cookies    
    this.doHeaderParams = function(SapSystemObj,dataJsonString) {
        var error;
        var responseHeaders;
        var sapurl = this.getURL(SapSystemObj,"", "xcsrf","","")
        
        // Handle untrusted connections
//        if (g_dialogResult['Untrusted']){
            setAllowUntrustedConnection()            
//        }
        
        try{
            var url = new java.net.URL(encodeURI(sapurl));
            var urlConnection = url.openConnection();
            urlConnection.setConnectTimeout(55*10000);
            urlConnection.setReadTimeout(55*10000);
            
            urlConnection.setRequestMethod("GET");

            if (SapSystemObj.user != null && SapSystemObj.pwd != null){
                var authorizationHeader = getAuthorizationHeader(SapSystemObj.user, SapSystemObj.pwd);
                urlConnection.addRequestProperty("Authorization", "Basic " + authorizationHeader);
            }
            urlConnection.setRequestProperty("Content-type", "application/json; charset=UTF-8");
            urlConnection.setRequestProperty("x-csrf-token", "fetch");
            urlConnection.setUseCaches(false);
            urlConnection.connect();       

           responseHeaders = urlConnection.getHeaderFields();
           
           } catch (e) {
            error = e
           } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }
        return responseHeaders;
    }
    
   this.doPostRequest = function(SapSystemObj,dataJsonString,target,DocProp,ChangeDocId) {
                   
        var error;
        var responseCode;
        var response;
        var sapurl = this.getURL(SapSystemObj,dataJsonString,target,DocProp,ChangeDocId);


      
        
        // Handle untrusted connections TODO
//        if (g_dialogResult['Untrusted'])
//        {
        setAllowUntrustedConnection()            
//        }
        
        try {
            
           var responseHeaders = this.doHeaderParams(SapSystemObj, dataJsonString);
                    
           var scfrtoken = responseHeaders.get("x-csrf-token").toString().replace("[", "").replace("]", "");
           var scookie = responseHeaders.get("set-cookie").toString().replace("[", "").replace("]", "");
           
           var URL = null;
           
            URL = new java.net.URL(encodeURI(sapurl));
            urlConnection = URL.openConnection(); // URLConnection
            urlConnection.setConnectTimeout(55*10000);
            urlConnection.setReadTimeout(55*10000);
            urlConnection.setRequestMethod("POST");
            // Handle CSRF Token for authorization
            if (["doccreate","docupdate"].indexOf(target) !==-1){
                urlConnection.setRequestProperty("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            }else{
                urlConnection.setRequestProperty("Content-type", "application/json; charset=UTF-8");
            }
             urlConnection.setRequestProperty("Cookie",scookie);
            if (SapSystemObj.user != null && SapSystemObj.pwd != null){
                var authorizationHeader = getAuthorizationHeader(SapSystemObj.user, SapSystemObj.pwd);
                urlConnection.addRequestProperty("Authorization", "Basic " + authorizationHeader);
            }
            if (scfrtoken != null){
            urlConnection.addRequestProperty("x-csrf-token", scfrtoken);
            }
            urlConnection.setUseCaches(false);
            urlConnection.setDoOutput(true);
            var outStream = urlConnection.getOutputStream();
            if (["doccreate","docupdate"].indexOf(target) !==-1){
            var outStreamWriter = new java.io.DataOutputStream(outStream);
            outStreamWriter.write(dataJsonString);
            outStreamWriter.flush();
            outStreamWriter.close();
            }else{
            var outStreamWriter = new java.io.OutputStreamWriter(outStream, "UTF-8");
            outStreamWriter.write(dataJsonString);
            outStreamWriter.flush();
            outStreamWriter.close();
            }
            outStream.close();


            
            urlConnection.connect();

            responseCode = urlConnection.getResponseCode();

            // get Response
            try {
                var inStream = urlConnection.getInputStream(); //InputStream
                response = this.getStringFromInStream(inStream);
                inStream.close();
                
            } catch (e) {
                var errStream = urlConnection.getErrorStream();
                var errMessage = null;
                if (errStream != null) {
                    errMessage = this.getStringFromInStream(errStream);
                    errStream.close();
                }
                error = errMessage;
            }
            
        } catch (e) {
            error = e
            
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
                URL = null;
            }
        }
        return new doResponseWrapper(responseCode, response, error);
    }

    this.doPutRequest = function(SapSystemObj,dataJsonString,target,DocProp,ChangeDocId) {
                   
        var error;
        var responseCode;
        var response;
        var sapurl = this.getURL(SapSystemObj,dataJsonString,target,DocProp,ChangeDocId);


      
        
        // Handle untrusted connections TODO
//        if (g_dialogResult['Untrusted'])
//        {
        setAllowUntrustedConnection()            
//        }
        
        try {

           var responseHeaders = this.doHeaderParams(SapSystemObj,dataJsonString);
                    
           var scfrtoken = responseHeaders.get("x-csrf-token").toString().replace("[", "").replace("]", "");
           var scookie = responseHeaders.get("set-cookie").toString().replace("[", "").replace("]", "");
           
           var URL = null;
           
            URL = new java.net.URL(encodeURI(sapurl));
            urlConnection = URL.openConnection(); // URLConnection
            urlConnection.setConnectTimeout(55*10000);
            urlConnection.setReadTimeout(55*10000);
            urlConnection.setRequestMethod("PUT");
            // Handle CSRF Token for authorization
            if (["doccreate","docupdate"].indexOf(target) !==-1){
                urlConnection.setRequestProperty("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            }else{
                urlConnection.setRequestProperty("Content-type", "application/json; charset=UTF-8");
            }
             urlConnection.setRequestProperty("Cookie",scookie);
            if (SapSystemObj.user != null && SapSystemObj.pwd != null){
                var authorizationHeader = getAuthorizationHeader(SapSystemObj.user, SapSystemObj.pwd);
                urlConnection.addRequestProperty("Authorization", "Basic " + authorizationHeader);
            }
            if (scfrtoken != null){
            urlConnection.addRequestProperty("x-csrf-token", scfrtoken);
            }
            urlConnection.setUseCaches(false);
            urlConnection.setDoOutput(true);
            var outStream = urlConnection.getOutputStream();

            if (["doccreate","docupdate"].indexOf(target) !==-1){
            var outStreamWriter = new java.io.DataOutputStream(outStream);
            outStreamWriter.write(dataJsonString);
            outStreamWriter.flush();
            outStreamWriter.close();
            }else{
            var outStreamWriter = new java.io.OutputStreamWriter(outStream, "UTF-8");
            outStreamWriter.write(dataJsonString);
            outStreamWriter.flush();
            outStreamWriter.close();
            }          
            urlConnection.connect();

            responseCode = urlConnection.getResponseCode();

            // get Response
            try {
                var inStream = urlConnection.getInputStream(); //InputStream
                response = this.getStringFromInStream(inStream);
                inStream.close();
                
            } catch (e) {
                var errStream = urlConnection.getErrorStream();
                var errMessage = null;
                if (errStream != null) {
                    errMessage = this.getStringFromInStream(errStream);
                    errStream.close();
                }
                error = errMessage;
            }
            
        } catch (e) {
            error = e
            
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
                URL = null;
            }
        }
        return new doResponseWrapper(responseCode, response, error);
    }
            
   this.getStringFromInStream = function (inStream){
       var sBuffer = new java.lang.StringBuilder();
       var res= new java.io.BufferedReader(new java.io.InputStreamReader(inStream, "UTF-8"));
       var inputLine = res.readLine();
       while (inputLine != null){
            sBuffer.append(inputLine);
            inputLine = res.readLine();
       }
       res.close();
       return sBuffer.toString();

//       return sBuffer;
   }            
            
    
}

// ----------------------------------------------------
// get Crypted Auth param
// ----------------------------------------------------
function getAuthorizationHeader(username, password){
    var authorizationHeader = new java.lang.String(username + ":" +password);
    var encodedAuthorizationHeader = java.util.Base64.getEncoder().encodeToString(authorizationHeader.getBytes());

    return encodedAuthorizationHeader;
}
// ----------------------------------------------------
// get webrequest response
// ----------------------------------------------------
function doResponseWrapper(responseCode, response, error) {
    this.responseCode = responseCode;
    this.response = response;
    this.error = error;    
}

function setAllowUntrustedConnection() {
//    var HttpConnection = new Packages.javax.net.ssl.HttpsURLConnection(url);
 
    var ExtendedTrustManager = new Packages.javax.net.ssl.X509TrustManager({
        accepted: null,
        checkClientTrusted: function(xcs, string) {},
        checkServerTrusted: function(xcs, string) {
            this.accepted = xcs;
        },
        getAcceptedIssuers: function() {
            return this.accepted;
        }
    });
    var TrustManagers = new Array();
    TrustManagers.push(ExtendedTrustManager);

    var HostNameChecker = new javax.net.ssl.HostnameVerifier({
        verify: function(hostname, session) {
            return true;
        }
    })

    try {
        var SecureConnection = new Packages.javax.net.ssl.SSLContext.getInstance("SSL");
        SecureConnection.init(null, TrustManagers, new Packages.java.security.SecureRandom());
        var HostNameConnection = new Packages.javax.net.ssl.HttpsURLConnection.setDefaultSSLSocketFactory(SecureConnection.getSocketFactory());
        var HostNameVerifier = new Packages.javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier(HostNameChecker);
    } catch (e) {
        return e ;
    }
}
