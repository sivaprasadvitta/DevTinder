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
- Logic for Get.feed API 
- Explore the $nin, $and, $ne and other Query operators

- Pagination 
/feed?page=1&limit=10 =>first 10 users 1-10 .skip(0) & limit(10)

/feed?page=2&limit=10 => 11-20 .skip(10) & .limit(10)
- .skip() method
- .limit() method

- skip = (page-1) * limit

