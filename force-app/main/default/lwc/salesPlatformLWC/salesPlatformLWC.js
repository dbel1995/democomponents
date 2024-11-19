import { LightningElement, api, wire, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import UserId from '@salesforce/user/Id';
import getContacts from '@salesforce/apex/SalesPlatformCTRL.getRelatedContacts';
import logCallforContact from '@salesforce/apex/SalesPlatformCTRL.logCall';
import createEventforContact from '@salesforce/apex/SalesPlatformCTRL.createEvent';
import sendMailforContact from '@salesforce/apex/SalesPlatformCTRL.sendMail';
import searchContacts from '@salesforce/apex/SalesPlatformCTRL.getRelatedContactsFromSearch';
import searchContactsForAddCon from '@salesforce/apex/SalesPlatformCTRL.getSearchedContacts';
import getContactsToAdd from '@salesforce/apex/SalesPlatformCTRL.getContactsToAdd';
import addContact2Campaign from '@salesforce/apex/SalesPlatformCTRL.addContactToCampaign';
import deleteCon from '@salesforce/apex/SalesPlatformCTRL.delContact';
import getMailTemplate from '@salesforce/apex/SalesPlatformCTRL.getMailTemplate';
import setMailTemplate from '@salesforce/apex/SalesPlatformCTRL.getSubandBodyFromMailTemplate';


export default class SalesPlatformLWC extends LightningElement {
@api recordId;
@track contacts;
@track allContacts;
@track allcontactsToAdd;
@track gridData;
@track contactsToAdd;
@track searchByvalue;
@track conSearchValue;
@track mailTemplates = [];
showModal = false;
showCall = false;
showEvent = false;
showMail = false;
conName = '';
@track contactId;
relAccId = '';
actionValLogCall = '';
subValLogCall = '';
descValLogCall = '';
modalCase = '';
evtStartDate;
evtEndDate;
contactIds;
@track sortBy;
@track sortDirection;
@track searchedContacts;
@track valueForAddConSearch;
@track searchValueForAddConSearch;
@track searchBy = 'None';
@track searchKey = '';
@track showaddContactModal;
@track selectedContact = [];
@track selectedRows;
@track error;
@track tableRows;
@track flowApiName;
@track flowInputVariables;
@track handleFlowStatusChange;
@track columns = [
    { label: 'Name', fieldName: 'Name', type: 'text', sortable: 'true',},
    { label: 'Title', fieldName: 'Title', type: 'Text', editable: true, sortable: 'true'},
    { label: 'Account', fieldName: 'Account_Name_Formula__c', type: 'Text', sortable: 'true'},
    { label: 'Industry', fieldName: 'ClientIndustry__c', type: 'Text', editable: true, sortable: 'true'},
    { label: 'Email', fieldName: 'Email', type: 'Text', editable: true, sortable: 'true'},
    { label: 'Business Phone', fieldName: 'MobilePhone', type: 'Text', editable: true, sortable: 'true'},
    { label: 'Location', fieldName: 'Account_Branch__c', type: 'Text',sortable: 'true'},
    { label: 'Last Activity Date', fieldName: 'LastActivityDate', type: 'Text',sortable: 'true'},
    { label: 'Notes', fieldName: 'Notes_Sales_Platform__c', type: 'Text', editable: true},
    { label: 'People Status', fieldName: 'People_Status__c', type: 'Text', editable: true,sortable: 'true'},
    { label: 'Client Status', fieldName: 'Client_Status__c', type: 'Text', editable: true, sortable: 'true'},
    { label: 'Call Status', type: 'button', typeAttributes: {
        iconName: 'utility:outbound_call',
        variant: {fieldName: 'Call_Status__c'},}
    }
]
@track showSearch = false;
@track showAddConSearch = false;
@track options =[
        { label : 'None', value: 'None'},
        { label: 'Industry', value: 'ClientIndustry__c' },
        { label: 'Account', value: 'Account_Name_Formula__c' },
        { label: 'Location', value: 'Account_Branch__c' }
    ]
@track optionsForAddConSearch =[
        { label : 'None', value: 'None'},
        { label: 'Name', value: 'Name' },
        { label: 'Account Name', value: 'Account_Name_Formula__c' }
    ]
@track CallActionTakenPicklistValues = [
    {label : 'Left Message', value : 'Left Message'},
    {label : 'Adchase	', value : 'Adchase	'},
    {label : 'Client WIP Call', value : 'Client WIP Call'},
    {label : 'Float Candidate Call', value : 'Float Candidate Call'},
    {label : 'Float Call - CV Requested', value : 'Float Call - CV Requested'},
    {label : 'Marketing Call	', value : 'Marketing Call	'},
    {label : 'Marketing Call - Registered for Event	', value : 'Marketing Call - Registered for Event	'},
    {label : 'Marketing Call - Visit booked	', value : 'Marketing Call - Visit booked'},
    {label : 'Job order record created	', value : 'Job order record created	'},
]
@track EventActionTakenPicklistValues = [
    {label : 'Event - Meet & Greet', value : 'Event - Meet & Greet'},
    {label : 'Visit - Buying Platform	', value : 'Visit - Buying Platform	'},
    {label : 'Visit - Gift Delivered	', value : 'Visit - Gift Delivered	'},
    {label : 'Visit - Marketing Platform	', value : 'Visit - Marketing Platform	'},
    {label : 'Visit - p2p post	', value : 'Visit - p2p post	'},
    {label : 'Visit - Virtual	', value : 'Visit - Virtual	'},
    {label : 'Visit - virtual p2p post	', value : 'Visit - virtual p2p post	'},
    {label : 'Visit - Working Platform	', value : 'Visit - Working Platform	'},
]
@wire(getContacts, {recordId: '$recordId'})
contactsData(result){
        /**The code fetches contacts using @wire with a dynamic recordId. 
        On success, it populates this.contacts and this.gridData while clearing errors. 
        On failure, it clears the contacts */
}
@wire(getMailTemplate)mailTemplate(result){
   /**
     The code uses the @wire adapter to fetch email templates via getMailTemplate. It processes
     the returned templates (result.data) by iterating through each template, extracting its Name,
     Id, Subject, and Body, and appending these details as objects to the mailTemplates array.
     
    */

}
doSorting(event){
    /**
     The doSorting method captures the column field name and sort direction from a user-triggered
     event, updates the corresponding component properties (sortBy and sortDirection), and calls 
     the sortData method to sort the data accordingly.
     */
}
sortData(fieldname, direction){
    /**\
     
   The sortData method sorts the contacts array based on a specified field and direction
   (ascending or descending). It handles null values and updates contacts with the sorted data.
     */
}
openSearch(event){
   /**
    The openSearch method updates the searchBy property based on user input. If the input is
    'None,' it hides the search (showSearch = false) and resets contacts to the original data
    (gridData). Otherwise, it enables search functionality (showSearch = true).
    */
}
openSearchForAddConSearch(event){
   /**
    The openSearchForAddConSearch method updates the searchBy property based on user input.
    If the input is 'None,' it disables the additional contact search (showAddConSearch = false).
    Otherwise, it enables it (showAddConSearch = true).
    */
}
closeSearchForAddConSearch(event){
  /**
   The closeSearchForAddConSearch method resets the valueForAddConSearch to 'None', clears
   the searchValueForAddConSearch, and hides the additional contact search.
   */
}
getSearchValue(event){
     // Storing the value from the input field into the searchKey variable
}
getSearchValueForAddConSearch(event){
     // Storing the value from the input field into the searchKey variable for adding contacts
}
searchContactForAddCon(event){
   /**
    The searchContactForAddCon method searches for contacts based on searchBy and
    searchKey. On success, it stores the results in contactsToAdd and clears errors. On failure, it
    stores the error and shows an alert.
    */
}
searchContact(event){
    /**
     The searchContact method searches for contacts using recordId, searchBy, and
     searchKey. On success, it updates contacts with the result and clears errors. On failure, 
     it sets the error and displays an alert, while clearing the contacts.
     */
}
handleSave(event){
  /**
   The handleSave method saves draft changes by updating records. It maps the draft values to
   updateRecord calls, waits for all updates using Promise.all, and shows a success toast upon
   success. If an error occurs, it displays an error message in a toast. The draft values are 
   cleared after the process completes.
   */
}
ShowToast(title, message, variant, mode){
   /**
    The ShowToast method creates and dispatches a ShowToastEvent to display a toast notification
    with a specified title, message, variant (e.g., success or error), and mode (e.g., dismissable).
    */
}
addContact(event){
   /**
   The addContact method retrieves contacts to add using the getContactsToAdd function, stores
   the result in contactsToAdd, and then displays a modal for adding contacts.
    */
}
closeAddContact(event){
 /**
  The closeAddContact method resets the search fields,hides the add contact search, and closes
  the add contact modal .
  */
}
selectContactToAdd(event){
    // Adds the selected contact's value to the selectedContact array when a contact is selected
}
addContactToCampaign(){
   /**
    The addContactToCampaign function sends selected contacts to a campaign by calling the
    method with the record ID and selected contact IDs. After the operation, it refreshes the 
    allContacts data using refreshApex. Finally, it closes the contact addition modal.
    */
}

deleteContact(event){ 
   /**
  The deleteContact function allows users to delete selected contacts from a grid. It first retrieves
  the selected rows,checks if any contacts are selected,and creates an array of their IDs. 
  Then, it calls the method to delete the selected contacts, passing their IDs and the record ID.
  If successful, it shows a success toast and refreshes the contact data. If an error occurs, it
  displays an error toast with the message.
    */
}
viewCon(){
   /**
The viewCon function allows users to open a selected contact's detail page. It first checks 
if a single contact is selected. If so, it retrieves the contact's ID and constructs a URL 
to the contact's detail view page. Finally, it opens that page in a new tab.
    */
}
viewAcc(){
  /**
   The viewAcc function allows users to open the account associated with a selected contact.
   It checks if a single contact is selected and retrieves the related account ID. If an 
   account is found, it opens the account's detail page in a new tab. If no account is found 
   or multiple contacts are selected, it shows an alert.
   */
}
logCall(){
    /**
     The logCall function allows users to log a call for a selected contact. It ensures only 
     one contact is selected. If valid, it displays a modal for logging the call, setting related
     contact and account IDs. It also controls the visibility of other modal options (e.g., event, mail). 
     Alerts are shown if no contact or more than one contact is selected.
     */
}
createEvent(){
    /**
     The createEvent function allows users to create an event for a selected contact. It ensures 
     that only one contact is selected. If valid, it displays a modal for event creation and sets 
     the contact ID. The event start and end times are set to the current date and one hour later,
     respectively. Other modal options (call, mail) are hidden during this process. Alerts are 
     shown if no contact or more than one contact is selected.
     */
}
sendMail(){
    /**
     The sendMail function allows users to send an email to a selected contact. It checks if one or
     more contacts are selected and proceeds if valid. If a valid selection is made, it collects the
     contact IDs and opens a modal for sending mail, hiding other modal options (event, call). An alert
     is displayed if no contact is selected or if multiple contacts are selected.
     */
}
fetchActionValueLogCall(event){
    /**
     The fetchActionValueLogCall function captures and stores the value from input field
     into the actionValLogCall property.
     */
}
fetchSubjectLogCall(event){
    /**
     The fetchSubjectLogCall function captures and stores the value from an input field
      into the subValLogCall property.
     */
}
fetchDescLogCall(event){
    /**
     The fetchDescLogCall function captures and stores the value from an input field 
     into the descValLogCall property.
     */
}
fetchEvtStartDT(event){
  /**
   The fetchEvtStartDT function captures the event start date from the event input,
   stores it in the evtStartDate property, and sets the eventEndDt property to the 
   same value as the start date.
   */
}
fetchEvtEndDT(event){
  /**
   The fetchEvtEndDT function captures the event end date from the event input and 
   stores it in the evtEndDate property.
   */
}
closeModal(){
   /**
    The closeModal function hides the modaland resets the visibility of event, call, and 
    mail sections, along with clearing the modalCase property.
    */
}
submitModal(){
    /**]
     The submitModal function handles form submissions for creating events, sending emails, or
     logging calls. It validates required fields and calls the respective backend function
     (createEventforContact, sendMailforContact, or logCallforContact). Upon success, a
     toast message is shown, and the modal is closed. If validation fails, an alert prompts 
     the user to fill in missing fields.
     */
}
setTemplate(event){
   /**  
   The setTemplate function sets the email template by capturing the selected template ID from
   the event. It then retrieves the template's subject and body using the setMailTemplate method,
   populating a textarea with the template body. If an error occurs, it is logged and shown in an
   alert.

    */
}
}