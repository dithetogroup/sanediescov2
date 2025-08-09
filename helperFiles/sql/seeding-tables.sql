INSERT INTO login_user
  (lu_user_id, lu_esco_id, lu_name, lu_surname, lu_title, lu_email, lu_cellNo, lu_password, lu_isActive, lu_role, lu_lastLogin)
VALUES
  (1, 'ESCo-A001', 'Jason', 'Makgato', 'Mr', 'jason@escosa.co.za', '0821231111', '$2y$10$4oleWKAgaFQFjXajeDnLnuCsJr5tJBX30X3Viaf.jX1HC6Gc4IfYe', 1, 'Super Admin', '2025-08-01 10:11:00'),
  (2, 'ESCo-A002', 'Thabo', 'Ndlovu', 'Mrs', 'thabo@greenco.co.za', '0832222222', '$2y$10$4oleWKAgaFQFjXajeDnLnuCsJr5tJBX30X3Viaf.jX1HC6Gc4IfYe', 1, 'User', '2025-07-29 08:00:00');

  INSERT INTO registered_user
  (ru_user_id, ru_esco_id, ru_telNo, ru_province, ru_municipality, ru_companyType, ru_placeOfRegistration, ru_streetAddress, ru_companyRegNo, ru_vatNumber, ru_csdNumber, ru_companyName, ru_period)
VALUES
  (1, 'ESCo-A001', '0123456789', 'Gauteng', 'Tshwane', 'Private Company', 'Pretoria', '123 Main St', '2016/123456/07', '4012345678', 'M123456', 'MegaPower Ltd', '2016-2024'),
  (2, 'ESCo-A002', '0987654321', 'KwaZulu-Natal', 'eThekwini', 'Close Corporation', 'Durban', '456 Coast Rd', '2017/654321/23', NULL, NULL, 'GreenCo Group', '2017-2024');

-- Seed for previous_projects
INSERT INTO previous_projects (
    pp_id, pp_esco_id, pp_client_name, pp_contact_person, pp_client_contact_no, pp_proj_desc, pp_contact_email,
    pp_proj_value, pp_savingkilowatz, pp_proj_start_date, pp_proj_end_date
) VALUES
    (1, 'ESCo-A001', 'Randburg Mall', 'Thabo', '0112345678', 'Energy audit', 'client1@randburgmall.co.za', '1200000', '450', '2024-03-01', '2024-06-01'),
    (2, 'ESCo-A002', 'Green Estate', 'Linda', '0123456789', 'Solar panel install', 'client2@greenestate.co.za', '890000', '350', '2023-09-01', '2023-12-01');

-- Seed for company_information
INSERT INTO company_information (
    ci_id, ci_esco_id, ci_energy_man_exp, ci_com_exp_of_tech_pro, ci_business_activities_provinces
) VALUES
    (1, 'ESCo-A001', '1 - 2', '1 - 3', 'Gauteng, Free State'),
    (2, 'ESCo-A002', '3 - 5', '4 - 6', 'Western Cape, Limpopo');



  INSERT INTO client_reference
  (cr_id, cr_client_name, cr_contact_person, cr_client_contact_no, cr_proj_desc, cr_technologies, cr_proj_value, cr_start_date, cr_end_date, cr_isDeleted, cr_esco_id)
VALUES
  (1, 'MegaPower Ltd',    'Sibongile Ndlovu', '0831234567', 'Solar PV installation for office park',        '["Wind","Biomass"]',   120000, '2023-03-01 00:00:00', '2023-09-30 00:00:00', 0, 'ESCo-A001'),
  (2, 'GreenCo Group',    'John Nkosi',       '0821112222', 'Biogas plant implementation and maintenance', '["Wind","Biomass"]',                    80000,  '2022-06-15 00:00:00', '2023-02-15 00:00:00', 0, 'ESCo-A001'),
  (3, 'Waterwise Pty',    'Maria Smith',      '0823334444', 'Water heating system retrofit',               '["Wind"]',                50000,  '2024-01-10 00:00:00', '2024-06-05 00:00:00', 0, 'ESCo-A002'),
  (4, 'Bright Future SA', 'Thabo Moeketsi',   '0715550000', 'LED Lighting upgrade for warehouse',          '["Wind"]',              65000,  '2023-09-01 00:00:00', '2023-12-01 00:00:00', 0, 'ESCo-A003'),
  (5, 'FreshFarms Ltd',   'Lucy Chauke',      '0829876543', 'Cold room insulation project',                '["Wind"]',           70000,  '2022-10-01 00:00:00', '2023-03-01 00:00:00', 0, 'ESCo-A004');


INSERT INTO files_upload
  (fu_id, fu_esco_id, fu_name, fu_size, fu_pp_id, fu_ci_id, fu_type, fu_path, fu_category, fu_isRemoved)
VALUES
  (1, 'ESCo-A001', 'RandburgMall_ReferenceLetter.pdf', 201234, 1, NULL, 'application/pdf', 'uploads/RandburgMall_ReferenceLetter.pdf', 'Reference Letter', 0),
  (2, 'ESCo-A001', 'CICP_MegaPower.pdf', 432110, NULL, 1, 'application/pdf', 'uploads/CICP_MegaPower.pdf', 'CICP', 0),
  (3, 'ESCo-A002', 'GreenEstate_Ref.pdf', 200876, 2, NULL, 'application/pdf', 'uploads/GreenEstate_Ref.pdf', 'Reference Letter', 0),
  (4, 'ESCo-A002', 'GreenCo_CICP.pdf', 324222, NULL, 2, 'application/pdf', 'uploads/GreenCo_CICP.pdf', 'CICP', 0);
