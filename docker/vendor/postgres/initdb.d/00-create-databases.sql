--
-- auth-service
--
CREATE DATABASE authsvc_test;
CREATE DATABASE authsvc_dev;

--
-- campaigns-service
--
CREATE DATABASE campaigns_test;
CREATE DATABASE campaigns_dev;

ALTER DATABASE campaigns_test SET log_statement = 'all';
ALTER DATABASE campaigns_dev SET log_statement = 'all';

--
-- test-service
--
CREATE DATABASE test_test;
CREATE DATABASE test_dev;

--
-- content-api:
--
--
-- content-api: testing
CREATE ROLE "rover_test" with login createdb superuser;
CREATE DATABASE "rover-test" OWNER "rover_test";
GRANT ALL PRIVILEGES ON  DATABASE "rover-test" to "rover_test";

-- content-api: development
CREATE ROLE "rover_development" with login createdb superuser;
CREATE DATABASE "rover-local" owner "rover_development";
GRANT ALL PRIVILEGES ON  DATABASE "rover-local" to "rover_development";
