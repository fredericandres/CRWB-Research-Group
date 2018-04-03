/**
 * Users
 */
CREATE VIEW users AS 
    SELECT accounts.id_account AS id_user, emails.email, accounts.password
    FROM accounts INNER JOIN natural_persons ON (accounts.id_account = natural_persons.id_natural_person)
		  INNER JOIN persons ON (persons.id_person = natural_persons.id_natural_person)
		  FULL OUTER JOIN persons_emails ON (persons.id_person = persons_emails.id_person)  
		  FULL OUTER JOIN emails ON (persons_emails.id_email = emails.id_email);

/**
 * Groups
 */
CREATE VIEW users_groups AS 
    SELECT accounts.id_account AS id_user, groups.name AS group_name
    FROM accounts INNER JOIN natural_persons ON (accounts.id_account = natural_persons.id_natural_person)
		  INNER JOIN persons ON (persons.id_person = natural_persons.id_natural_person)
		  INNER JOIN persons_groups ON (persons_groups.id_person = persons.id_person)	
                  INNER JOIN groups ON (groups.id_group = persons_groups.id_group);