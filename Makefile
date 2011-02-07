mkdirtmp:
	mkdir -p tmp/db
  
test: mkdirtmp
	expresso test/unit/*.test.js

test-cov:
	@TESTFLAGS=--cov $(MAKE) test

.PHONY: test test-cov docs docclean