class AddArrayDistinctFunction < ActiveRecord::Migration
    def up
        connection.execute(
            %q{
                CREATE OR REPLACE FUNCTION array_distinct(anyarray)
                RETURNS anyarray AS $$
                SELECT ARRAY(SELECT DISTINCT unnest($1))
                $$ LANGUAGE sql;
            }
        )
    end
    def down
        connection.execute(
            %q{
                DROP FUNCTION array_distinct(anyarray)
            }
        )
    end
end
