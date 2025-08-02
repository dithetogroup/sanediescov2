CREATE TABLE company_information (
    ci_id INT AUTO_INCREMENT PRIMARY KEY,
    ci_esco_id VARCHAR(32) NOT NULL,
    ci_energy_man_exp VARCHAR(32) NOT NULL,
    ci_com_exp_of_tech_pro VARCHAR(32) NOT NULL,
    ci_business_activities_provinces TEXT NOT NULL,
    ci_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ci_updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE files_upload (
    fu_id INT AUTO_INCREMENT PRIMARY KEY,
    fu_esco_id VARCHAR(32) NOT NULL,
    fu_name VARCHAR(255) NOT NULL,
    fu_size INT(25) NULL,
    fu_type VARCHAR(255) NOT NULL,
    fu_path VARCHAR(255) NOT NULL,
    fu_category VARCHAR(255) NULL,
    fu_isRemoved BOOLEAN NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_fu_esco_id ON files_upload(fu_esco_id);


CREATE TABLE previous_projects (
    pp_id INT AUTO_INCREMENT PRIMARY KEY,
    pp_esco_id VARCHAR(32) NOT NULL,
    pp_client_name VARCHAR(100) NOT NULL,
    pp_contact_person VARCHAR(100) NOT NULL,
    pp_client_contact_no VARCHAR(20),
    pp_proj_desc TEXT,
    pp_contact_email VARCHAR(100),
    pp_proj_value VARCHAR(30),
    pp_savingkilowatz VARCHAR(30),
    pp_proj_start_date DATE,
    pp_proj_end_date DATE,
    pp_isDeleted TINYINT(1) DEFAULT 0,
    pp_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pp_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


