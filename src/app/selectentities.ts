
export class CompanyType {
    public ct_id: number;
    public ct_name: string;
    public ct_last_updated_date: Date;

    constructor(
        ct_id: number,
        ct_name: string,
        ct_last_updated_date: Date) {
        this.ct_id = ct_id;
        this.ct_name = ct_name;
        this.ct_last_updated_date = ct_last_updated_date;
    }

}

export class companyEquityValues {
    public ce_id: number;
    public ce_name: string;
    public ce_last_updated_date: Date;

    constructor(
        ce_id: number,
        ce_name: string,
        ce_last_updated_date: Date) {
        this.ce_id = ce_id;
        this.ce_name = ce_name;
        this.ce_last_updated_date = ce_last_updated_date;
    }

}

export class servicesOfferedValues {
    public so_id: number;
    public so_name: string;
    public so_industry: string;
    public so_last_updated_date: Date;

    constructor(
        so_id: number,
        so_name: string,
        so_industry: string,
        so_last_updated_date: Date) {
        this.so_id = so_id;
        this.so_name = so_name;
        this.so_industry = so_industry;
        this.so_last_updated_date = so_last_updated_date;
    }
}

export class techClassificationsValues {
    public tc_id: number;
    public tc_name: string;
    public tc_last_updated_date: Date;

    constructor(
        tc_id: number,
        tc_name: string,
        tc_last_updated_date: Date) {
        this.tc_id = tc_id;
        this.tc_name = tc_name;
        this.tc_last_updated_date = tc_last_updated_date;
    }
}

export class sectorExperienceValues {
    public se_id: number;
    public se_name: string;
    public se_last_updated_date: Date;

    constructor(
        ses_id: number,
        se_name: string,
        se_last_updated_date: Date) {
        this.se_id = ses_id;
        this.se_name = se_name;
        this.se_last_updated_date = se_last_updated_date;
    }
}

export class fileUploadTypesValues {
    public uc_id: number;
    public uc_name: string;
    public uc_last_updated_date: Date;

    constructor(
        uc_id: number,
        uc_name: string,
        uc_last_updated_date: Date) {
        this.uc_id = uc_id;
        this.uc_name = uc_name;
        this.uc_last_updated_date = uc_last_updated_date;
    }
}


export class educationLevelValues {
    public el_id: number;
    public el_name: string;
    public el_last_updated_date: Date;

    constructor(
        el_id: number,
        el_name: string,
        el_last_updated_date: Date) {
        this.el_id = el_id;
        this.el_name = el_name;
        this.el_last_updated_date = el_last_updated_date;
    }
}

export class generateCertValues {
    public gc_id: number;
    public gc_name: string;
    public gc_last_updated_date: Date;

    constructor(
        gc_id: number,
        gc_name: string,
        gc_last_updated_date: Date) {
        this.gc_id = gc_id;
        this.gc_name = gc_name;
        this.gc_last_updated_date = gc_last_updated_date;
    }
}


 export class selectFormData {
    public companyTypes: string;
    public fileTypes: string;
    public techClassification: string;
    public sectorExperience: string;
    public serviceOffered: string;
    public educationLevel: string;
    public companyEquity: string;
    public certContent: string;

constructor (
    companyTypes: string,
    fileTypes: string,
    techClassification: string,
    sectorExperience: string,
    serviceOffered: string,
    educationLevel: string,
    companyEquity: string,
    certContent: string,
) {

    this.companyTypes = companyTypes;
    this.fileTypes = fileTypes;
    this.techClassification = techClassification;
    this.sectorExperience = sectorExperience;
    this.serviceOffered = serviceOffered;
    this.educationLevel = educationLevel;
    companyEquity = companyEquity;
    certContent = certContent;


  }

 }
