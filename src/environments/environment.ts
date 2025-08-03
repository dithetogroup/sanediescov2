const baseUrl = 'http://localhost/connectdbsanedi';
const dynamicBaseUrl = 'http://localhost';
const filedownloadUrl = "'http://localhost/connectdbsanedi/uploads"

export const environment = {
  production: false,
  baseUrl,
  filedownloadUrl,
  dynamicBaseUrl,
  urlEndPoints: {
    
    //company information
    StepSaveCompanyInformation: baseUrl + '/step-save-company-information.php',
    StepGetCompanyInformation: baseUrl + '/step-get-company-information.php',
    StepGetCompanyInformationCICPFILE: baseUrl + '/step-get-company-information-cicpfile.php',
    getCompanyInfoHistory: baseUrl + '/get-company-information-history.php',

    //previous projects
    StepSaveCompanyPreviousProjects: baseUrl + '/step-save-previous-projects.php',
    StepGetPreviousProjects: baseUrl + '/step-get-previous-projects.php',
    StepDeletePreviousProject: baseUrl + '/step-delete-previous-projects.php',
    StepUpdatePreviousProjects: baseUrl + '/step-update-previous-projects.php',

    //client References
    StepSaveClientReferences: baseUrl + '/step-save-client-references.php',
    StepDeleteClientReferences: baseUrl + '/step-delete-client-references.php',
    StepGetClientReferences: baseUrl + '/step-get-client-references.php',
    StepUpdateClientReferences: baseUrl + '/step-update-client-references.php',

    //company equity
    StepSaveCompanyEquiity: baseUrl + '/step-save-company-equity.php',
    StepGetCompanyEquiity: baseUrl + '/step-get-company-equity.php',


  }
};
