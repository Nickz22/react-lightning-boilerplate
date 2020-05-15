/**
 * @author - Nicholas Zozaya
 * @description - Services for Sequence Action domain, should always return work to caller
 */
public Inherited sharing class ParticipantActionService {
    private static Boolean isCurrentAction = false;
    /**
    * @author - Neha Garg
    * @description - return List<ParticipantActionsOverviewWrapper> with changes specified in getParticipantActionList
    * @param Id participantId - participantId for which we are getting Participant Actions.
    * @return List<ParticipantActionsOverviewWrapper> - This list each record has Participant Actions.
    */
    public static List<ParticipantActionsOverviewWrapper> getParticipantActionOverviewList(Id participantId){
        List<ParticipantActionsOverviewWrapper> participantActionsOverviewWrapperList = new List<ParticipantActionsOverviewWrapper>();
        if(String.isBlank(participantId)){
            return participantActionsOverviewWrapperList;
        }
        String sObjName = CadenceUtil.getsObjectTypeById(String.valueOf(participantId));
        ParticipantActionsOverviewWrapper participantActionOverviewRecord = new ParticipantActionsOverviewWrapper();
        List<Sequence_Action__c> participantActions = ParticipantActionSelector.getParticipantActionsbyObjectType(participantId,sObjName); 
        if(!participantActions.isEmpty()){
            List<Task> listOftask = TaskSelector.getTaskForParticipantActions(participantActions);
            Map<Id,Task> sequenceParticipantIdMap = new Map<Id,Task>();
            for(Task tasks : listOftask){
                if(!sequenceParticipantIdMap.containsKey(tasks.Sequence_Action__c)){
                    sequenceParticipantIdMap.put(tasks.Sequence_Action__c, tasks);
                }
            }
            for(Sequence_Action__c sequenceAction : participantActions){
                participantActionOverviewRecord = getParticipantActionOverview(sequenceAction, sequenceParticipantIdMap.get(sequenceAction.Id));
                participantActionsOverviewWrapperList.add(participantActionOverviewRecord);
            }
        }
        return participantActionsOverviewWrapperList;
    }
    /**
    * @author - Neha Garg
    * @description - return ParticipantActionsOverviewWrapper with participant actions details
    * @param Sequence_Action__c sequenceAction - participant actions detail.
    * @param Task task -  sequence action's task.
    * @return ParticipantActionsOverviewWrapper - participant Actions details.
    */
    private static ParticipantActionsOverviewWrapper getParticipantActionOverview(Sequence_Action__c sequenceAction,Task sequenceActionTask){
        ParticipantActionsOverviewWrapper participantActionOverviewRecord = new ParticipantActionsOverviewWrapper();
        participantActionOverviewRecord.id = sequenceAction.Id;
        participantActionOverviewRecord.actionName = sequenceAction.CadenceAction_Id__r.Action_Id__r.Name;
        participantActionOverviewRecord.sequenceName = sequenceAction.CadenceAction_Id__r.Cadence_Id__r.Name;
        participantActionOverviewRecord.actionType = sequenceAction.CadenceAction_Id__r.Action_Id__r.Type__c;
        participantActionOverviewRecord.actionLink = sequenceAction.Id;
        participantActionOverviewRecord.outcome = getParticipantActionOutcome(sequenceAction, sequenceActionTask);
        List<String> participantExecutionDayList = getParticipantActionExecutionDate(sequenceAction);
        if(!participantExecutionDayList.isEmpty()){
            participantActionOverviewRecord.actionExecutionType = participantExecutionDayList.get(0);  
            participantActionOverviewRecord.actionExecutionDate = participantExecutionDayList.get(1); 
        }
        return participantActionOverviewRecord;
    }
    /**
* @author - Neha Garg
* @description - return String with participant action's outcome
* @param Sequence_Action__c sequenceAction - participant actions detail.
* @param Task task -  sequence action's task.
* @return String - participant Action's outcome status .
*/
    private static String getParticipantActionOutcome(Sequence_Action__c sequenceAction, Task sequenceActionTask){
        String outcome = '';
        String actionType = sequenceAction.CadenceAction_Id__r.Action_Id__r.Type__c;
        if(actionType == CadenceConstants.ACTION_TYPE_EMAIL){
            if(sequenceAction.Email_Replied__c){
                outcome = CadenceConstants.EMAIL_REPLIED;
            }
            else if(sequenceAction.Email_Opened__c){
                outcome = CadenceConstants.EMAIL_OPENED;
            }
            else if(sequenceAction.Email_Sent__c){
                outcome = CadenceConstants.SENT;
            }
            else if(sequenceAction.isActionPerformed__c || sequenceAction.IsActionInitiated__c){
                outcome = CadenceConstants.SENT;
            }
        }
        else if(actionType == CadenceConstants.ACTION_TYPE_CALL && sequenceActionTask!=null &&  sequenceActionTask.ringdna__Call_Disposition__c!=null){
            outcome = sequenceActionTask.ringdna__Call_Disposition__c;
        }
        else if(actionType == CadenceConstants.ACTION_TYPE_SMS){
            if(sequenceAction.isActionPerformed__c || sequenceAction.IsActionInitiated__c){
                outcome = CadenceConstants.SENT;
            }
        }
        else if(actionType == CadenceConstants.ACTION_TYPE_TASK){
            if(sequenceAction.isActionPerformed__c || sequenceAction.IsActionInitiated__c){
                outcome = CadenceConstants.COMPLETED;
            }
        }
        return outcome;
    }
    /**
* @author - Neha Garg
* @description - return List of String with participant action's Execution date
* @param Sequence_Action__c sequenceAction - participant actions detail.
* @return List<String> - participant Action's Execution date.
*/ 
    private static List<String> getParticipantActionExecutionDate(Sequence_Action__c sequenceAction){
        List<String> participantActionExecutionDay = new List<String>();
        if(sequenceAction.isActionPerformed__c || sequenceAction.IsActionInitiated__c ){
            participantActionExecutionDay.add('past');
            participantActionExecutionDay.add(sequenceAction.Actual_Execution_Date__c.format('MMM dd'));
        }
        else if(!isCurrentAction){
            isCurrentAction = true;
            participantActionExecutionDay.add('today');
            participantActionExecutionDay.add('Today');
        }
        else{
            participantActionExecutionDay.add('future');
            participantActionExecutionDay.add(sequenceAction.Expected_Execution_Date__c.format('MMM dd'));
        }
        return participantActionExecutionDay;
    }

    /**
     * @author - Nicholas Zozaya
     * @description - (SFDC-1054) return actions by participant id map
     * @param List<Sequence_Action__c> - unstructured list of all sequence actions
     * @return Map<Id, List<Sequence_Action__c>> - sequence actions by contact or lead id
     */
    public static Map<Id, List<Sequence_Action__c>> getActionsByParticipantIdMap(List<Sequence_Action__c> lstParticipantActions){
        Map<Id, List<Sequence_Action__c>> mapActionsByParticipantId = new Map<Id, List<Sequence_Action__c>>();
        for(Sequence_Action__c action : lstParticipantActions){
            Id participantId = action.Lead_Id__c == null ? action.Contact_Id__c : action.Lead_Id__c;
            if( mapActionsByParticipantId.containsKey(participantId) )
                mapActionsByParticipantId.get(participantId).add(action);
            else   
                mapActionsByParticipantId.put(participantId, new List<Sequence_Action__c>{action});
        }
        return mapActionsByParticipantId;
    }  

    /**
     * @author - Nicholas Zozaya
     * @description - (SFDC-1054) given sequence actions return cadence ids
     * @param List<Sequence_Action__c> - unstructured list of all sequence actions
     * @return Set<Id> - cadence ids
     */
    public static Set<Id> extractSequenceIdsFromActions(List<Sequence_Action__c> lstActions){
        Set<Id> setSequenceIds = new Set<Id>();
        Boolean hasSequenceId = true;
        for(Sequence_Action__c action : lstActions)
            if( action.CadenceAction_ID__c == null || action.CadenceAction_ID__r.Cadence_Id__c == null )
                hasSequenceId = false;
        if( hasSequenceId ){
            for(Sequence_Action__c action : lstActions)
                setSequenceIds.add(action.CadenceAction_ID__r.Cadence_Id__c);
        }else{
            Map<Id, Sequence_Action__c> mapActions = new Map<Id, Sequence_Action__c>(lstActions);
            for(Sequence_Action__c action : ParticipantActionSelector.selectWithSequenceIdById( new List<Id>(mapActions.keyset()) ))
                setSequenceIds.add(action.CadenceAction_ID__r.Cadence_Id__c);
        }
        return setSequenceIds;
    }
}