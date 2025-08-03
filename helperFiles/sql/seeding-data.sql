INSERT INTO login_user
(lu_esco_id, lu_name, lu_surname, lu_title, lu_email, lu_cellNo, lu_password, lu_isActive, lu_role, lu_lastLogin)
VALUES
('ESCo-A001', 'John', 'Smith', 'Mr', 'john.smith@escosa.co.za', '0812345678', 'password123', 1, 'Admin', '2025-07-31 10:15:00'),
('ESCo-A002', 'Lebo', 'Nkosi', 'Ms', 'lebo.nkosi@escosa.co.za', '0823456789', 'passw0rd', 1, 'User', '2025-08-01 11:22:00');

INSERT INTO registered_user
(ru_esco_id, ru_telNo, ru_province, ru_municipality, ru_companyType, ru_placeOfRegistration, ru_streetAddress, ru_companyRegNo, ru_vatNumber, ru_csdNumber, ru_companyName, ru_period)
VALUES
('ESCo-A001', '0123456789', 'Gauteng', 'Tshwane', 'PTY LTD', 'Johannesburg', '123 Main St', '2015/000123/07', '4550123456', 'CSD-0101', 'Green Energy Solutions', '2020-2025'),
('ESCo-A002', '0112345678', 'Western Cape', 'Cape Town', 'CC', 'Cape Town', '456 Long St', '2017/000456/23', '4550456789', 'CSD-0102', 'SunPower Africa', '2021-2026');

INSERT INTO sector_experience
(se_industry, se_isOther, se_isDeleted, se_esco_id)
VALUES
('Renewable Energy', 0, 0, 'ESCo-A001'),
('Industrial Efficiency', 0, 0, 'ESCo-A001'),
('Other', 1, 0, 'ESCo-A002');

INSERT INTO company_information
(ci_esco_id, ci_energy_man_exp, ci_com_exp_of_tech_pro, ci_business_activities_provinces)
VALUES
('ESCo-A001', '3 -5 years', '5-10 years', 'Gauteng,Western Cape'),
('ESCo-A002', '1-2 years', '1-3 years', 'Western Cape,Eastern Cape');


INSERT INTO previous_projects
(pp_esco_id, pp_client_name, pp_contact_person, pp_client_contact_no, pp_proj_desc, pp_contact_email, pp_proj_value, pp_savingkilowatz, pp_proj_start_date, pp_proj_end_date)
VALUES
('ESCo-A001', 'ABC Mining', 'Peter Jacobs', '0833333333', 'Installed solar panels', 'peter@abcmining.co.za', '500000', '150', '2023-02-01', '2023-12-01'),
('ESCo-A002', 'Blue Waters', 'Nomsa Moyo', '0844444444', 'LED lighting retrofit', 'nomsa@bluewaters.co.za', '200000', '50', '2022-05-01', '2022-09-15');

INSERT INTO files_upload
(fu_esco_id, fu_name, fu_size, fu_pp_id, fu_ci_id, fu_type, fu_path, fu_category, fu_isRemoved)
VALUES
('ESCo-A001', 'ESCo-A001_ABC_Mining_Invoice.pdf', 122334, 1, 1, 'application/pdf', 'uploads/ESCo-A001_ABC_Mining_Invoice.pdf', 'INVOICE', 0),
('ESCo-A002', 'ESCo-A002_BlueWaters_Report.pdf', 98345, 2, 2, 'application/pdf', 'uploads/ESCo-A002_BlueWaters_Report.pdf', 'REPORT', 0);




