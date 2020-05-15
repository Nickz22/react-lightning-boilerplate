public Inherited sharing class TaskSelector {
    
    public static List<Task> getTasksByIds(List<Id> taskIds){
        return [SELECT Id, Status FROM Task WHERE Id IN:taskIds];
    }
  
    /**
* @author - Neha Garg
* @description - return count of participantActions who answered call
* @param List<Sequence_Action__c> participantActionIds - participantactionIds for which we are getting Task.
* @return Integer - return count of participantActions who answered call
*/
    public  static Integer getCallAnsweredTaskCountForParticipantActions(Set<Id> participantActionIds){
        return	[Select count() from Task Where ringdna__Call_Connected__c=true AND Sequence_Action__c in : participantActionIds];
    } 
    
    /**
* @author - Neha Garg
* @description - return List<Task> for Participant Actions
* @param List<Sequence_Action__c> participantActionIds - participantactionIds for which we are getting Task.
* @return List<Task> - This list contains each record has Task for Participant Actions.
*/
    public  static List<Task> getTaskForParticipantActions(List<Sequence_Action__c> participantActionIds){
        return	[Select Id, Sequence_Action__c, ringdna__Call_Connected__c, ringdna__Call_Disposition__c, Status from Task  Where Sequence_Action__c in : participantActionIds Limit :SequenceEngineHelper.getAvailableQueryRowsLimit()];
    } 
}