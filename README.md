# TokShop-API

                                                       ** packages **

---

- API desc -- // EndPoint

---

- create package -
- delete package -
- get spcific package -
- get all packages -
- update package -
- delete all package -
- get all user for spcific package -

---

                  * Model *
               ---------------

- name or title
- users
- price
- price after discount
- number of products
-
- type or plan ('free' or'weekly' or 'monthly' or 'secondary' ..etc)
- country
- description
- expiresAt

---

                  ##Subscription Model

- userId
- packageId
- details
- type
- status
- deduction
- expiryDate
- stripeBankAccount

                  ##Subscription endpoints

- subscribe:
  users can subscribe to packages
  not implemented yet:
  stripe bank account
  expiryDate => will implement after the package duration implementation.
- unsubscribe:
  users can unsubscribe to packages which will delete the transaction process ,done when subscribing, from the database.
- renew:
  not implemented yet => will implement after the package duration implementation.

- allSubscriptions:
  user can find all subscriptions they made.
- allPackageSubscriptions:
  admin can find all users subscribed to their package.





    ------------------------------------------------
       **coupons**    /done

       _ endPoint _
       _create
       _update
       _getAll
       _getOne
       _delete
       _applayCoupon

       -----------------------------------------# tokShop_API
# tokShop_API
