clean:
	rm -rf tmp

mkdirtmp:
	mkdir -p tmp/db && mkdir -p tmp/db2

unit-tests:
	expresso test/unit/**/*.test.js

integration-tests:
	expresso test/integration/**/*.test.js
  
test: clean mkdirtmp unit-tests integration-tests

test-cov:
	@TESTFLAGS=--cov $(MAKE) test

.PHONY: test test-cov docs docclean