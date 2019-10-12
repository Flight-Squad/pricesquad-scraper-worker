See Engineering Wiki

Prerequisites:

- Docker (look up docker for windows if on windows)

- Node.js

Create `.env` file at project root, see engineering wiki for variables

# Ajit Todo

Please create a branch called `ajitm/logfmt`

1. Convert logs to canonical log lones (aka logfmt) to make logs more readable

Current log line looks like

```
{"message":"{\"requestId\":\"f1fb553d-839b-4525-9be5-4892d7211430\",\"res\":{\"time\":[5,277976282],\"data\":[{\"times\":\"3:30 PM   â€“   7:14 PM\",\"airline\":\"JetBlue\",\"duration\":\"6h 44m\",\"stops\":\"Nonstop\",\"layover\":\"\",\"price\":488},{\"times\":\"3:55 PM   â€“   7:20 PM\",\"airline\":\"United\",\"duration\":\"6h 25m\",\"stops\":\"Nonstop\",\"layover\":\"\",\"price\":488},{\"times\":\"5:15 PM   â€“   9:10 PM\",\"airline\":\"Alaska\",\"duration\":\"6h 55m\",\"stops\":\"Nonstop\",\"layover\":\"\",\"price\":488},{\"times\":\"6:05 PM   â€“   9:51 PM\",\"airline\":\"United\",\"duration\":\"6h 46m\",\"stops\":\"Nonstop\",\"layover\":\"\",\"price\":488},{\"times\":\"6:15 PM   â€“   10:03 PM\",\"airline\":\"JetBlue\",\"duration\":\"6h 48m\",\"stops\":\"Nonstop\",\"layover\":\"\",\"price\":488},{\"times\":\"1:50 PM   â€“   7:57 AM+1\",\"airline\":\"United\",\"duration\":\"21h 7m\",\"stops\":\"2 stops\",\"layover\":\"EWR, SAN\",\"price\":447},{\"times\":\"1:50 PM   â€“   7:57 AM+1\",\"airline\":\"United\",\"duration\":\"21h 7m\",\"stops\":\"2 stops\",\"layover\":\"EWR, SAN\",\"price\":447},{\"times\":\"5:25 PM   â€“   8:15 AM+1\",\"airline\":\"JetBlue\",\"duration\":\"17h 50m\",\"stops\":\"1 stop\",\"layover\":\"9h 48m LGB\",\"price\":471}],\"url\":\"https://www.google.com/flights?hl=en#flt=BOS.SFO.2019-10-01;c:USD;e:1;sd:1;t:f;tt:o\"}}","level":"info"}
```

We want it to look something like https://brandur.org/assets/images/canonical-log-lines/example-line.svg

Helpful articles:

https://brandur.org/canonical-log-lines

https://stripe.com/blog/canonical-log-lines

Tips:

You're concerned with the file `src/config/winston.ts`

You have to research winston configuration and get it to output log info in
logfmt.

See https://github.com/csquared/node-logfmt and https://www.npmjs.com/package/logfmt (same thing)

--------------------------------------

2. Make Scrapers for providers

This will come later, worry about the logs first
