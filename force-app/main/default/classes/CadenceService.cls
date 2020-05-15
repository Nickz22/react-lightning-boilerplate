global  Inherited sharing  class CadenceService {
    public static String nameSpace = CadenceConstants.NAMESPACE;
    public static String partnerAccountAPIName = 'PartnerAccount';
    
    public static List<EmailTemplate> getEmailTemplates(){ 
        List<EmailTemplate> listEmailTemplate = [Select Id, Name, Subject, Body, IsActive, Description,UIType,TemplateType,FolderId,Folder.Name,Folder.Type From EmailTemplate Where IsActive = true Limit :SequenceEngineHelper.getAvailableQueryRowsLimit()]; 
      	return listEmailTemplate;
    } 
    
    public static List<LookupFieldController.UserListWrapper> getUserWrapperList(){
        List<User> userList = CadenceSelector.getUserList();
        List<LookupFieldController.UserListWrapper> userListWrapperList = New List<LookupFieldController.UserListWrapper>();
        for (User user : userList){
            LookupFieldController.UserListWrapper userListWrapper = New LookupFieldController.UserListWrapper();
            userListWrapper.userName = user.Name;
            userListWrapper.userId = user.Id;
            userListWrapperList.add(userListWrapper);
        }
        return userListWrapperList;
    }
	
	public static List<LookupFieldController.DandBCompanyListWrapper> getDandBCompanyWrapperList(){
        List<SObject> dandBList = CadenceSelector.getDandBCompanyList();
        List<LookupFieldController.DandBCompanyListWrapper> dandBCompanyListWrapperList = New List<LookupFieldController.DandBCompanyListWrapper>();
        for (SObject dnBCompany : dandBList){
            LookupFieldController.DandBCompanyListWrapper dnBCompanyListWrapper = New LookupFieldController.DandBCompanyListWrapper();
            dnBCompanyListWrapper.Name  = String.valueof(dnBCompany.get('Name'));
            dnBCompanyListWrapper.Id = String.valueof(dnBCompany.get('Id'));
            dandBCompanyListWrapperList.add(dnBCompanyListWrapper);
        }
        return dandBCompanyListWrapperList;
    }
    public static List<ActionDetailController.WrapperTemplateObj> getSMSTemplates(){
        RingDNAApiCallouts ringdnaAPI = new RingDNAApiCallouts();
        return mapToWrapperObj(ringdnaAPI.getSMSTemplates());
    } 
    public static List<ActionDetailController.WrapperTemplateObj> getCallTemplates(){
        RingDNAApiCallouts ringdnaAPI = new RingDNAApiCallouts();
        return mapToWrapperObj(ringdnaAPI.getCallNoteTemplates());
    }
    
    public static List<ActionDetailController.WrapperTemplateObj> getVMTemplates(){
        RingDNAApiCallouts ringdnaAPI = new RingDNAApiCallouts();
        return mapToWrapperObj(ringdnaAPI.getVoicemailDrops());
    }
    
    public static List<ActionDetailController.WrapperTemplateObj> mapToWrapperObj (Map<String, String> apiMap){
        List<ActionDetailController.WrapperTemplateObj> wtList = New List<ActionDetailController.WrapperTemplateObj>();
        for(String str : apiMap.keySet()){
            ActionDetailController.WrapperTemplateObj wtObj = New ActionDetailController.WrapperTemplateObj();
            wtObj.Id = str; 
            wtObj.Name = apiMap.get(str);
            wtList.add(wtObj);
        } 
        return wtList; 
    }
    
    public static List<CriterionWrapper> getFields(String objectStr) {
        List<CriterionWrapper> criterionWrapperList = new List<CriterionWrapper>();
        Schema.sObjectType sObjectName = Schema.getGlobalDescribe().get(objectStr);
        if(sObjectName != null){
            Map<String, Schema.SObjectField> fieldsMap = sObjectName.getDescribe().fields.getMap();
            
            CriterionWrapper criterionWrapper = new CriterionWrapper();
            criterionWrapper.GroupName = '';
            List<Criterion> fieldsWithLabels = new List<Criterion>();
            List<ActionDetailController.wrapperTaskField> listWrapperTaskFields = new List<ActionDetailController.wrapperTaskField>();
            for (String field : fieldsMap.keySet()) {
                
                Schema.sObjectField fieldAPIName = fieldsMap.get(field);
                Schema.DisplayType fieldDataType = fieldAPIName.getDescribe().getType();
                Schema.DescribeFieldResult dfr = fieldAPIName.getDescribe();
                Integer LengthOfField = dfr.getLength();
                if (fieldDataType == Schema.DisplayType.Boolean || fieldDataType == Schema.DisplayType.Double 
                    || fieldDataType == Schema.DisplayType.Integer 
                    || fieldDataType == Schema.DisplayType.String 
                    || fieldDataType == Schema.DisplayType.Picklist
                    || fieldDataType == Schema.DisplayType.Combobox 
                    || fieldDataType == Schema.DisplayType.MULTIPICKLIST
                    || (fieldDataType == Schema.DisplayType.Textarea && ((fieldDataType != Schema.DisplayType.ENCRYPTEDSTRING)) )
                   ) {
                       if(!fieldAPIName.getDescribe().isCalculated() && fieldAPIName.getDescribe().isUpdateable()) {
                           Criterion c = new Criterion();
                           c.fieldName = fieldAPIName.getDescribe().getName();
                           c.fieldLabel = fieldAPIName.getDescribe().getLabel();
                           c.fieldDataType = getDataType(objectStr, c.fieldName);
                           if (c.fieldDataType == 'Picklist' || c.fieldDataType == 'MultiPickList'){
                               c.listPicklistValues = getPicklistValues(objectStr, c.fieldName);
                           }
                           fieldsWithLabels.add(c);
                           
                       }
                   }
            }
            criterionWrapper.fieldsDetail = fieldsWithLabels;
            criterionWrapperList.add(criterionWrapper);
        }
        return criterionWrapperList;
    }
    
    public static List<CriterionWrapper> getFieldsWithLabels(List<String> objectlist){
        String objectStr ; 
        List<Criterion> fieldsWithLabels = new List<Criterion>();
		List<CriterionWrapper> fieldList = new List<CriterionWrapper>();      
        CriterionWrapper criterionWrapper;
        map<String,List<Criterion>> mapOfGroupWithCriterion = new  map<String,List<Criterion>>();
        Integer index = 0;
        Boolean IsPartnerAccount = false;
        List<Schema.DescribeSObjectResult> descResult = Schema.describeSObjects(CadenceUtil.getValidSObjectListInOrg(objectlist));
        if(descResult != null && descResult.size() > 0){
            for(Schema.DescribeSObjectResult dsc : descResult){ 
                if(dsc != null && dsc.getName()!= null){
                    criterionWrapper = new CriterionWrapper();
                    objectStr =dsc.getName();
                    Schema.sObjectType sObjectName = Schema.getGlobalDescribe().get(objectStr);
                    if (sObjectName != null){
                        criterionWrapper.GroupName = objectStr;
                        if(!mapOfGroupWithCriterion.containskey(objectStr)){
                              mapOfGroupWithCriterion.put(objectStr,new list<Criterion>());  
                        }
                        if(index == 0){
                            criterionWrapper.IsParent = true;
                        }

                        SObjectType r = dsc.getSobjectType();
                        String fieldsetName = SequenceService.getFieldSetNames(objectStr);
                        Schema.DescribeSObjectResult baseObject = dsc;
                        if(fieldsetName != null){
                        	List<Schema.FieldSetMember> listOfFieldsOfSet  =   dsc.FieldSets.getMap().get(fieldSetName) != null ? dsc.FieldSets.getMap().get(fieldSetName).getFields():new List<Schema.FieldSetMember>();  
                        	Map<String, Schema.SObjectField> fieldsMap = dsc.fields.getMap(); 
                            for (Schema.FieldSetMember fieldmember : listOfFieldsOfSet) {
                                IsPartnerAccount = false;
                                dsc =baseObject;
                                objectStr =dsc.getName();
                                Criterion c = new Criterion();
                                string fieldApiNameInString =fieldmember.getFieldPath();
                                if (fieldApiNameInString.contains('.')) {
                                    if (fieldApiNameInString.contains('__r.')) {
                                        continue;
                                    }
                                    if (objectStr == CadenceConstants.CONTACT_OBJECT_NAME) {
                                        if (!fieldApiNameInString.contains(CadenceConstants.ACCOUNT_OBJECT_NAME + '.')) {
                                            continue;
                                        }
                                    }
                                    if (objectStr == CadenceConstants.LEAD_OBJECT_NAME) {
                                        if (!fieldApiNameInString.contains(CadenceConstants.DB_OBJECT_NAME + '.')) {
                                            continue;
                                        }
                                    }
                                    if (objectStr == CadenceConstants.OPPORTUNITY_OBJECT_NAME) {
                                        if (!(fieldApiNameInString.contains(CadenceConstants.OPPORTUNITY_ROLE_OBJECT_NAME + '.') ||
                                                fieldApiNameInString.contains(CadenceConstants.PRICE_BOOK_OBJECT_NAME + '.') ||
                                                fieldApiNameInString.contains(CadenceConstants.ACCOUNT_OBJECT_NAME + '.') ||
                                                fieldApiNameInString.contains(CadenceConstants.CONTRACT_OBJECT_NAME + '.') ||
                                                fieldApiNameInString.contains(CadenceConstants.CAMPAIGN_OBJECT_NAME + '.') ||
                                                fieldApiNameInString.contains(CadenceConstants.PARTNER_ACCOUNT_OBJECT_NAME + '.')
                                            )) {
                                            continue;
                                        }

                                    }
                                }
                                Boolean isParentField= false;
                                if(fieldmember.getFieldPath().contains('.')){
                                    isParentField =true;
                                    fieldApiNameInString=(fieldmember.getFieldPath()).substringAfter('.');
                                    String parentObjectName =(fieldmember.getFieldPath()).substringBefore('.');
                                    if(parentObjectName == CadenceConstants.PARTNER_ACCOUNT_OBJECT_NAME){
                                        dsc =Schema.getGlobalDescribe().get(CadenceConstants.ACCOUNT_OBJECT_NAME).getDescribe();
                                        objectStr = CadenceConstants.PARTNER_ACCOUNT_OBJECT_NAME;
                                        IsPartnerAccount = true;
                                    }else{
                                        dsc =Schema.getGlobalDescribe().get(parentObjectName).getDescribe();
                                        objectStr =dsc.getName();                                        
                                    }
                                }
                                Schema.sObjectField fieldAPIName = dsc.fields.getMap().get(fieldApiNameInString);
                                Schema.DisplayType fieldDataType = fieldmember.getType();           
                                Schema.DescribeFieldResult dfr = fieldAPIName.getDescribe();
                                c.fieldName = fieldAPIName.getDescribe().getName();
                                Integer LengthOfField = dfr.getLength();
                                if (fieldDataType == Schema.DisplayType.Boolean 
                                    || fieldDataType == Schema.DisplayType.REFERENCE
                                    || fieldDataType == Schema.DisplayType.Double 
                                    || fieldDataType == Schema.DisplayType.Integer
                                    || fieldDataType == Schema.DisplayType.Email
                                    || fieldDataType == Schema.DisplayType.Phone
                                    || fieldDataType == Schema.DisplayType.Date 
                                    || fieldDataType == Schema.DisplayType.URL
                                    || fieldDataType == Schema.DisplayType.Currency
                                    || fieldDataType == Schema.DisplayType.DateTime
                                    || (fieldDataType == Schema.DisplayType.String )
                                    || fieldDataType == Schema.DisplayType.Picklist
                                    || (fieldDataType == Schema.DisplayType.Textarea && (LengthOfField <= 255 && (fieldDataType != Schema.DisplayType.ENCRYPTEDSTRING)) )               
                                    || fieldDataType == Schema.DisplayType.Combobox
                                    || fieldDataType == Schema.DisplayType.MULTIPICKLIST
                                   ){
                                       if(!fieldAPIName.getDescribe().isCalculated() && fieldAPIName.getDescribe().isUpdateable()){
                                           c.fieldName = fieldAPIName.getDescribe().getName();
                                           c.fieldLabel = fieldAPIName.getDescribe().getLabel();
                                           if(IsPartnerAccount){
                                               c.fieldDataType = getDataType(CadenceConstants.ACCOUNT_OBJECT_NAME, c.fieldName);
                                           }else{
                                           	   c.fieldDataType = getDataType(objectStr, c.fieldName);    
                                           }
                                           
                                           
                                           if (c.fieldDataType == 'Picklist' || c.fieldDataType == 'MultiPickList'){
                                               if(IsPartnerAccount){
                                                   c.listPicklistValues = getPicklistValues(CadenceConstants.ACCOUNT_OBJECT_NAME, c.fieldName);
                                                   c.picklistApiNameAndValues = Criterion.getPicklistApiNameAndValues(CadenceConstants.ACCOUNT_OBJECT_NAME, c.fieldName);
                                               }else{
                                                   c.listPicklistValues = getPicklistValues(objectStr, c.fieldName);   
                                                   c.picklistApiNameAndValues = Criterion.getPicklistApiNameAndValues(objectStr, c.fieldName);
                                               }
                                               
                                           }
                                           
                                           if (!(c.fieldDataType == 'Reference' && objectStr == 'DandBCompany' )){
                                               if (c.fieldDataType != 'Reference' || (c.fieldDataType == 'Reference' && validForCriteria(objectStr, c.fieldName))){
                                                   if(index != 0){
                                                       c.fieldName =  objectStr + '.' + c.fieldName;
                                                   }
                                                   if(mapOfGroupWithCriterion.containskey(objectStr)){
                                                       list<Criterion> existingListfieldsWithLabels = mapOfGroupWithCriterion.get(objectStr) != null?mapOfGroupWithCriterion.get(objectStr) :new List<Criterion>();
                                                       if(isParentField){
                                                           c.fieldName =fieldmember.getFieldPath();
                                                       }
                                                       existingListfieldsWithLabels.add(c);
                                                       mapOfGroupWithCriterion.put(objectStr,existingListfieldsWithLabels);
                                                   }
                                                   else{
                                                       if(isParentField){
                                                           c.fieldName =fieldmember.getFieldPath();
                                                       }
                                                       mapOfGroupWithCriterion.put(objectStr,new list<Criterion>{c});
                                                   }
                                               }
                                           }  
                                       }
                                   } 
                                }
                        	}
                        	else if(objectStr == CadenceConstants.OPPORTUNITY_ROLE_OBJECT_NAME){
                                Schema.sObjectType sObjectRoleName = Schema.getGlobalDescribe().get(objectStr);
                                if (sObjectName != null){
                                    SObjectType sobjectRoleType = dsc.getSobjectType(); 
                                    Map<String, Schema.SObjectField> fieldsMap = dsc.fields.getMap(); 
                                    for (String field : fieldsMap.keySet()) {
                                        Criterion c = new Criterion();
                                        Schema.sObjectField fieldAPIName = fieldsMap.get(field);
                                        Schema.DisplayType fieldDataType = fieldAPIName.getDescribe().getType();           
                                        Schema.DescribeFieldResult dfr = fieldAPIName.getDescribe();
                                        if(fieldAPIName.getDescribe().getLabel() =='Role'){
                                          c.fieldName = fieldAPIName.getDescribe().getName();
                                          c.fieldLabel = fieldAPIName.getDescribe().getLabel();
                                          c.fieldDataType = getDataType(objectStr, c.fieldName);
                                          if (c.fieldDataType == 'Picklist'){
                                               c.listPicklistValues = getPicklistValues(objectStr, c.fieldName);
                                               c.picklistApiNameAndValues = Criterion.getPicklistApiNameAndValues(objectStr, c.fieldName);
                                           }
                                           c.fieldName = CadenceConstants.OPPORTUNITY_ROLE_OBJECT_NAME +'.'+fieldAPIName.getDescribe().getName();
                                           mapOfGroupWithCriterion.put(objectStr,new list<Criterion>{c});
                                        }
                                    }
                                }
                            }
                    }
                }
                index++; 
                criterionWrapper.fieldsDetail = fieldsWithLabels;
                fieldList.add(criterionWrapper);
                fieldsWithLabels = new List<Criterion>();
            }
            if(mapOfGroupWithCriterion.keyset().size() > 0){
                fieldList.clear();
                for(String st : mapOfGroupWithCriterion.keyset()){
                     CriterionWrapper criterionWrappernew = new  CriterionWrapper();
                     criterionWrappernew.GroupName = st;
                     criterionWrappernew.fieldsDetail = mapOfGroupWithCriterion.get(st);
                     fieldList.add(criterionWrappernew);
                }
               
            }
        }
        return fieldList;
    }
    
    public static List<CriterionWrapper> getFieldsWithLabelsForUpdate(List<String> objectlist){ 
        String objectStr ; 
        List<Criterion> fieldsWithLabels = new List<Criterion>();
        List<CriterionWrapper> fieldList = new List<CriterionWrapper>();      
        CriterionWrapper criterionWrapper;
        Integer index = 0;
        List<Schema.DescribeSObjectResult> descResult = Schema.describeSObjects(CadenceUtil.getValidSObjectListInOrg(objectlist));
        if(descResult != null && descResult.size() > 0){
            for(Schema.DescribeSObjectResult dsc : descResult){ 
                if(dsc != null && dsc.getName()!= null){
                    criterionWrapper = new CriterionWrapper();
                    objectStr =dsc.getName(); 
                    criterionWrapper.GroupName = objectStr;
                    if(index == 0){
                        criterionWrapper.IsParent = true;
                    }
                    
                    Schema.sObjectType sObjectName = Schema.getGlobalDescribe().get(objectStr);
                    if (sObjectName != null){
                        SObjectType r = dsc.getSobjectType(); 
                        Map<String, Schema.SObjectField> fieldsMap = dsc.fields.getMap(); 
                        for (String field : fieldsMap.keySet()) {
                            
                            Criterion c = new Criterion();
                            Schema.sObjectField fieldAPIName = fieldsMap.get(field);
                            Schema.DisplayType fieldDataType = fieldAPIName.getDescribe().getType();           
                            Schema.DescribeFieldResult dfr = fieldAPIName.getDescribe();
                            Integer LengthOfField = dfr.getLength();
                            
                            if (fieldDataType == Schema.DisplayType.Boolean 
                                || fieldDataType == Schema.DisplayType.REFERENCE
                                || fieldDataType == Schema.DisplayType.Double 
                                || fieldDataType == Schema.DisplayType.Integer
                                || fieldDataType == Schema.DisplayType.Email
                                || fieldDataType == Schema.DisplayType.Phone
                                || fieldDataType == Schema.DisplayType.Date
                                || fieldDataType == Schema.DisplayType.DateTime
                                || (fieldDataType == Schema.DisplayType.String )
                                || fieldDataType == Schema.DisplayType.Picklist
                                || (fieldDataType == Schema.DisplayType.Textarea && (LengthOfField <= 255 && (fieldDataType != Schema.DisplayType.ENCRYPTEDSTRING)) )               
                                || fieldDataType == Schema.DisplayType.Combobox
                                || fieldDataType == Schema.DisplayType.MULTIPICKLIST
                               ){
                                   if(!fieldAPIName.getDescribe().isCalculated() && fieldAPIName.getDescribe().isUpdateable()){
                                       
                                       c.fieldName = fieldAPIName.getDescribe().getName();
                                       c.fieldLabel = fieldAPIName.getDescribe().getLabel();
                                       c.fieldDataType = getDataType(objectStr, c.fieldName);
                                       if (c.fieldDataType == 'Picklist' || c.fieldDataType == 'MultiPickList'){
                                           c.listPicklistValues = getPicklistValues(objectStr, c.fieldName);
                                           c.picklistApiNameAndValues = Criterion.getPicklistApiNameAndValues(objectStr, c.fieldName);
                                       }
                                       if (!(c.fieldDataType == 'Reference' && (c.fieldName == nameSpace+'Cadence_ID__c' || c.fieldName == 'ReportsToId' || c.fieldName == 'OwnerId' ))){
                                           if (c.fieldDataType != 'Reference' || (c.fieldDataType == 'Reference' && validForCriteria(objectStr, c.fieldName))){
                                               if(index != 0){
                                                   c.fieldName =  objectStr + '.' + c.fieldName;
                                               }
                                               fieldsWithLabels.add(c);
                                           }
                                       }
                                       
                                   }
                               } 
                        }
                    }
                }
                index++; 
                criterionWrapper.fieldsDetail = fieldsWithLabels;
                fieldList.add(criterionWrapper);
                fieldsWithLabels = new List<Criterion>();
            }
        }
        
        return fieldList;
    }
    
    public static String getDataType(String objectStr, String field) {
        Schema.sObjectType sObjectName = Schema.getGlobalDescribe().get(objectStr);
        Map<String, Schema.SObjectField> fieldsMap = sObjectName.getDescribe().fields.getMap();
        Schema.DisplayType fieldType = fieldsMap.get(field).getDescribe().getType();
        String dataType = 'String';
        if (fieldType == Schema.DisplayType.Boolean) {
            dataType = 'Boolean';
        } else if (fieldType == Schema.DisplayType.Double || fieldType == Schema.DisplayType.Integer) {
            dataType = 'Number';
        } else if (fieldType == Schema.DisplayType.String) {
            dataType = 'String';
        } else if (fieldType == Schema.DisplayType.Picklist) {
            dataType = 'Picklist';
        }else if (fieldType == Schema.DisplayType.Email) {
            dataType = 'Email';
        }else if (fieldType == Schema.DisplayType.Phone) {
            dataType = 'Phone';
        }else if (fieldType == Schema.DisplayType.Date) {
            dataType = 'Date';
        }else if (fieldType == Schema.DisplayType.DateTime) {
            dataType = 'DateTime';
        }else if (fieldType == Schema.DisplayType.MULTIPICKLIST) {
            dataType = 'MultiPickList';
        }else if (fieldType == Schema.DisplayType.URL) {
            dataType = 'String';
        }else if (fieldType == Schema.DisplayType.Currency) {
            dataType = 'Number';
        }else if (fieldType == Schema.DisplayType.REFERENCE) {
            dataType = 'Reference';
        }
        return dataType;
    }
    
    public static List<String> getPicklistValues(String objectStr, String field) { 
        List<String> picklistValues = new List<String>();
        Schema.sObjectType sObjectName = Schema.getGlobalDescribe().get(objectStr);
        Map<String, Schema.SObjectField> fieldsMap = sObjectName.getDescribe().fields.getMap();
        Schema.sObjectField fieldAPIName = fieldsMap.get(field);
        Schema.DescribeFieldResult fieldResult = fieldAPIName.getDescribe();  
        List<Schema.PicklistEntry> values = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry picklistVal : values) {
            picklistValues.add(picklistVal.getLabel());
        }     
        return picklistValues;
    }
    
	public static void setParticipantsActivation(List<Id> cadIdList, Boolean active){
        if( cadIdList.isEmpty() )
            return;
        List<Cadence__c> lstCadence = CadenceSelector.getCadenceById(cadIdList[0]);
        if( lstCadence.isEmpty() )
            return;
        Cadence__c cad = lstCadence[0];
        String objectName = cad.Record_Type__c;
        String query;
        Integer participantsCount=0;
        if (objectName.equalsIgnoreCase(CadenceConstants.OPPORTUNITY_OBJECT_NAME)) {
            objectName = CadenceConstants.CONTACT_OBJECT_NAME;
        }
        else if (objectName.equalsIgnoreCase(CadenceConstants.CAMPAIGN_OBJECT_NAME)) {
            objectName = CadenceConstants.CONTACT_OBJECT_NAME;
            query = 'Select COUNT() FROM ' + objectName + ' WHERE ' + nameSpace + 'Cadence_Id__c = \'' + cadIdList[0] + '\'' ;
            participantsCount = Database.countQuery(query);
            objectName = CadenceConstants.LEAD_OBJECT_NAME;
            query = 'Select COUNT() FROM ' + objectName + ' WHERE ' + nameSpace + 'Cadence_Id__c = \'' + cadIdList[0] + '\'' ;
            participantsCount += Database.countQuery(query);
        }
        else{
            query = 'Select COUNT() FROM ' + objectName + ' WHERE ' + nameSpace + 'Cadence_Id__c = \'' + cadIdList[0] + '\'' ;
            participantsCount += Database.countQuery(query);
        }
        integer dmlLimit = Test.isRunningTest() ? 10 : 50;
        query = getParticipantQuery(cadIdList, cad.Record_Type__c);
        if( participantsCount > dmlLimit ){
            PerformDMLActionBatch dmlOperation = new PerformDMLActionBatch(query, CadenceConstants.DMLUPDATE, active ? CadenceConstants.ENABLE_PARTICIPANTS : CadenceConstants.DISABLE_PARTICIPANTS);
            Database.executeBatch(dmlOperation, 4000);
        }else{
            List<SObject> participantList = ParticipantSelector.getCadenceParticipants(cadIdList, cad.Record_Type__c);
            if( !participantList.isEmpty() ){
                for(SObject participant: participantList) {
                    participant.put(nameSpace + 'isActivated__c', active);
                }
                CadenceUtil.tryUpdate(participantList, CadenceConstants.ALL_OR_NONE_TRUE);
            }
        }
    }
    
    public static string getParticipantQuery(List<Id> cadIdList, String objName){
        Id cadId;
        if( !cadIdList.isEmpty() ){
            cadId = cadIdList[0];
        }
        if(objName.equalsIgnoreCase(CadenceConstants.OPPORTUNITY_OBJECT_NAME))
            objName = CadenceConstants.CONTACT_OBJECT_NAME;
        String query = 'Select Id, Name, '+nameSpace+'Cadence_ID__c, '+nameSpace+'isActivated__c';
        query += ' FROM '+ objName +' WHERE '+nameSpace+'Cadence_Id__c = \'' + cadId + '\'  Limit '+SequenceEngineHelper.getAvailableQueryRowsLimit()  ;
        return query;
    }
    
    //This method is to create participant actions  
    public static List<Sequence_Action__c> createActionParticipants(Map<Id, List<CadenceAction__c>> objIdToActionMap, Map<Id, SObject> objMap, String objName) {
        List<Sequence_Action__c> partActionsToCreate = new List<Sequence_Action__c>(); 
        for(Id objId : objIdToActionMap.keySet()) {
            DateTime entranceDate = (DateTime)objMap.get(objId).get(namespace+'EntranceCriteria_Matched_Date__c');
            List<CadenceAction__c> cadActions = objIdToActionMap.get(objId);
            Integer day = 0, hour = 0;
            for(CadenceAction__c cadAct : cadActions) {
                if(cadAct.Day__c != null) {
                    day = day + (Integer)cadAct.Day__c;
                }
                if(cadAct.Hour__c != null) {
                    hour = hour + (Integer)cadAct.Hour__c;
                }
                Sequence_Action__c partAct = new Sequence_Action__c();
                if(Schema.sObjectType.Sequence_Action__c.fields.Name.isCreateable()){
                    partAct.Name = cadAct.Name;
                }
                if(Schema.sObjectType.Sequence_Action__c.fields.CadenceAction_ID__c.isCreateable()){
                    partAct.CadenceAction_ID__c = cadAct.Id;
                }
                if(Schema.sObjectType.Sequence_Action__c.fields.Expected_Execution_Date__c.isCreateable()){
                    partAct.Expected_Execution_Date__c = CadenceUtil.addTimeInDate(entranceDate, day, hour);
                }
                if(objName.equals(CadenceConstants.LEAD_OBJECT_NAME)) {
                    if(Schema.sObjectType.Sequence_Action__c.fields.Lead_Id__c.isCreateable()){
                        partAct.Lead_Id__c = objId;	
                    }
                } else {
                    if(Schema.sObjectType.Sequence_Action__c.fields.Contact_Id__c.isCreateable()){
                        partAct.Contact_Id__c = objId;	
                    }
                }
                partActionsToCreate.add(partAct);
            }	
        }
        if(partActionsToCreate != null && partActionsToCreate.size()>0){
            if(Schema.sObjectType.Sequence_Action__c.isCreateable()){
                CadenceUtil.tryInsert(partActionsToCreate, CadenceConstants.ALL_OR_NONE_TRUE);	
            }
        }
        return partActionsToCreate;			
    } 
    
    public static NativeEmailMessage createNativeEmailMessage(String nativeMailTo,Id EmailTemplateId,Id participantId, Id actionId, String nameTo, Id usreId ){
        NativeEmailMessage emailMessage= NativeEmailController.resolveMergeFields(String.valueOf(participantId) , String.valueOf(EmailTemplateId));
        NativeEmailMessage nativeEmail = new NativeEmailMessage (nativeMailTo, '','', emailMessage.subject, emailMessage.Body,EmailTemplateId, actionId, nameTo, participantId, usreId, emailMessage.isHtmlTemplate);
        return nativeEmail; 
    }
    
    public static Map<Id, List<Sequence_Action__c>> getRemainingParticipantActions(Set<Id> objIds, String objName) { 
        Map<Id, List<Sequence_Action__c>> objToParticipantActionsMap = new Map<Id, List<Sequence_Action__c>>(); 
        List<Sequence_Action__c> participantActions;
            participantActions = [Select Id, Name, CadenceAction_ID__c, Expected_Execution_Date__c, Show_on_Target_List__c, Lead_Id__c, Contact_Id__c, isActionPerformed__c,IsActionInitiated__c, CadenceAction_Id__r.Day__c,
                                  CadenceAction_Id__r.Hour__c, CadenceAction_Id__r.Action_Id__r.Type__c, CadenceAction_Id__r.Fields_To_Update_Action__c,
                                  CadenceAction_Id__r.Action_Id__r.Activation_Type__c, CadenceAction_Id__r.Trigger_Type__c,
                                  CadenceAction_Id__r.Action_Id__r.Task_Description__c, CadenceAction_Id__r.Action_Id__r.Template_Id__c From Sequence_Action__c 
                                  where (Lead_Id__c IN :objIds OR Contact_Id__c IN :objIds)AND isActionPerformed__c = false AND IsActionInitiated__c = false 
                              	  order by CadenceAction_Id__r.Index__c Limit :SequenceEngineHelper.getAvailableQueryRowsLimit()];
        for(Sequence_Action__c partAct : participantActions) {
            if(partAct.Lead_Id__c != null) {
                if(objToParticipantActionsMap.containsKey(partAct.Lead_Id__c)) {
                    objToParticipantActionsMap.get(partAct.Lead_Id__c).add(partAct);
                } else {
                    objToParticipantActionsMap.put(partAct.Lead_Id__c, new List<Sequence_Action__c>{partAct});
                }
            } 
            else {
                if(objToParticipantActionsMap.containsKey(partAct.Contact_Id__c)) {
                    objToParticipantActionsMap.get(partAct.Contact_Id__c).add(partAct);
                } else {
                    objToParticipantActionsMap.put(partAct.Contact_Id__c, new List<Sequence_Action__c>{partAct});
                } 
            }	
        }
        return objToParticipantActionsMap;
    }            

    
    public static Map<Id,List<Id>> getParticipantSequenceHistory(Set<Id> objIds,String objName){
        //This method will return Map contain ParticipantId as Key and List of sequenceIds as values that assigned Participant in past.
        Map<Id,List<Id>> sequenceHistoryMap = new Map<Id,List<Id>>();
        List<Id> sequenceIds;
        List<Participant_Sequence_History__c> sequenceHistory = [Select Sequence_Id__c,Lead_Id__c,Contact_Id__c
                                                                 From Participant_Sequence_History__c 
                                                                 where Lead_Id__c IN :objIds OR Contact_Id__c IN :objIds Limit :SequenceEngineHelper.getAvailableQueryRowsLimit() ];
        
        
        for(Participant_Sequence_History__c obj:sequenceHistory){
            if(objName.equals(CadenceConstants.LEAD_OBJECT_NAME)) {
                if(obj.Lead_Id__c != null && sequenceHistoryMap.containsKey(obj.Lead_Id__c)){
                    sequenceIds = new List<Id>();
                    sequenceIds = sequenceHistoryMap.get(obj.Lead_Id__c);
                    sequenceIds.add(obj.Sequence_Id__c); 
                }
                else{
                    sequenceIds = new List<Id>();
                    sequenceIds.add(obj.Sequence_Id__c); 
                    sequenceHistoryMap.put(obj.Lead_Id__c, sequenceIds);
                }
            }
            else{
                if(obj.Contact_Id__c != null && sequenceHistoryMap.containsKey(obj.Contact_Id__c)){
                    sequenceIds = new List<Id>();
                    sequenceIds = sequenceHistoryMap.get(obj.Contact_Id__c);
                    sequenceIds.add(obj.Sequence_Id__c); 
                }
                else{
                    sequenceIds = new List<Id>();
                    sequenceIds.add(obj.Sequence_Id__c); 
                    sequenceHistoryMap.put(obj.Contact_Id__c, sequenceIds);
                }    
            }
        }  
        return sequenceHistoryMap;
    }     
    
    @future
    public static void createTasks(String tasksJson) {
        List<Task> tasks = (List<Task>)JSON.deserialize(tasksJson, List<Task>.class);
        //insert tasks; 
        Database.SaveResult[] results = Database.insert(tasks, false);
    }
    
    public static void updateRemainingParticipantAction(Map<Id, List<Sequence_Action__c>> performedPartAct,Map<Id, List<Sequence_Action__c>> partActionsMap){
        //Updating dates on remaining participant objects 
        List<Sequence_Action__c> saToUpdate = new List<Sequence_Action__c>();
        for(Id objId : performedPartAct.keySet()) {
            for(Sequence_Action__c sa : performedPartAct.get(objId)) { 
                Id partId = sa.Lead_Id__c == null ? sa.Contact_Id__c : sa.Lead_Id__c; 
                saToUpdate.addAll(CadenceService.updateActionOnParticipantExpectedDate(sa.Actual_Execution_Date__c, (Integer)sa.CadenceAction_Id__r.Index__c, partActionsMap.get(partId)));
            }
        }
       
        if(!saToUpdate.isEmpty()) {
            CadenceUtil.tryUpdate(saToUpdate, CadenceConstants.ALL_OR_NONE_TRUE);
        }
    }
    
    public static boolean validForCriteria(String objectName, String fieldName){
        if (objectName == CadenceConstants.CONTACT_OBJECT_NAME){
            if (fieldName == 'MasterRecordId' || fieldName == 'AccountId' 
                || fieldName == 'CreatedById' || fieldName == 'LastModifiedById' || fieldName == 'OwnerId'
                || fieldName == 'ReportsToId' || fieldName == nameSpace+'Cadence_ID__c' ){
                return true;
            }else {
                return false;
            }
        }else if (objectName == CadenceConstants.ACCOUNT_OBJECT_NAME){
            if (fieldName == 'MasterRecordId' || fieldName == 'ParentId' 
                || fieldName == 'CreatedById' || fieldName == 'LastModifiedById' || fieldName == 'OwnerId'
                || fieldName == 'DandbCompanyId'  ){
                return true;
            }else {
                return false;
            }
        }else if (objectName == CadenceConstants.LEAD_OBJECT_NAME){
            if (fieldName == 'MasterRecordId' 
                || fieldName == 'CreatedById' || fieldName == 'LastModifiedById' || fieldName == 'OwnerId'
                || fieldName == 'DandbCompanyId' || fieldName == nameSpace+'Cadence_ID__c' ){
                return true;
            }else {
                return false;
            }
        }else if (objectName == CadenceConstants.OPPORTUNITY_OBJECT_NAME){
            if (fieldName == nameSpace+'Celigo_Contract__c' 
                || fieldName == nameSpace+'Champion__c' || fieldName == nameSpace+'Distributor__c' || fieldName == nameSpace+'Economic_Buyer__c'
                || fieldName == nameSpace+'Eligible_Account_For_Channel_Sales__c' || fieldName == nameSpace+'End_User__c' 
                || fieldName == nameSpace+'From_Contract__c' || fieldName == nameSpace+'Order__c' || fieldName == nameSpace+'Reseller__c' || fieldName =='ContractId' ||fieldName =='Pricebook2Id' || fieldName =='CampaignId' || fieldName =='AccountId'){
                return true;
            }else {
                return false;
            }
        }else if (objectName == CadenceConstants.CAMPAIGN_OBJECT_NAME){
            if (fieldName == 'CampaignMemberRecordTypeId' || fieldName == 'OwnerId' || fieldName == 'ParentId' ){
               return true;
            }else {
                return false;
            }
        }
        else  {
            return false;
        }
    }
    
    //********************************Updated Logic required methods ************//
    public static Map<Id, List<Sequence_Action__c>> getRemainingParticipantAction(Set<Id> objIds, String objName) {
		
        Map<Id, List<Sequence_Action__c>> objIdToSequenceActionsMap = new Map<Id, List<Sequence_Action__c>>();
        
        //Getting all the available and unperformed action for object
        List<Sequence_Action__c> participantActions = new List<Sequence_Action__c>();
            
        if(objName == CadenceConstants.OPPORTUNITY_OBJECT_NAME){
            participantActions = [Select Id, Name, CadenceAction_ID__c, Show_on_Target_List__c, Lead_Id__c, Contact_Id__c,Opportunity_Id__c,Cadence_Type__c, isActionPerformed__c, IsActionInitiated__c, CadenceAction_Id__r.Day__c,
                                  CadenceAction_Id__r.Hour__c, CadenceAction_Id__r.Action_Id__r.Type__c, CadenceAction_Id__r.Fields_To_Update_Action__c,
                                  CadenceAction_Id__r.Action_Id__r.Activation_Type__c, CadenceAction_Id__r.Trigger_Type__c, CadenceAction_Id__r.Action_Id__r.Email_Type__c,
                                  CadenceAction_Id__r.Action_Id__r.Task_Description__c, CadenceAction_Id__r.Action_Id__r.Template_Id__c, 
                                  CadenceAction_Id__r.Index__c, Expected_Execution_Date__c, Actual_Execution_Date__c, OwnerId From Sequence_Action__c 
                                  where Contact_Id__c IN : objIds AND CadenceAction_ID__r.Cadence_Id__r.Record_Type__c = 'Opportunity' AND  isActionPerformed__c = false AND  IsActionInitiated__c = false AND isDeferred__c = false 
                                  order by CadenceAction_Id__r.Index__c Limit :SequenceEngineHelper.getAvailableQueryRowsLimit()];
        }
        else{
            participantActions = [Select Id, Name, CadenceAction_ID__c, Show_on_Target_List__c, Lead_Id__c, Contact_Id__c,Opportunity_Id__c,Cadence_Type__c, isActionPerformed__c, IsActionInitiated__c,CadenceAction_Id__r.Day__c,
                                  CadenceAction_Id__r.Hour__c, CadenceAction_Id__r.Action_Id__r.Type__c, CadenceAction_Id__r.Fields_To_Update_Action__c,
                                  CadenceAction_Id__r.Action_Id__r.Activation_Type__c, CadenceAction_Id__r.Trigger_Type__c, CadenceAction_Id__r.Action_Id__r.Email_Type__c,
                                  CadenceAction_Id__r.Action_Id__r.Task_Description__c, CadenceAction_Id__r.Action_Id__r.Template_Id__c, 
                                  CadenceAction_Id__r.Index__c, Expected_Execution_Date__c, Actual_Execution_Date__c, OwnerId From Sequence_Action__c 
                                  where (Lead_Id__c IN :objIds OR Contact_Id__c IN : objIds) AND CadenceAction_ID__r.Cadence_Id__r.Record_Type__c != 'Opportunity' AND isActionPerformed__c = false AND  IsActionInitiated__c = false  AND isDeferred__c = false 
                                  order by CadenceAction_Id__r.Index__c Limit :SequenceEngineHelper.getAvailableQueryRowsLimit()];
        }
        
        for(Sequence_Action__c sequenceAct : participantActions) {
            if(sequenceAct.Lead_Id__c == null && sequenceAct.Contact_Id__c == null) {
                continue;
            }
			
            if(sequenceAct.Lead_Id__c == null) {
                if(!objIdToSequenceActionsMap.containsKey(sequenceAct.Contact_Id__c)) {
                    objIdToSequenceActionsMap.put(sequenceAct.Contact_Id__c, new List<Sequence_Action__c>{sequenceAct});	    
                } else {
                    objIdToSequenceActionsMap.get(sequenceAct.Contact_Id__c).add(sequenceAct);
                }	    
            } else {
                if(!objIdToSequenceActionsMap.containsKey(sequenceAct.Lead_Id__c)) {
                    objIdToSequenceActionsMap.put(sequenceAct.Lead_Id__c, new List<Sequence_Action__c>{sequenceAct});    
                } else {
                    objIdToSequenceActionsMap.get(sequenceAct.Lead_Id__c).add(sequenceAct);
                }
            }
        }
        return objIdToSequenceActionsMap;
    } 
            
    public static List<Sequence_Action__c> updateActionOnParticipantExpectedDate(DateTime lastExecutionDate, Integer index, List<Sequence_Action__c> updateActions) {
        List<Sequence_Action__c> saToUpdate = new List<Sequence_Action__c>();
        Integer day = 0, hour = 0;
        DateTime executionDate = lastExecutionDate,nextDate;

        if (lastExecutionDate == null) {
            return saToUpdate;
        }
        
        if(updateActions == null) {
            return saToUpdate;
        }
        for(Sequence_Action__c sa : updateActions) {
            if(sa.Actual_Execution_Date__c == null && sa.isActionPerformed__c == false && sa.IsActionInitiated__c == false && sa.CadenceAction_Id__r.Index__c > index) {
                if(sa.CadenceAction_ID__r.Day__c != null) {
                    day = day + (Integer)sa.CadenceAction_ID__r.Day__c;
                }
                if(sa.CadenceAction_ID__r.Hour__c != null) {
                    hour = hour + (Integer)sa.CadenceAction_ID__r.Hour__c;
                }
                nextDate = CadenceUtil.addTimeInDate(executionDate, day, hour);
                if(Schema.sObjectType.Sequence_Action__c.fields.Expected_Execution_Date__c.isUpdateable()){
                    sa.Expected_Execution_Date__c = nextDate;
                }
                saToUpdate.add(sa);
            }	    
        }
        return saToUpdate;
    }
    
    /**
     * @description - update task parent sequence actions
     * @param taskList - tasks whose related sequence actions will be updated
     */
    public  static void UpdateIsPerformed(List<Task> taskList){
        Map<Id, Task> mapTasks = new Map<Id, Task>(taskList);
        Map<Id, Id> mapActionIdByTaskId = new Map<Id, Id>();
        for(Task task: taskList){
            mapActionIdByTaskId.put(task.Sequence_Action__c, task.Id);
        }
        
       	List<Sequence_Action__c> actionOnParticipantList=[Select Id,isActionPerformed__c,IsActionInitiated__c,Actual_Execution_Date__c,Lead_Id__c,Contact_Id__c,CadenceAction_Id__r.Index__c,Call_Duration__c  from Sequence_Action__c Where Id in: mapActionIdByTaskId.keyset() order by CadenceAction_Id__r.Index__c Limit :SequenceEngineHelper.getAvailableQueryRowsLimit()];
        for(Sequence_Action__c AOP:actionOnParticipantList){
            Task actionTask = mapTasks.get(mapActionIdByTaskId.get(AOP.Id));
            if(Schema.sObjectType.Sequence_Action__c.fields.isActionPerformed__c.isUpdateable()){
                AOP.isActionPerformed__c = True;
            }
            if(Schema.sObjectType.Sequence_Action__c.fields.Actual_Execution_Date__c.isUpdateable()){
                AOP.Actual_Execution_Date__c = System.now();
            }
            if(Schema.sObjectType.Sequence_Action__c.fields.Call_Duration__c.isUpdateable() && actionTask.ringdna__Call_Duration__c != null ){
                AOP.Call_Duration__c = actionTask.ringdna__Call_Duration__c;
            }
        }
        if(actionOnParticipantList != null && actionOnParticipantList.size() > 0){
            //FLS
            FLSHandler.isUpdateable('Sequence_Action__c');
            FLSHandler.isUpdateable('Sequence_Action__c', new List<String>{'isActionPerformed__c','Actual_Execution_Date__c'});
            CadenceUtil.tryUpdate(actionOnParticipantList, CadenceConstants.ALL_OR_NONE_TRUE);
        }
       
        Map<Id, List<Sequence_Action__c>> objToPartActMap = new Map<Id, List<Sequence_Action__c>>();
        objToPartActMap = TaskService.getAllParticipantActionsForTaskOwner(taskList);
        
        //Updating dates on remaining participant objects
        List<Sequence_Action__c> saToUpdate = new List<Sequence_Action__c>();
        for(Sequence_Action__c sa : actionOnParticipantList) {
            Id objId = sa.Lead_Id__c == null ? sa.Contact_Id__c : sa.Lead_Id__c;
            saToUpdate.addAll(CadenceService.updateActionOnParticipantExpectedDate(sa.Actual_Execution_Date__c, (Integer)sa.CadenceAction_Id__r.Index__c, objToPartActMap.get(objId)));
        }
        
        if(!saToUpdate.isEmpty()) {  
            //FLS
            if(Schema.sObjectType.Sequence_Action__c.isUpdateable()){
                update saToUpdate;
            }
        }
    }
        
    //This method mark action as IsPerformed = True if this is task and Task status is completed. 
   public static void updateIsPerformedOnActionOnParticipant(Set<Id> ids) {
        List<Task> taskList = CadenceSelector.getActionOnParticipantId(ids);   
        CadenceService.UpdateIsPerformed(taskList);
   }     
   
   public static void createandUpdateActionOnPart(List<Sequence_Action__c> listOfSeqActionToUpdate){
       if(listOfSeqActionToUpdate != null && listOfSeqActionToUpdate.size() > 0){
            CadenceUtil.tryUpsert(listOfSeqActionToUpdate, CadenceConstants.ALL_OR_NONE_FALSE);
        }
    }

    public static Object GetUpdateValue(Object value, String fieldType,Object multipicklistvalues){
        if(fieldType == CadenceConstants.MultiPickList){
            return (Object)((string)multipicklistvalues + (string)value + ';');
        }else{
            return value;
        }
    } 
    
    public static String formCampaignMemberSelectQuery(list<String> participantTypeToParentObjectList) {
		String query = 'Select ';
		Map <String, Schema.SObjectType> globalDescribedSchemaMap = Schema.getGlobalDescribe();
		List<Schema.SObjectField> CampaignMemberFieldList = PerformCadenceActionBatchHelper.getFieldListFromGlobalDescribedSchemaMap(globalDescribedSchemaMap, 'CampaignMember');
		
		query = PerformCadenceActionBatchHelper.addFieldsInQuery(query, globalDescribedSchemaMap, CampaignMemberFieldList, participantTypeToParentObjectList);
		
		query = query.subString(0, query.length() - 1);
		query += ' From CampaignMember WHERE ( CampaignMember.Contact.Cadence_ID__c != null OR CampaignMember.Lead.Cadence_ID__c != null ) Limit '+SequenceEngineHelper.getAvailableQueryRowsLimit();
		return query;
	}
}