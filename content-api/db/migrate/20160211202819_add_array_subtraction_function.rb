class AddArraySubtractionFunction < ActiveRecord::Migration
    def up
        connection.execute(
            %q{
                CREATE OR REPLACE FUNCTION array_subtraction(anyarray, anyarray)
                RETURNS anyarray AS $$
                SELECT ARRAY(SELECT unnest($1)
                             EXCEPT
                             SELECT unnest($2))
                $$ LANGUAGE sql;
            }
        )
    end
    def down
        connection.execute(
            %q{
                DROP FUNCTION array_subtraction(anyarray, anyarray)
            }
        )
    end
end
