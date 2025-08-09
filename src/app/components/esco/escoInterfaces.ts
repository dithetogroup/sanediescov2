export interface CompanyInfo {
    ci_id: number;
    ci_esco_id: string;
    ci_energy_man_exp: string;
    ci_com_exp_of_tech_pro: string;
    ci_business_activities_provinces: string;
    ci_created_at: string;
    ci_updated_date: string;
    fu_name?: string;
    fu_path?: string;
    fu_category?: string;
  }

  export class UserDataLogin {
    email: string;
    role: string;
    name:string;
    surname: string;
    escoid: string;
    token:string;
    title: string;
    firstName: string;
    lastName: string;
    exp?: number;
    companyType: string;
    companyName: string;

}

  