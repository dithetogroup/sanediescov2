DROP TABLE IF EXISTS files_upload;
DROP TABLE IF EXISTS previous_projects;
DROP TABLE IF EXISTS company_information;
DROP TABLE IF EXISTS sector_experience;
DROP TABLE IF EXISTS registered_user;
DROP TABLE IF EXISTS login_user;

CREATE TABLE login_user (
    lu_user_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    lu_esco_id varchar(15) NOT NULL,
    lu_name varchar(255) DEFAULT NULL,
    lu_surname varchar(255) DEFAULT NULL,
    lu_title varchar(255) DEFAULT NULL,
    lu_email varchar(255) NOT NULL,
    lu_cellNo varchar(255) NOT NULL,
    lu_password varchar(255) NOT NULL,
    lu_isActive boolean NOT NULL DEFAULT 1,
    lu_role varchar(50) NOT NULL,
    lu_lastLogin DATETIME DEFAULT NULL,
    lu_last_updated_date timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE registered_user (
    ru_user_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ru_esco_id varchar(15) NOT NULL,
    ru_telNo varchar(50) NOT NULL,
    ru_province varchar(50) NOT NULL,
    ru_municipality varchar(50) NOT NULL,
    ru_companyType varchar(100) NOT NULL,
    ru_placeOfRegistration varchar(200) NOT NULL,
    ru_streetAddress varchar(200) NOT NULL,
    ru_companyRegNo varchar(50) NOT NULL,
    ru_vatNumber varchar(50) NULL,
    ru_csdNumber varchar(50) NULL,
    ru_companyName varchar(255) NOT NULL,
    ru_period varchar(255) NOT NULL,
    ru_last_updated_date timestamp NOT NULL DEFAULT current_timestamp()
);

DELIMITER $$
CREATE TRIGGER generate_ru_esco_id BEFORE INSERT ON registered_user FOR EACH ROW BEGIN
    DECLARE next_id INT;
    SET next_id = (SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'registered_user');
    SET NEW.ru_esco_id = CONCAT('ESCo-A', LPAD(next_id, 3, '0'));
END
$$
DELIMITER ;

CREATE TABLE sector_experience (
    se_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    se_industry varchar(100) DEFAULT NULL,
    se_isOther boolean DEFAULT false,
    se_isDeleted boolean DEFAULT false,
    se_esco_id varchar(15) NOT NULL,
    se_last_updated_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_se_esco_id (se_esco_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE company_information (
    ci_id INT AUTO_INCREMENT PRIMARY KEY,
    ci_esco_id VARCHAR(32) NOT NULL,
    ci_energy_man_exp VARCHAR(32) NOT NULL,
    ci_com_exp_of_tech_pro VARCHAR(32) NOT NULL,
    ci_business_activities_provinces TEXT NOT NULL,
    ci_isDeleted TINYINT(1) DEFAULT 0,
    ci_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ci_updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ci_esco_id (ci_esco_id)
);

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
    pp_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_pp_esco_id (pp_esco_id)
);

CREATE TABLE files_upload (
    fu_id INT AUTO_INCREMENT PRIMARY KEY,
    fu_esco_id VARCHAR(32) NOT NULL,
    fu_name VARCHAR(255) NOT NULL,
    fu_size INT(25) NULL,
    fu_pp_id INT NULL,
    fu_ci_id INT NULL,
    fu_type VARCHAR(255) NOT NULL,
    fu_path VARCHAR(255) NOT NULL,
    fu_category VARCHAR(255) NULL,
    fu_isRemoved BOOLEAN NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_fu_pp_id (fu_pp_id),
    INDEX idx_fu_ci_id (fu_ci_id),
    INDEX idx_fu_esco_id (fu_esco_id),
    CONSTRAINT fk_fu_pp_id FOREIGN KEY (fu_pp_id) REFERENCES previous_projects(pp_id) ON DELETE CASCADE,
    CONSTRAINT fk_fu_ci_id FOREIGN KEY (fu_ci_id) REFERENCES company_information(ci_id) ON DELETE CASCADE
);
