export class ClientReference {
    public cr_id: number;
    public cr_client_name: string;
    public cr_contact_person: string;
    public cr_client_contact_no: string;
    public cr_proj_desc: string;
    public cr_technologies: string;
    public cr_proj_value: number;
    public cr_start_date: Date;
    public cr_end_date: Date;
    public cr_esco_id: string;
    public cr_last_updated_date: string;
    public cr_proj_duration : string;
    public cr_reference_letter: string;

    constructor(
        cr_id: number,
        cr_client_name: string,
        cr_contact_person: string,
        cr_client_contact_no: string,
        cr_proj_desc: string,
        cr_technologies: string,
        cr_proj_value: number,
        cr_start_date: Date,
        cr_end_date: Date,
        cr_esco_id: string,
        cr_proj_duration: string,
        cr_reference_letter: string,
        cr_last_updated_date: Date) {
        this.cr_id = cr_id;
        this.cr_client_name = cr_client_name;
        this.cr_contact_person = cr_contact_person;
        this.cr_client_contact_no = cr_client_contact_no;
        this.cr_proj_desc = cr_proj_desc;
        this.cr_technologies = cr_technologies;
        this.cr_proj_value = cr_proj_value;
        this.cr_start_date = cr_start_date;
        this.cr_end_date = cr_end_date;
        this.cr_proj_duration = cr_proj_duration;
        this.cr_esco_id = cr_esco_id;
        this.cr_reference_letter = cr_reference_letter;
      //  this.cr_last_updated_date = cr_last_updated_date;
    }

}

export class UserDataLogin {
    email: string;
    role: string;
    name:string;
    surname: string;
    escoid: string;
    token:string;
    exp?: number;
}

  
export class CompanyEquity {
    public ce_id: number;
    public ce_woman_owned: number;
    public ce_black_owned: number;
    public ce_youth_owned: number;
    public ce_esco_id: string;
    public ce_bee_equity_cert: string;
    public ce_last_updated_date: Date;

    constructor(
        ce_id: number,
        ce_woman_owned: number,
        ce_black_owned: number,
        ce_youth_owned: number,
        ce_esco_id: string,
        ce_bee_equity_cert: string,
        ce_last_updated_date: Date) {
        this.ce_id = ce_id;
        this.ce_woman_owned = ce_woman_owned;
        this.ce_black_owned = ce_black_owned;
        this.ce_youth_owned = ce_youth_owned;
        this.ce_bee_equity_cert = ce_bee_equity_cert;
        this.ce_esco_id = ce_esco_id;
        this.ce_last_updated_date = ce_last_updated_date;
    }

}

export class CompanyInformation {
    public ci_id: number;
    public ci_energy_man_exp: string;
    public ci_no_of_clients: number;
    public ci_fulltime_technicial: string;
    public ci_no_of_emp: string;
    public ci_emp_pro_qualification: string;
    public ci_com_exp_of_tech_pro: string;
    public ci_no_of_completed_projects: number;
    public ci_business_activities_provinces: string;
    public ci_no_of_references: string;
    public ci_esco_id: string;
    public ci_last_updated_date: Date;
    public ci_no_of_signed_references: number;

    constructor(
        ci_id: number,
        ci_energy_man_exp: string,
        ci_no_of_clients: number,
        ci_fulltime_technicial: string,
        ci_no_of_emp: string,
        ci_emp_pro_qualification: string,
        ci_com_exp_of_tech_pro: string,
        ci_no_of_completed_projects: number,
        ci_no_of_references: string,
        ci_business_activities_provinces: string,
        ci_esco_id: string,
        ci_no_of_signed_references: number,
        ci_last_updated_date: Date) {
        this.ci_id = ci_id;
        this.ci_no_of_signed_references =ci_no_of_signed_references;
        this.ci_energy_man_exp = ci_energy_man_exp;
        this.ci_no_of_clients = ci_no_of_clients;
        this.ci_fulltime_technicial = ci_fulltime_technicial;
        this.ci_no_of_emp = ci_no_of_emp;
        this.ci_emp_pro_qualification = ci_emp_pro_qualification;
        this.ci_com_exp_of_tech_pro = ci_com_exp_of_tech_pro;
        this.ci_no_of_completed_projects = ci_no_of_completed_projects;
        this.ci_business_activities_provinces = ci_business_activities_provinces;
        this.ci_no_of_references = ci_no_of_references;
        this.ci_esco_id = ci_esco_id;
        this.ci_last_updated_date = ci_last_updated_date;
    }

}

export class CurrentProject {
    public cp_id: number;
    public cp_client_name: string;
    public cp_contact_person: string;
    public cp_client_contact_no: number;
    public cp_proj_desc: string;
    public cp_proj_start_date: Date;
    public cp_proj_end_date: Date;
    public cp_proj_duration: string;
    public cp_proj_value: number;
    public cp_contact_email: number;
    public cp_esco_id: string;
    public cp_last_updated_date: Date;
    public daysDifference: number;

    constructor(
    cp_id: number,
    cp_client_name: string,
        cp_contact_person: string,
        cp_client_contact_no: number,
        cp_proj_desc: string,
        cp_proj_start_date: Date,
        cp_proj_end_date: Date,
        cp_proj_duration: string,
        cp_proj_value: number,
        cp_contact_email: number,
        cp_esco_id: string,
        daysDifference: number,
        cp_last_updated_date: Date) {
    this.cp_id = cp_id;
    this.cp_client_name = cp_client_name;
    this.cp_contact_person = cp_contact_person;
    this.cp_client_contact_no = cp_client_contact_no;
    this.cp_proj_desc = cp_proj_desc;
    this.cp_proj_start_date = cp_proj_start_date;
    this.cp_proj_end_date = cp_proj_end_date;
    this.cp_proj_duration = cp_proj_duration;
    this.cp_proj_value = cp_proj_value;
    this.cp_contact_email = cp_contact_email;
    this.cp_esco_id = cp_esco_id;
    this.cp_last_updated_date = cp_last_updated_date;
    this.daysDifference = daysDifference;
}

}

export class HistoricalExperience {
    public he_id: number;
    public he_client_name: string;
    public he_contact_person: string;
    public he_client_contact_no: number;
    public he_proj_desc: string;
    public he_proj_start_date: Date;
    public he_proj_end_date: Date;
    public he_proj_duration: string;
    public he_proj_value: number;
    public he_contact_email: number;
    public he_esco_id: string;
    public he_last_updated_date: Date;
    public he_reference_letter: string;

    constructor(
        he_id: number,
        he_client_name: string,
        he_contact_person: string,
        he_client_contact_no: number,
        he_proj_desc: string,
        he_proj_start_date: Date,
        he_proj_end_date: Date,
        he_proj_duration: string,
        he_proj_value: number,
        he_contact_email: number,
        he_esco_id: string,
        he_reference_letter: string,
        he_last_updated_date: Date) {
        this.he_id = he_id;
        this.he_client_name = he_client_name;
        this.he_contact_person = he_contact_person;
        this.he_client_contact_no = he_client_contact_no;
        this.he_proj_desc = he_proj_desc;
        this.he_proj_start_date = he_proj_start_date;
        this.he_proj_end_date = he_proj_end_date;
        this.he_proj_duration = he_proj_duration;
        this.he_proj_value = he_proj_value;
        this.he_contact_email = he_contact_email;
        this.he_esco_id = he_esco_id;
        this.he_last_updated_date = he_last_updated_date;
        this.he_reference_letter = he_reference_letter;
    }

}

export class KeyEmployee {
    public ke_id: number;
    public ke_full_names: string;
    public ke_id_type: string;
    public ke_id_no: string;
    public ke_no_yrs_firm: number;
    public ke_highest_education: string;
    public ke_add_traing_certs: string;
    public ke_no_of_yrs_energy: number;
    public ke_emp_cv: string;
    public ke_certification: string;
    public ke_esco_id: string;
    public ke_last_updated_date: string;

    constructor(
        ke_id: number,
        ke_full_names: string,
        ke_id_type: string,
        ke_id_no: string,
        ke_no_yrs_firm: number,
        ke_highest_education: string,
        ke_add_traing_certs: string,
        ke_no_of_yrs_energy: number,
        ke_emp_cv: string,
        ke_certification: string,
        ke_esco_id: string,
        ke_last_updated_date: Date) {
        this.ke_id = ke_id;
        this.ke_full_names = ke_full_names;
        this.ke_id_type = ke_id_type;
        this.ke_id_no = ke_id_no;
        this.ke_no_yrs_firm = ke_no_yrs_firm;
        this.ke_highest_education = ke_highest_education;
        this.ke_add_traing_certs = ke_add_traing_certs;
        this.ke_no_of_yrs_energy = ke_no_of_yrs_energy;
        this.ke_emp_cv = ke_emp_cv;
        this.ke_certification = ke_certification;
        this.ke_esco_id = ke_esco_id;
       // this.ke_last_updated_date = ke_last_updated_date;
    }

}

export class LoginUser {
    public lu_user_id: number;
    public lu_esco_id: string;
    public lu_cellNo: string;
    public lu_title: string;
    public lu_name: string;
    public lu_surname: string;
    public lu_email: string;
    public lu_password: string;
    public lu_isActive: boolean;
    public lu_role: string;
    public lu_last_updated_date: Date;

    constructor(
        lu_user_id: number,
        lu_esco_id: string,
        lu_title: string,
        lu_name: string,
        lu_cellNo: string,
        lu_surname: string,
        lu_email: string,
        lu_password: string,
        lu_isActive: boolean,
        lu_role: string,
        lu_last_updated_date: Date) {
        this.lu_user_id = lu_user_id;
        this.lu_esco_id = lu_esco_id;
        this.lu_name = lu_name;
        this.lu_title = lu_title;
        this.lu_surname = lu_surname;
        this.lu_email = lu_email;
        this.lu_cellNo = lu_cellNo;
        this.lu_password = lu_password;
        this.lu_isActive = lu_isActive;
        this.lu_role = lu_role;
        this.lu_last_updated_date = lu_last_updated_date;
    }

}

export class RegisteredUser {
    public lu_esco_id: string;
    public lu_user_id: string;
    public lu_title: string;
    public lu_name: string;
    public lu_surname: string;
    public lu_email: string;
    public lu_email_old: string;
    public ru_user_id: number;
    public ru_esco_id: string;
    public lu_cellNo: string;
    public ru_telNo: string;
    public ru_province: string;
    public ru_municipality: string;
    public ru_companyType: string;
    public ru_placeOfRegistration: string;
    public ru_streetAddress: string;
    public ru_companyRegNo: string;
    public ru_csdNumber: string;
    public ru_vatNumber: string;
    public ru_companyName: string;
    public ru_period: string;
    public ru_updateProfile: string;
    public ru_last_updated_date: Date;

    constructor(ru_user_id: number,
        lu_title: string,
        lu_name: string,
        lu_user_id: string,
        lu_surname: string,
        lu_email: string,
        lu_email_old: string,
        ru_esco_id: string,
        lu_cellNo: string,
        ru_telNo: string,
        ru_province: string,
        ru_municipality: string,
        ru_placeOfRegistration: string,
        ru_companyType: string,
        ru_streetAddress: string,
        ru_companyRegNo: string,
        ru_csdNumber: string,
        ru_vatNumber:string, 
        ru_companyName: string,
        ru_period: string,
        ru_updateProfile: string,
        ru_last_updated_date: Date) {
        this.ru_user_id = ru_user_id;
        this.lu_user_id = lu_user_id;
        this.ru_esco_id = ru_esco_id;
        this.lu_title = lu_title;
        this.lu_surname = lu_surname,
        this.lu_name = lu_name,
        this.lu_email = lu_email,
        this.lu_cellNo = lu_cellNo;
        this.ru_telNo = ru_telNo;
        this.ru_vatNumber = ru_vatNumber;
        this.ru_province = ru_province;
        this.lu_email_old = lu_email_old;
        this.ru_municipality = ru_municipality;
        this.ru_companyType = ru_companyType;
        this.ru_placeOfRegistration = ru_placeOfRegistration;
        this.ru_streetAddress = ru_streetAddress;
        this.ru_companyRegNo = ru_companyRegNo;
        this.ru_csdNumber = ru_csdNumber;
        this.ru_companyName = ru_companyName;
        this.ru_period = ru_period;
        this.ru_updateProfile = ru_updateProfile;
        this.ru_last_updated_date = ru_last_updated_date;
    }

}

export class SectorExperience {
    public se_id: number;
    public se_industry: string;
    public se_brief_desc: string;
	public se_completed_projects: number;
    public se_esco_id: string;
    public se_isOther: boolean;
    public se_last_updated_date: Date;

    constructor(
        se_id: number,
        se_industry: string,
        se_brief_desc: string,
		se_completed_projects: number,
        se_esco_id: string,
        se_isOther: boolean,
        se_last_updated_date: Date) {
        this.se_id = se_id;
        this.se_industry = se_industry;
        this.se_brief_desc = se_brief_desc;
		this.se_completed_projects = se_completed_projects;
        this.se_esco_id = se_esco_id;
        this.se_isOther = se_isOther;
        this.se_last_updated_date = se_last_updated_date;
    }

}

export class ServicesOffered {
    public so_id: number;
    public so_industry: string;
    public so_brief_desc: string;
	public so_completed_projects: number;
    public so_esco_id: string;
    public so_isOther: boolean;
    public so_last_updated_date: Date;

    constructor(
        so_id: number,
        so_industry: string,
        so_brief_desc: string,
		so_completed_projects: number,
        so_esco_id: string,
        so_isOther: boolean,
        so_last_updated_date: Date) {
        this.so_id = so_id;
        this.so_industry = so_industry;
        this.so_brief_desc = so_brief_desc;
		this.so_completed_projects = so_completed_projects;
        this.so_esco_id = so_esco_id;
        this.so_isOther = so_isOther;
        this.so_last_updated_date = so_last_updated_date;
    }

}

export class TechnologyClassification {
    public tc_id: number;
    public tc_tech_entpr_exp: string;
    public tc_years_team_exp: number;
    public tc_no_projs_completed: number;
    public tc_isOther: boolean;
    public tc_esco_id: string;
    public tc_last_updated_date: Date;

constructor (
    tc_id: number,
    tc_tech_entpr_exp: string,
    tc_years_team_exp: number,
    tc_no_projs_completed: number,
    tc_isOther: boolean,
    tc_esco_id: string,
    tc_last_updated_date: Date
) {
    this.tc_id = tc_id;
    this.tc_tech_entpr_exp = tc_tech_entpr_exp;
    this.tc_years_team_exp = tc_years_team_exp;
    this.tc_no_projs_completed = tc_no_projs_completed;
    this.tc_isOther = tc_isOther;
    this.tc_esco_id = tc_esco_id;
    this.tc_last_updated_date = tc_last_updated_date;
  }

}


export class TierResults {
    public tr_id: number;
    public ru_companyName: string;
    public tr_province: string;
    public tr_municipality: string;
    public tr_tierStatus: number;
    public tr_premilinary_score: number;
    public tr_isValidated: number;
    public tr_comments: string;
    public tr_esco_id: string;
    public tr_validator: string;
    public tr_isGenerated: number;
    public tr_last_updated_date: Date;
    public tr_validated_date: Date;
    public tr_date_validated: string;
    public ed_expiry_date: Date;

constructor (
    tr_id: number,
    ru_companyName: string,
    tr_province: string,
    tr_municipality: string,
    tr_tierStatus: number,
    tr_validator: string,
    tr_premilinary_score: number,
    tr_isValidated: number,
    tr_comments: string,
    tr_esco_id: string,
    tr_isGenerated: number,
    tr_last_updated_date: Date,
    tr_validated_date: Date,
    tr_date_validated: string,
    ed_expiry_date: Date,
) {
    this.tr_id = tr_id;
    this.ru_companyName = ru_companyName;
    this.tr_province = tr_province;
    this.tr_validator = tr_validator;
    this.tr_municipality = tr_municipality;
    this.tr_tierStatus = tr_tierStatus;
    this.tr_comments = tr_comments;
    this.tr_premilinary_score = tr_premilinary_score;
    this.tr_isValidated = tr_isValidated;
    this.tr_esco_id = tr_esco_id;
    this.tr_isGenerated = tr_isGenerated;
    this.tr_last_updated_date = tr_last_updated_date;
    this.tr_date_validated = tr_date_validated;
    this.tr_validated_date =tr_validated_date;
    this.ed_expiry_date = ed_expiry_date;
  }

}

export class CertificateInfo {
    public tgc_id: number;
    public ed_id: number;
    public tgc_confirmation_text: string;
    public tgc_updatedby: string;
    public ed_expiry_date: string;
    public ru_companyName: string;
    public tr_tierStatus: string;
    public companyData: any;
    public lu_email: string;
    public fu_path: string;

constructor (
    tgc_id: number,
    ed_id: number, 
    tgc_confirmation_text: string,
    tgc_updatedby: string,
    ed_expiry_date: string,
    ru_companyName: string,
    tr_tierStatus: string,
    companyData: any,
    lu_email: any,
    fu_path: any,
) {
    this.tgc_id = tgc_id;
    this.tgc_confirmation_text = tgc_confirmation_text;
    this.tgc_updatedby = tgc_updatedby;
    this.ed_expiry_date = ed_expiry_date;
    this.ed_id = ed_id;
    this.ru_companyName = ru_companyName;
    this.tr_tierStatus = tr_tierStatus;
    this.companyData = companyData;
    this.lu_email = lu_email;
    this.fu_path = fu_path;
  }
}


export class DocumentsUpload {
    public fu_id: number;
    public fu_name: string;
    public fu_path: string;
    public fu_size: string;
    public fu_type: string;
    public fu_upload_date: string;
    public fu_esco_id: string;

constructor (
    fu_id: number,
    fu_name: string,
    fu_path: string,
    fu_size: string,
    fu_type: string,
    fu_esco_id: string,
    fu_upload_date: string,
) {
    this.fu_id = fu_id;
    this.fu_name = fu_name;
    this.fu_path = fu_path;
    this.fu_size = fu_size;
    this.fu_type = fu_type;
    this.fu_esco_id = fu_esco_id;
    this.fu_upload_date = fu_upload_date;

  }

}


export class CertificateInfoData {
    public tgc_id: number;
    public tgc_confirmation_text: string;
    public tgc_expiry_date: string;
    public tgc_updatedby: string;
    public tr_id: number;
    public tr_esco_id: string;
    public tr_tierStatus: string;
    public tr_isGenerated: string;
    public tr_validator: string;
    public tr_comments: string;
    public tr_validated_date: string;
    public tr_premilinary_score: string;
    public tr_isValidated: string;
    public tr_last_updated_date: string;
    public ru_user_id: number;
    public ru_esco_id: string;
    public ru_telNo: string;
    public ru_province: string;
    public ru_municipality: string;
    public ru_postalAddress: string;
    public ru_streetAddress: string;
    public ru_companyRegNo: string;
    public ru_csdNumber: string;
    public ru_isWomanOwned: string;
    public ru_isYouthOwned: string;
    public ru_companyName: string;
    public ru_bee_equity_cert: string | null;
    public ru_last_updated_date: string;
    public tgc_esco_id: string;
    
      

constructor (
    tr_id: number,
    tr_esco_id: string,
    tr_tierStatus: string,
    tr_isGenerated: string,
    tr_validator: string,
    tr_comments: string,
    tr_validated_date: string,
    tr_premilinary_score: string,
    tr_isValidated: string,
    tr_last_updated_date: string,
    ru_user_id: number,
    ru_esco_id: string,
    ru_telNo: string,
    ru_province: string,
    ru_municipality: string,
    ru_postalAddress: string,
    ru_streetAddress: string,
    ru_companyRegNo: string,
    ru_csdNumber: string,
    ru_isWomanOwned: string,
    ru_isYouthOwned: string,
    ru_companyName: string,
    ru_bee_equity_cert: string | null,
    ru_last_updated_date: string,
    tgc_id: number,
    tgc_esco_id: string,
    tgc_confirmation_text: string,
    tgc_expiry_date: string,
    tgc_updatedby: string
    
) {
    this.tr_id = tr_id;
  this.tr_esco_id = tr_esco_id;
  this.tr_tierStatus = tr_tierStatus;
  this.tr_isGenerated = tr_isGenerated;
  this.tr_validator = tr_validator;
  this.tr_comments = tr_comments;
  this.tr_validated_date = tr_validated_date;
  this.tr_premilinary_score = tr_premilinary_score;
  this.tr_isValidated = tr_isValidated;
  this.tr_last_updated_date = tr_last_updated_date;
  this.ru_user_id = ru_user_id;
  this.ru_esco_id = ru_esco_id;
  this.ru_telNo = ru_telNo;
  this.ru_province = ru_province;
  this.ru_municipality = ru_municipality;
  this.ru_postalAddress = ru_postalAddress;
  this.ru_streetAddress = ru_streetAddress;
  this.ru_companyRegNo = ru_companyRegNo;
  this.ru_csdNumber = ru_csdNumber;
  this.ru_isWomanOwned = ru_isWomanOwned;
  this.ru_isYouthOwned = ru_isYouthOwned;
  this.ru_companyName = ru_companyName;
  this.ru_bee_equity_cert = ru_bee_equity_cert;
  this.ru_last_updated_date = ru_last_updated_date;
  this.tgc_id = tgc_id;
  this.tgc_esco_id = tgc_esco_id;
  this.tgc_confirmation_text = tgc_confirmation_text;
  this.tgc_expiry_date = tgc_expiry_date;
  this.tgc_updatedby = tgc_updatedby;

  }

}


export interface HistoryData {

  ru_user_id: string;
  ru_esco_id: string;
  ru_telNo: string;
  ru_province: string;
  ru_municipality: string;
  ru_companyType: string;
  ru_placeOfRegistration: string;
  ru_streetAddress: string;
  ru_companyRegNo: string;
  ru_vatNumber: string;
  ru_csdNumber: string;
  ru_companyName: string;
  ru_last_updated_date: Date;
  ru_period: string;
  cr_id: string;
  cr_client_name: string;
  cr_contact_person: string;
  cr_client_contact_no: string;
  cr_proj_desc: string;
  cr_technologies: string;
  cr_proj_value: string;
  cr_start_date: Date;
  cr_end_date: Date;
  cr_esco_id: string;
  cr_last_updated_date: Date;
  cp_id: string;
  cp_client_name: string;
  cp_contact_person: string;
  cp_client_contact_no: string;
  cp_proj_desc: string;
  cp_proj_start_date: Date;
  cp_proj_end_date: Date;
  cp_proj_value: string;
  cp_contact_email: string;
  cp_esco_id: string;
  cp_last_updated_date: Date;
  he_id: string;
  he_client_name: string;
  he_contact_person: string;
  he_client_contact_no: string;
  he_proj_desc: string;
  he_proj_start_date: Date;
  he_proj_end_date: Date;
  he_proj_value: string;
  he_contact_email: string;
  he_esco_id: string;
  he_last_updated_date: Date;
  ci_id: string;
  ci_energy_man_exp: string;
  ci_no_of_clients: string;
  ci_no_of_emp: string;
  ci_no_of_references: string;
  ci_fulltime_technicial: string;
  ci_emp_pro_qualification: string;
  ci_com_exp_of_tech_pro: string;
  ci_business_activities_provinces: string;
  ci_esco_id: string;
  ci_last_updated_date: Date;
  ce_id: string;
  ce_woman_owned: string;
  ce_black_owned: string;
  ce_youth_owned: string;
  ce_esco_id: string;
  ce_last_updated_date: Date;
  ie_id: string | null;
  ie_industry: string | null;
  ie_no_completed_projects: string | null;
  ie_isOther: string | null;
  ie_brief: string | null;
  ie_esco_id: string | null;
  ie_last_updated_date: Date;
  tr_id: string;
  tr_esco_id: string;
  tr_tierStatus: string;
  tr_isGenerated: string;
  tr_validator: string;
  tr_comments: string;
  tr_validated_date: Date;
  tr_isValidated: string;
  tr_last_updated_date: Date;
  se_id: string;
  se_industry: string;
  se_isOther: string;
  se_esco_id: string;
  se_last_updated_date: Date;
  so_id: string;
  so_industry: string;
  so_isOther: string;
  so_esco_id: string;
  so_last_updated_date: Date;
  tc_id: string;
  tc_tech_entpr_exp: string;
  tc_no_projs_completed: string | null;
  tc_isOther: string;
  tc_esco_id: string;
  tc_last_updated_date: Date;
  latest_history_date: Date;
  tr_date_validated: Date;
}


export class ResultsDescriptions {
    public ur_id: number;
    public ur_description: string;
    public ur_columns: string;
    public ur_file_type: string;
    public ur_uploaded_date: Date;
    public ur_last_updated_date: Date;

    constructor(
        ur_id: number,
        ur_description: string,
        ur_columns: string,
        ur_file_type: string,
        ur_uploaded_date: Date,
        ur_last_updated_date: Date) {
        this.ur_id = ur_id;
        this.ur_description = ur_description;
        this.ur_columns = ur_columns;
        this.ur_file_type = ur_file_type;
        this.ur_uploaded_date = ur_uploaded_date;
        this.ur_last_updated_date = ur_last_updated_date;
    }
}

export interface AssessmentInfoCriteria {
    aic_man_exp: number | null;
    aic_man_exp_percentage: number | null;
    aic_prev_project: number | null;
    aic_prev_project_percentage: number | null;
    aic_ref_eer: number | null;
    aic_ref_eer_percentage: number | null;
    aic_ref_prev_project: number | null;
    aic_ref_prev_project_percentage: number | null;
    aic_keyempl: number | null;
    aic_keyempl_percentage: number | null;
    aic_keyempl_qualification: number | null;
    aic_keyempl_qualification_percentage: number | null;
    aic_team_experience: number | null;
    aic_team_experience_percentage: number | null;
    aic_ref_eer_comms: string | null;
    aic_ref_prev_project_comms: string | null;
    aic_keyempl_qualification_comms: string | null;
    aic_total_percentage: number | null;
    aic_total_score: number | null;
    aic_esco_id: string;
  }