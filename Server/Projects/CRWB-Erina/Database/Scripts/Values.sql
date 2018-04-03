/**
 * Administrator
 */
/**
 * Person
 */
WITH  person AS (
	INSERT INTO persons(
	            id_legal_person)
	    VALUES ((SELECT id_legal_person FROM legal_persons WHERE legal_person = 'Natural person')) RETURNING id_person
), 
/**
 * Groups
 */
/**
 * Administrators
 */
group_admnistrators AS (
	INSERT INTO persons_groups(
		    id_person, id_group) 
	    VALUES ((SELECT id_person FROM person),(SELECT id_group FROM groups WHERE name = 'Administrators'))
),
/**
 * Users 
 */
group_users AS (
	INSERT INTO persons_groups(
		    id_person, id_group) 
	    VALUES ((SELECT id_person FROM person),(SELECT id_group FROM groups WHERE name = 'Users'))
),
/**
 * Natural person
 */
natural_person AS (
	INSERT INTO natural_persons(
		    id_natural_person, name, surname) 
	    VALUES ((SELECT id_person FROM person),'Administrator', 'Administrator') RETURNING id_natural_person
)
/**
 * Account
 * Password in Base64 encoding
 */

INSERT INTO accounts(
	    password, id_account)
    VALUES ('QWRtaW5pc3RyYXRvcg==', (SELECT id_natural_person FROM natural_person));
	
/**
 * User
 */
/**
 * Person
 */
WITH  person AS (
	INSERT INTO persons(
	            id_legal_person)
	    VALUES ((SELECT id_legal_person FROM legal_persons WHERE legal_person = 'Natural person')) RETURNING id_person
), 
/**
 * Groups
 */
/**
 * Users 
 */
group_users AS (
	INSERT INTO persons_groups(
		    id_person, id_group) 
	    VALUES ((SELECT id_person FROM person),(SELECT id_group FROM groups WHERE name = 'Users'))
),
/**
 * Natural person
 */
natural_person AS (
	INSERT INTO natural_persons(
		    id_natural_person, name, surname) 
	    VALUES ((SELECT id_person FROM person),'User', 'User') RETURNING id_natural_person
)
/**
 * Account
 * Password in Base64 encoding
 */

INSERT INTO accounts(
	    password, id_account)
    VALUES ('VXNlcg==', (SELECT id_natural_person FROM natural_person));