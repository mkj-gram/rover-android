
INSERT INTO accounts
(id, name, created_at, updated_at) VALUES
 (1,'firstAcct','2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494')
,(2,'myAccont' ,'2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494')
;

INSERT INTO users 
(id, account_id, name, email, password_digest, permission_scopes, created_at, updated_at) VALUES
 (1,1,'user1' ,'user1@example.com','$2a$10$0tUJdIURcBTXV0KaVGexw.TBUUc8GRjuhjWsxXybIQaoQLVn/ksBa', '{}', '2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494')
,(2,1,'user2' ,'user2@example.com','$2a$10$0tUJdIURcBTXV0KaVGexw.TBUUc8GRjuhjWsxXybIQaoQLVn/ksBa', '{}', '2017-05-04 17:26:25.445494','2017-05-04 17:26:25.445494')
-- user which is expected to be always present as it's used for integration testing
-- password s3cR3t
,(3,1,'user3' ,'user3@example.com','$2a$10$ad5Ck9xH2z4/NtIkQtvJ6OazpXNOFeVLZANMBUMlqOyke3l82FaO6', '{admin}', '2017-05-04 17:26:25.445494','2017-05-04 17:26:25.445494')
;

INSERT INTO user_sessions 
(user_id, key, last_seen_ip, expires_at, created_at, updated_at) VALUES
 (1, 'EXPIREDSESSIONaaaaaaaaaaaaaaaaaaaaaaaaaa', '127.0.0.1', '2017-05-03 16:26:25.445494', '2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494')
,(1, 'SESSION1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '127.0.0.1', '2099-05-05 16:26:25.445494', '2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494')
;

INSERT INTO tokens
(account_id, key, permission_scopes, created_at, updated_at) VALUES
 (1, 'token1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '{web}', '2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494')
,(1, 'token2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '{}', '2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494')
;

-- first 1000 ids are reserved for fixtures
SELECT pg_catalog.setval('accounts_id_seq', 1000, true);
SELECT pg_catalog.setval('users_id_seq', 1000, true);