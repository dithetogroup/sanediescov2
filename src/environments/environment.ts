const baseUrl = 'http://localhost/connectdbsanedi';
const dynamicBaseUrl = 'http://localhost';

export const environment = {
  production: false,
  baseUrl,
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
    StepUpdatePreviousProjects: baseUrl + '/step-update-previous-projects.php'
  }
};
