REPORTER = spec
test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--ui tdd

nope:
	echo -n $(TEST_FILES)

.PHONY: test nope