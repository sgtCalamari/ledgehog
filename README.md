# Ledgehog
## Description
Simple ledger application built in JavaScript using NodeJS, Express, MongoDB and PUG.
### Additional Resources:
- **PassportJS**: for user authentication
- **Bootstrap**: for UI/UX

## Repository Details:
Repository has three primary branches:
- **master**: codebase currently running live on [ledgehog.joemart.in](http://ledgehog.joemart.in/)
- **dev**: codebase running on development environment
- **main**: active working branch for development in-flight (*not guaranteed to be stable*)

Additional branches may be created for specific purposes, but the above will always fill their specified role.

## Other Notes:
There is a `.env` file excluded from the repository that is required for the app to properly function.  It includes the following key-value pairs:
- **DB_STRING**: [your MongoDB database connection string (mongodb://[username:password@]host1[?options])]
- **DB_NAME**: [name of db on MongoDB server for app-related data (i.e. ledger)]
- **SECRET**: [secret used in passport-local user authentication]
- **PORT**: [server port for application (i.e. 8080)]
- **DISPLAY_NAME**: [name of application (i.e. Ledgehog)]
