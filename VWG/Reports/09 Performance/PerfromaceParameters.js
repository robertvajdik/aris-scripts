/**
 * ARIS 9.8 Script module PerformaceTest parametrs
 * @author: Robert Vajdik
 * @date: 2015-07-15
 * @version 1.0 (2015-07-15| Robert Vajdik) - initial parameters
 */

function PerformaceParameters() {
    this.getPerformaceParameters = function() {
        return {
        // General Parameters
        "LogMode"           : "append", // LogMode: none, append, new
        "LogfilePath"       : "D://SoftwareAG//",
        "LogfileName"       : "PerformaceTestLog.txt",
        
        "TestParameter"       : "aaa",
               
        };
    }
}
