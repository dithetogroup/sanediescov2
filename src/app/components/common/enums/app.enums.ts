import { Component } from '@angular/core';

export enum EnumYearsInESCoBusiness {
    One = '1',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Eleven = '11',
    Twelve = '12',
    Thirteen = '13',
    Fourteen = '14',
    fiveteen = '15',
    plus = '15 plus',
}

export enum EnumMonths {
    One = '1 Month',
    Two = '2 Months',
    Three = '3 Months',
    Four = '4 Months',
    Five = '5 Months',
    Six = '6 Months',
    Seven = '7 Months',
    Eight = '8 Months',
    Nine = '9 Months',
    Ten = '10 Months',
    Eleven = '11 Months',
    Twelve = '12 Months',
    plus = '12 Months +',
}

export enum EnumNoOfClients {
    One = '1',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Eleven = '10 plus',
}


export enum EnumRelevantDegrees {
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Eleven = '11',
  Twelve = '12',
  Thirteen = '13',
  Fourteen = '14',
  Fifteen = '15',
  Sixteen = '16',
  Seventeen = '17',
  Eighteen = '18',
  Nineteen = '19',
  Twenty = '20',
  TwentyOne = '21',
  TwentyTwo = '22',
  TwentyThree = '23',
  TwentyFour = '24',
  TwentyFive = '25',
  TwentySix = '26',
  TwentySeven = '27',
  TwentyEight = '28',
  TwentyNine = '29',
  Thirty = '30',
  Thirtyplus = '30 plus',
}

export enum EnumTeamExperience {
    key1 = '3 - 10 years',
    key2 = '10 - 15 years',
    key3 = 'more than 15 years'
}

export enum EnumIndustries {
    COMMECIAL = 'Commercial',
    HEAVYINDUSTRY ='Heavy Industrial / Mining',
    LIGHTINDUSTRY = 'Light Industry',
    PUBLICINFRA = 'Public Infrastructure',
    RESIDENTIAL = 'Residential',
    OTHER = 'Other',
}

export enum EnumTechClassification {
    LED_Public_Lighting_Buildings = 'Light-emitting Diode (LED) for public lighting and buildings',
    BuildingLighting = 'Building Lighting',
    High_Efficient_HVAC_Systems = 'High efficient HVAC',
    High_Efficient_Water_Heating = 'High efficient water heating systems',
    High_Efficient_Steam_Boilers = 'High efficient steam boilers / systems',
    High_Efficient_Motors_Pumps = 'High-efficient motors and pumps for fresh and wastewater',
    Water_Wastewater_Treatment = 'Water and Wastewater Treatment',
    Cogeneration = 'Cogeneration',
    Cogeneration_Biogas = 'Cogeneration (with biogas)',
    Biogas = 'Biogas',
    Energy_Management_Smart_Metering = 'Energy management systems and Smart Metering',
    Small_Scale_Solar_PV = 'Small-Scale Solar PV systems',
    Other = 'Other',
}


export enum EnumProjectDuration {
    TWENTYONEDAYS = '21 Days',
    ONEMONTH = '1 Month',
    THREEYEARS = '3 Years',
    OTHER = 'Other'
}

export enum EnumCompanyEquity {
    WOMANOWNED = 'Woman Owned',
    BLACKOWNED = 'Black Owned',
    YOUTHOWNED = 'Youth Owned',
}

export enum EnumEquityPercentage {
    WP1 ='less than 5% - 0%',
    WP2 = '5% - 25%',
    WP3 = '26% - 50%',
    WP4 = '51% - 75%',
    WP5 = '76% - 100%',
}

export enum EnumClientReferences {
    CogenerationWithBiogas = 'Cogeneration with biogas',
    EnergyManagementSystems = 'Energy management systems & smart metering',
    SmallScaleSolarPVSystems = 'Small-scale Solar PV systems',
    PublicLightingAndBuilding = 'Public lighting & building (LED)',
    HighEfficientWaterHeating = 'High efficient water heating system',
    HighEfficientHVAC = 'High efficient heating ventilation and air condition',
    HighEfficientMotorsAndPumps = 'High efficient motors and pumps',
    HighEfficientSteamBoilers = 'High efficient steam boilers / systems',
    OTHER = 'Other',
}


export enum EnumEducationLevel {
  NQF = 'NQF',
  Grade12 = 'Grade 12',
  Diploma = 'Diploma',
  Degree = 'Degree',
  Honours = 'Honours',
  Masters = 'Masters',
  Doctorate = 'Doctorate',
  PHD = 'PHD',
  Other = 'Other'
}

export enum EnumEnergyServiceOptions {

    Energy_Auditing  = 'Energy Auditing ',
    M_V_of_Energy_Savings = 'M&V of Energy Savings',
    Engineering_Design = 'Engineering Design',
    Project_Implementation = 'Project Implementation',
    Energy_Management = 'Energy Management',
    Issuing_of_Energy_Performance_Certificates = 'Issuing of Energy Performance Certificates',
    Energy_Performance_Contracts = 'Energy Performance Contracts',
    Financial_modeling_of_energy_projects = 'Financial modeling of energy projects',
    Financing_of_Energy_Projects = 'Financing of Energy Projects',
    Full_ESCo_Offering = 'Full ESCo Offering (provision of energy services and financing)',
    Other = 'Other',
   
}

export enum EnumSAProvinces {
    EasternCape = "Eastern Cape",
    FreeState = "Free State",
    Gauteng = "Gauteng",
    KwaZuluNatal = "KwaZulu-Natal",
    Limpopo = "Limpopo",
    Mpumalanga = "Mpumalanga",
    NorthWest = "North West",
    NorthernCape = "Northern Cape",
    WesternCape = "Western Cape",
}

export enum EnumTiersStatus {
    One = "1",
    Two = "2",
    Three = "3",
}

export enum EnumTitles {
    Mr = "Mr",
    Mrs = "Mrs",
    Miss = "Miss",
    Ms = "Ms",
    Dr = "Dr",
    Prof = "Prof",
}

export enum EnumEscoRoles {
  //  ESCOUSER = "Esco User",
    VALIDATOR = "Validator",
    ADMINISTRATOR = "Administrator",
    SYSTEMADMIN = "Super Admin"
}

export enum EnumNoOfEmployees {
    ZEROTOFIVE = "0 - 5",
    FIVETOTEN = "5 - 10",
    TENTO20 = "10 - 20",
    TWENTYTO30 = "20 - 30",
    THERTYTO40 = "30 - 40",
    PLUS20 = "40 Plus"
}

export enum EnumNoOfTechCominedExp {
    LESSTHAN3YEARS = "Less than 3 years",
    BETWEEN3AND15YEARS = "Between 3 and 15 years",
    MORETHAN15YEARS = "More than 15 years",
}

export enum EnumOfFileCategories {
    KEYMPLOYEECV = "Key Employee CV",
    CIDBRATING = "CIDB Rating",
    ISO = "Quality plan (ISO 90001)",
    BEECERTIFICATE = "BEE Certificate",
    OTHER = "OTHER"
}
  