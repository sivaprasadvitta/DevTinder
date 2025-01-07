## DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password   --forget password

## connectionRequestRouter
<!-- exploring tinder -->
- POST /request/send/intrested/:_id
- POST /request/send/ignored/:_id

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
Status: ignore ,interset,accepted,rejected...


## userRouter
- GET /user/connections
- GET /user/requests

core api is getting feed list of profile that appers in homepage -28 profile for tinder

- GET /user/feed
