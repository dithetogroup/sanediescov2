
SELECT 
    ru.ru_province,
    ru.ru_companyName,
    ru.ru_esco_id,

    ce.ce_woman_owned,
    ce.ce_black_owned,
    ce.ce_youth_owned,
    ce.ce_last_updated_date,

    tr.tr_tierStatus,

    GROUP_CONCAT(DISTINCT se.se_industry) AS sector_industries,
    GROUP_CONCAT(DISTINCT se.se_isOther) AS sector_isOther,

    GROUP_CONCAT(DISTINCT tc.tc_tech_entpr_exp) AS tech_experience,
    GROUP_CONCAT(DISTINCT tc.tc_no_projs_completed) AS tech_projects,

    GROUP_CONCAT(DISTINCT so.so_industry) AS service_industries,
    GROUP_CONCAT(DISTINCT so.so_isOther) AS service_isOther,

    COUNT(DISTINCT ke.ke_id) AS total_key_employees

FROM registered_user ru

LEFT JOIN company_equity ce 
    ON ce.ce_esco_id = ru.ru_esco_id
    AND ce.ce_last_updated_date = (
        SELECT MAX(ce2.ce_last_updated_date)
        FROM company_equity ce2
        WHERE ce2.ce_esco_id = ru.ru_esco_id
    )

LEFT JOIN tier_results tr 
    ON tr.tr_esco_id = ru.ru_esco_id
    AND tr.tr_last_updated_date = (
        SELECT MAX(tr2.tr_last_updated_date)
        FROM tier_results tr2
        WHERE tr2.tr_esco_id = ru.ru_esco_id
    )

LEFT JOIN sector_experience se 
    ON se.se_esco_id = ru.ru_esco_id AND se.se_isDeleted = 0

LEFT JOIN technology_classification tc 
    ON tc.tc_esco_id = ru.ru_esco_id AND tc.tc_isDeleted = 0

LEFT JOIN services_offered so 
    ON so.so_esco_id = ru.ru_esco_id AND so.so_isDeleted = 0

LEFT JOIN key_employee ke 
    ON ke.ke_esco_id = ru.ru_esco_id AND ke.ke_isDeleted = 0

GROUP BY ru.ru_esco_id;
