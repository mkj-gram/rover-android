insert into accounts 
(id, name, created_at, updated_at) VALUES
(1,'firstAcct','2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494'),
(2,'myAccont' ,'2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494')
;

INSERT INTO users 
(id, account_id, name, email, password_digest, permission_scopes, created_at, updated_at) VALUES
(1,1,'user1' ,'user1@example.com','$2a$10$0tUJdIURcBTXV0KaVGexw.TBUUc8GRjuhjWsxXybIQaoQLVn/ksBa', '{}', '2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494'),
(2,1,'user2' ,'user2@example.com','$2a$10$0tUJdIURcBTXV0KaVGexw.TBUUc8GRjuhjWsxXybIQaoQLVn/ksBa', '{}', '2017-05-04 17:26:25.445494','2017-05-04 17:26:25.445494')
;

INSERT INTO user_sessions 
(user_id, key, last_seen_ip, expires_at, created_at, updated_at) VALUES
(1, 'EXPIREDSESSION', '127.0.0.1', '2016-05-05 16:26:25.445494', '2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494')
;

INSERT INTO tokens 
(account_id, key, permission_scopes, created_at, updated_at) VALUES
(1, 'token1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '{web}', '2017-05-04 16:26:25.445494','2017-05-04 16:26:25.445494')
;

SELECT pg_catalog.setval('accounts_id_seq', 2, true);
SELECT pg_catalog.setval('users_id_seq', 2, true);
