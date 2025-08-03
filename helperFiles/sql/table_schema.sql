-- Drop order: children before parents
DROP TABLE IF EXISTS files_upload;
DROP TABLE IF EXISTS previous_projects;
DROP TABLE IF EXISTS company_information;
DROP TABLE IF EXISTS client_reference;
DROP TABLE IF EXISTS login_user;
DROP TABLE IF EXISTS registered_user;
DROP TABLE IF EXISTS sector_experience;
DROP TABLE IF EXISTS company_equity;


CREATE TABLE company_information (
    ci_id INT AUTO_INCREMENT PRIMARY KEY,
    ci_esco_id VARCHAR(32) NOT NULL,
    ci_energy_man_exp VARCHAR(32) NOT NULL,
    ci_com_exp_of_tech_pro VARCHAR(32) NOT NULL,
    ci_business_activities_provinces TEXT NOT NULL,
    ci_isDeleted TINYINT(1) DEFAULT 0,
    ci_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ci_updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Company Equity Table
CREATE TABLE company_equity (
    ce_id INT AUTO_INCREMENT PRIMARY KEY,
    ce_esco_id VARCHAR(32) NOT NULL,
    ce_woman_owned VARCHAR(32) NOT NULL,
    ce_black_owned VARCHAR(32) NOT NULL,
    ce_youth_owned VARCHAR(32) NOT NULL,
    ce_isDeleted TINYINT(1) DEFAULT 0,
    ce_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ce_last_updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE previous_projects (
    pp_id INT AUTO_INCREMENT PRIMARY KEY,
    pp_esco_id VARCHAR(32) NOT NULL,
    pp_client_name VARCHAR(100) NOT NULL,
    pp_contact_person VARCHAR(100) NOT NULL,
    pp_client_contact_no VARCHAR(20),
    pp_proj_desc TEXT,
    pp_contact_email VARCHAR(100),
    pp_proj_value VARCHAR(30) DEFAULT NULL,
    pp_savingkilowatz VARCHAR(30) DEFAULT NULL,
    pp_proj_start_date DATE,
    pp_proj_end_date DATE,
    pp_isDeleted TINYINT(1) DEFAULT 0,
    pp_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pp_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE client_reference (
    cr_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cr_client_name varchar(50) DEFAULT NULL,
    cr_contact_person varchar(50) DEFAULT NULL,
    cr_client_contact_no varchar(50) DEFAULT NULL,
    cr_proj_desc varchar(255) DEFAULT NULL,
    cr_technologies Text DEFAULT NULL,
    cr_proj_value int(11) DEFAULT NULL,
    cr_start_date datetime DEFAULT NULL,
    cr_end_date datetime DEFAULT NULL,
    cr_isDeleted boolean DEFAULT false,
    cr_esco_id varchar(15) DEFAULT NULL,
    cr_last_updated_date timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE files_upload (
    fu_id INT AUTO_INCREMENT PRIMARY KEY,
    fu_esco_id VARCHAR(32) NOT NULL,
    fu_name VARCHAR(255) NOT NULL,
    fu_size INT(25) NULL,
    fu_pp_id INT NULL,
    fu_ci_id INT NULL,
    fu_cr_id INT NULL,
    fu_ce_id INT NULL, 
    fu_type VARCHAR(255) NOT NULL,
    fu_path VARCHAR(255) NOT NULL,
    fu_category VARCHAR(255) NULL,
    fu_isRemoved BOOLEAN NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_fu_pp_id (fu_pp_id),
    INDEX idx_fu_ci_id (fu_ci_id),
    INDEX idx_fu_cr_id (fu_cr_id),
    INDEX idx_fu_ce_id (fu_ce_id),
    INDEX idx_fu_esco_id (fu_esco_id),
    CONSTRAINT fk_fu_pp_id FOREIGN KEY (fu_pp_id) REFERENCES previous_projects(pp_id) ON DELETE CASCADE,
    CONSTRAINT fk_fu_ci_id FOREIGN KEY (fu_ci_id) REFERENCES company_information(ci_id) ON DELETE CASCADE,
    CONSTRAINT fk_fu_cr_id FOREIGN KEY (fu_cr_id) REFERENCES client_reference(cr_id) ON DELETE CASCADE,
    CONSTRAINT fk_fu_ce_id FOREIGN KEY (fu_ce_id) REFERENCES company_equity(ce_id) ON DELETE CASCADE
);


-- Users table: login_user
CREATE TABLE login_user (
    lu_user_id INT AUTO_INCREMENT PRIMARY KEY,
    lu_esco_id VARCHAR(15) NOT NULL,
    lu_name VARCHAR(255) DEFAULT NULL,
    lu_surname VARCHAR(255) DEFAULT NULL,
    lu_title VARCHAR(255) DEFAULT NULL,
    lu_email VARCHAR(255) NOT NULL UNIQUE,
    lu_cellNo VARCHAR(255) NOT NULL,
    lu_password VARCHAR(255) NOT NULL,
    lu_isActive BOOLEAN NOT NULL DEFAULT 1,
    lu_role VARCHAR(50) NOT NULL,
    lu_lastLogin DATETIME DEFAULT NULL,
    lu_last_updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Main registration/company profile: registered_user
CREATE TABLE registered_user (
    ru_user_id INT AUTO_INCREMENT PRIMARY KEY,
    ru_esco_id VARCHAR(15) NOT NULL UNIQUE,
    ru_telNo VARCHAR(50) NOT NULL,
    ru_province VARCHAR(50) NOT NULL,
    ru_municipality VARCHAR(50) NOT NULL,
    ru_companyType VARCHAR(100) NOT NULL,
    ru_placeOfRegistration VARCHAR(200) NOT NULL,
    ru_streetAddress VARCHAR(200) NOT NULL,
    ru_companyRegNo VARCHAR(50) NOT NULL,
    ru_vatNumber VARCHAR(50) NULL,
    ru_csdNumber VARCHAR(50) NULL,
    ru_companyName VARCHAR(255) NOT NULL,
    ru_period VARCHAR(255) NOT NULL,
    ru_last_updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE sector_experience (
    se_id INT AUTO_INCREMENT PRIMARY KEY,
    se_industry VARCHAR(100) DEFAULT NULL,
    se_isOther BOOLEAN DEFAULT FALSE,
    se_isDeleted BOOLEAN DEFAULT FALSE,
    se_esco_id VARCHAR(15) NOT NULL,
    se_last_updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;






DELIMITER $$
CREATE TRIGGER generate_ru_esco_id BEFORE INSERT ON registered_user FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    SET next_id = (SELECT AUTO_INCREMENT
                   FROM information_schema.TABLES
                   WHERE TABLE_SCHEMA = DATABASE()
                     AND TABLE_NAME = 'registered_user');
    SET NEW.ru_esco_id = CONCAT('ESCo-A', LPAD(next_id, 3, '0'));
END
$$
DELIMITER ;

