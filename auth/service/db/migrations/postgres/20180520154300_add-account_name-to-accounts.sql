
-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
--
alter table accounts
  add column account_name text
    not null
    default ''
;

update accounts
  set account_name = concat('account_', id)
;

alter table accounts
  alter column account_name drop default
  ,add constraint unique_account_name unique (account_name)
;



-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
--

alter table accounts 
  drop constraint unique_account_name
  ,drop column account_name
;

