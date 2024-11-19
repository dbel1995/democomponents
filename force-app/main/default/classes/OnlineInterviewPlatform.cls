public class OnlineInterviewPlatform {

@testVisible
Class InterviewWrapper {
   @AuraEnabled public list<String> selectedInterviewees{get;set;}
   @AuraEnabled public String job{get;set;}
   @AuraEnabled public String interviewMessage{get;set;}
   @AuraEnabled public string interviewEndDate{get;set;}
   @AuraEnabled public list<string> interviewQuestions{get;set;}
   @AuraEnabled public Integer attempts{get;set;}
    }

   
    @AuraEnabled
    public static string publishInterview(InterviewWrapper unWrapData){
        string InvitationId;//store id of draft invitation created
        //to arrange the draft invitation in the platform
        
        //pass list of question to the platform and
        //save them there till interview is arranged and
        //get list of id of those question inside the platform
        
        //add the above saved questions to the draft interview
        //add details of interviewees to the draft interview
        
        //retrieve the custom metadata that stores the credentials of the account in the interview platform
        
        //process of publishing draft interview without sending link directly 
        //from platform but saving  link against application 
       //getting links of published interview for different applications
        }

         //save the link of interview against every application which was used 
         //based on firstname, lastname and email address of applicant(candidate)
         //and use it later to sent out as part of custom templates.
        }


        //update selected Candidates
       
        //to delete all the questions that were saved in platform 
        //for the purpose of current interview
    }
}