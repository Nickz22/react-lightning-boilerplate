/**
*@Author Subhash Chander
*@Description Service class to get sequence analytics data.
*/
public class SequenceAnalyticsServices {
    /**
    * @author - Mrityunjaya
    * @description - return sequence action grid data for sequence analytics.
    * @param List<Id> - list of sequence ids for which grid data will be returned.
    * @return List<SequenceAnalyticsGridWrapper> - List of with SequenceAnalyticsGridWrapper class.
    */
    public static List<SequenceAnalyticsGridWrapper> getSequenceActionGridData(List<Id> sequenceIds) {
        List<SequenceAnalyticsGridWrapper> sequenceAnalyticsGridWrapperList = new List<SequenceAnalyticsGridWrapper>();
        
        List<CadenceAction__c> sequenceActions = SequenceActionSelector.selectBySequenceIds(sequenceIds);
        map<Id, CadenceAction__c> sequenceActionIdToSequenceActionMap = new Map<Id, CadenceAction__c>(sequenceActions);
        Set<Id> sequenceActionIdSet = sequenceActionIdToSequenceActionMap.keySet();
        List<Sequence_Action__c> participantActions = ParticipantActionSelector.getRecordsByCadenceActionIds(sequenceActionIdSet);
        map<Id, List<Sequence_Action__c>> sequenceActionIdToParticipantActionMap = getSequenceActionIdToParticipantActionMap(participantActions);      
        List<Task> taskListForParticipantActions = TaskSelector.getTaskForParticipantActions(participantActions);
        Map<Id, Task> ParticipantActionIdToTaskMap = getParticipantActionIdToTaskMap(taskListForParticipantActions);        
        prepareSequenceAnalyticsGridWrapperList(sequenceActions, sequenceActionIdToParticipantActionMap, ParticipantActionIdToTaskMap, sequenceAnalyticsGridWrapperList);
        return sequenceAnalyticsGridWrapperList;
    }
    
    /**
    * @author - Mrityunjaya
    * @description - prepare and add sequence action grid data for sequence analytics.
    * @param List<CadenceAction__c> - list of all actions of sequence.
    * @param List<Sequence_Action__c>> - list of all participant actions of the sequence.
    * @param Map<Id, Task> - map of participant action's id and the task related to it to fetch the call connected status.
    * @param List<SequenceAnalyticsGridWrapper> - List of with SequenceAnalyticsGridWrapper class.
    */
    private static void prepareSequenceAnalyticsGridWrapperList(List<CadenceAction__c> sequenceActions, map<Id, List<Sequence_Action__c>> sequenceActionIdToParticipantActionMap, Map<Id, Task> ParticipantActionIdToTaskMap, List<SequenceAnalyticsGridWrapper> sequenceAnalyticsGridWrapperList)
    {        
        for(CadenceAction__c sequenceAction : sequenceActions)
        {
            SequenceAnalyticsGridWrapper sequenceAnalyticsGridRecord = new SequenceAnalyticsGridWrapper();
            
            sequenceAnalyticsGridRecord.actionName = sequenceAction.name;           
            sequenceAnalyticsGridRecord.actionType = sequenceAction.Action_Id__r.Type__c;   
            sequenceAnalyticsGridRecord.actionActivationType = sequenceAction.Action_Id__r.Activation_Type__c;
            
            List<Sequence_Action__c> participantActionsList = sequenceActionIdToParticipantActionMap.get(sequenceAction.Id);
            if(participantActionsList != null && !participantActionsList.isEmpty() )
            {    
                calculateParticipantActionGridData(participantActionsList, sequenceAction, ParticipantActionIdToTaskMap, sequenceAnalyticsGridRecord);
            } else {
                sequenceAnalyticsGridRecord.skipped  = '0';
                sequenceAnalyticsGridRecord.completed  = '0';
                sequenceAnalyticsGridRecord.outCome = '--';
            }
            sequenceAnalyticsGridWrapperList.add(sequenceAnalyticsGridRecord);
        }        
    }
    
    /**
    * @author - Mrityunjaya
    * @description - calculate and set values of skipped, completed and outcome columns of sequence action grid of sequence report's tab.
    * @param List<Sequence_Action__c>>- list of all participant actions of the sequence.
    * @param CadenceAction__c- sequence action for values are being calculated
    * @param Map<Id, Task>- map of participant action's id and the task related to it to fetch the call connected status.
    * @param SequenceAnalyticsGridWrapper- object of with SequenceAnalyticsGridWrapper class.
    */
    private static void calculateParticipantActionGridData(List<Sequence_Action__c> participantActionsList, CadenceAction__c sequenceAction, Map<Id, Task> ParticipantActionIdToTaskMap, SequenceAnalyticsGridWrapper sequenceAnalyticsGridRecord)
    {
        Integer skippedActions = 0, completedActions = 0, totalEmailOpened = 0, totalCallConnected = 0; 
        for(Sequence_Action__c participantAction : participantActionsList)
        {
            if(sequenceAction.Action_Id__r.Type__c == CadenceConstants.ACTION_TYPE_EMAIL){                
                if((sequenceAnalyticsGridRecord.ActionActivationType == CadenceConstants.PARTICIPANT_ACTIVATION_MANUAL && participantAction.isDeferred__c) || (sequenceAnalyticsGridRecord.ActionActivationType == CadenceConstants.PARTICIPANT_ACTIVATION_AUTOMATIC && participantAction.IsConvertedToManualAction__c)) {
                    skippedActions++;                                    
                } else if(participantAction.isActionPerformed__c || participantAction.IsActionInitiated__c) {                    
                    completedActions++;                 
                }
                
                if(participantAction.Email_Opened__c)
                    totalEmailOpened++;
                
            } else {
                if(participantAction.isDeferred__c ) {
                    skippedActions++;
                } else if(participantAction.isActionPerformed__c) {
                    completedActions++;
                }
                
                if(sequenceAction.Action_Id__r.Type__c == CadenceConstants.ACTION_TYPE_CALL || sequenceAction.Action_Id__r.Type__c == CadenceConstants.ACTION_TYPE_CALL_VOICEMAIL){
                    
                    Task taskOfParticipantAction = ParticipantActionIdToTaskMap != null ? ParticipantActionIdToTaskMap.get(participantAction.id) : null;
                    if(taskOfParticipantAction != null && taskOfParticipantAction.ringdna__Call_Connected__c)
                    {
                        totalCallConnected++;
                    }
                }
            }
        }        
        
        Integer totalParticipantActions = participantActionsList.size(); 
        sequenceAnalyticsGridRecord.skipped  = String.valueOf((((Decimal.valueof(skippedActions) / totalParticipantActions) * 100).setScale(0))) + '%';
        sequenceAnalyticsGridRecord.completed  = String.valueOf((((Decimal.valueof(completedActions) / totalParticipantActions) * 100).setScale(0))) + '%';
        
        if(sequenceAction.Action_Id__r.Type__c == CadenceConstants.ACTION_TYPE_EMAIL){
            sequenceAnalyticsGridRecord.outCome  = String.valueOf((((Decimal.valueof(totalEmailOpened) / totalParticipantActions) * 100).setScale(0))) + '% Opened';
        }
        else if(sequenceAction.Action_Id__r.Type__c == CadenceConstants.ACTION_TYPE_CALL || sequenceAction.Action_Id__r.Type__c == CadenceConstants.ACTION_TYPE_CALL_VOICEMAIL){
            sequenceAnalyticsGridRecord.outCome  = String.valueOf((((Decimal.valueof(totalCallConnected) / totalParticipantActions) * 100).setScale(0))) + '% Connected';
        } else {
            sequenceAnalyticsGridRecord.outCome  = '--';
        }
                
        if(sequenceAction.Action_Id__r.Type__c == CadenceConstants.ACTION_TYPE_EMAIL && sequenceAnalyticsGridRecord.ActionActivationType != CadenceConstants.PARTICIPANT_ACTIVATION_MANUAL){
            sequenceAnalyticsGridRecord.skipped = '--';
        }
    }
    
    /**
    * @author - Mrityunjaya
    * @description - return map of sequenceActionId to participant action.
    * @param List<Sequence_Action__c> - list of participant action.
    * @return  map<Id, List<Sequence_Action__c>> - map of sequenceActionId to participant action.
    */
    private static map<Id, List<Sequence_Action__c>> getSequenceActionIdToParticipantActionMap(List<Sequence_Action__c> participantActions)
    {
        map<Id, List<Sequence_Action__c>> sequenceActionIdToParticipantActionMap = new map<Id, List<Sequence_Action__c>>();
        for(Sequence_Action__c sequenceAction : participantActions)
        {            
            if(sequenceActionIdToParticipantActionMap.containsKey(sequenceAction.CadenceAction_Id__c) && sequenceActionIdToParticipantActionMap.get(sequenceAction.CadenceAction_Id__c) != null) {
                List<Sequence_Action__c> participantActionList = sequenceActionIdToParticipantActionMap.get(sequenceAction.CadenceAction_Id__c);
                participantActionList.add(sequenceAction);
                sequenceActionIdToParticipantActionMap.put(sequenceAction.CadenceAction_Id__c, participantActionList); 
            }   
            else {
                sequenceActionIdToParticipantActionMap.put(sequenceAction.CadenceAction_Id__c, new List<Sequence_Action__c> {sequenceAction});
            }
        }
        return sequenceActionIdToParticipantActionMap;
    }
    
    /**
    * @author - Mrityunjaya
    * @description - returns map of ParticipantActionId to it's Task.
    * @param List<Task> - list of task.
    * @return Map<Id, Task> - map of ParticipantActionId to it's Task.
    */
    private static Map<Id, Task> getParticipantActionIdToTaskMap(List<Task> taskListForParticipantActions)
    {
        Map<Id, Task> ParticipantActionIdToTaskMap = new Map<Id, Task>();
        for(Task task : taskListForParticipantActions){
            if( ParticipantActionIdToTaskMap.containsKey(task.Sequence_Action__c) == false ){
                ParticipantActionIdToTaskMap.put(task.Sequence_Action__c, task);
            }
        }
        return ParticipantActionIdToTaskMap;
    }
}