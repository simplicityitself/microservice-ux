
# Mail Sender

This component accepts /email muon Post requests, validates it and sends e-mail.

Expects a payload similar to this:

```
 {
     "subject" : "Test",
     "text": "This is the body of an email. It can contain things.",
     "to": [
     "test@example.com"
     ],
     "cc": [],
     "bcc": [],
     "from": {
         name: "Sender Name",
         address: "sender@example.net"
 }
```