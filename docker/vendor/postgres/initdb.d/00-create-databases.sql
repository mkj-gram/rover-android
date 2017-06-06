-- auth-service
CREATE DATABASE authsvc_test;

-- content-api:

-- content-api: testing
CREATE ROLE "rover_test" with login createdb superuser;
CREATE DATABASE "rover-test" OWNER "rover_test";
GRANT ALL PRIVILEGES ON  DATABASE "rover-test" to "rover_test";

-- content-api: development
CREATE ROLE "rover_development" with login createdb superuser;
CREATE DATABASE "rover-local" owner "rover_development";
GRANT ALL PRIVILEGES ON  DATABASE "rover-local" to "rover_development";
