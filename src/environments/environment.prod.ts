const baseUrl = 'https://tier.sanediesco.org.za/sanedidbconnect';
const dynamicBaseUrl = 'https://tier.sanediesco.org.za';

export const environment = {
  production: true,
  baseUrl,
  dynamicBaseUrl,
  urlEndPoints: {
    StepSaveCompanyInformation: baseUrl + '/step-save-company-information.php',
  }
};
