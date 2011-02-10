mkdirtmp:
	mkdir -p tmp/db && mkdir -p tmp/db2
  
test: mkdirtmp
	expresso test/unit/*.test.js

test-cov:
	@TESTFLAGS=--cov $(MAKE) test

.PHONY: test test-cov docs docclean