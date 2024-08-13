# How to Initialize the App

<a href="https://www.students.cs.ubc.ca/~cs-304/resources/javascript-oracle-resources/node-setup.html#local-deploy-item">
JS + Oracle Setup Guide
</a>

## Required Files

Both files should be located in ```./trailback```

### .env
```
# TODO: Edit the values below this line according to the given placeholders
# Replace 'ora_YOUR-CWL-USERNAME' with "ora_" (no quotation marks) followed by your CWL username.
ORACLE_USER=ora_YOUR-CWL-USERNAME
# Replace 'YOUR-STUDENT-NUMBER' with your actual student number.
ORACLE_PASS=aYOUR-STUDENT-NUMBER


#Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)
PORT=65535

# -------------- The three lines below should be left unaltered --------------
ORACLE_HOST=dbhost.students.cs.ubc.ca
ORACLE_PORT=1522
ORACLE_DBNAME=stu
```

### local-start.sh (Mac) // local-start.cmd (Windows)
```
./trailback/local-start.sh (Mac)
./trailback/local-start.cmd (Windows)

#!/bin/bash

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Configure the oracle instant client env variable
export DYLD_LIBRARY_PATH=/Users/.../instantclient_23_3:$DYLD_LIBRARY_PATH

# Start Node application
exec node server.js
```

<br>

## Must Perform 1. + 2. + 3. Below to Achieve Full Functionality

<br>

## 1. Tunnel into the Oracle Database

1. Open a new terminal
2. Navigate to ```trailback``` folder
```
cd trailback
```
3. Run db-tunnel script (Mac/Windows)

Mac
```
sh ./scripts/mac/db-tunnel.sh
```
Windows
```
.\scripts\win\db-tunnel.cmd
```
4. Enter CWL and (CWL) password
5. Successful if you see below in terminal
```
CWL@pender:~$
```

#### Access SQL*Plus (Optional)

6.  Run SQL*Plus command
```
sqlplus ora_CWL@stu
```
7. Enter password (ex: a12345678)
```
aSTUDENT#
```
8. Successful if you see below in terminal
```
SQL>
```
9. Run desired SQL statements

### Useful SQL*Plus Commands

See all attributes
```
DESCRIBE all_tables;
```

Find tables owned by you
```
SELECT table_name
FROM user_tables;
```

Find tables and number of rows in tables owned by someone
```
SELECT table_name, num_rows
FROM all_tables 
WHERE owner = 'ORA_CWL';
```

<br>

## 2. Initialize Backend

1. Open a new terminal
2. Navigate to ```trailback``` folder
```
cd trailback
```
3. Run local-start script (Mac/Windows)

Mac
```
sh local-start.sh
```
Windows
```
local-start.cmd
```
8. Successful if you see below in terminal
```
Server running at http://localhost:65535/
Connection pool started
```

<br>

## 3. Initialize Frontend

1. Open a new terminal
2. Navigate to ```trailfront``` folder
```
cd trailfront
```
3. Run npm-run command
```
npm run dev
```
4. Follow the localhost link
```
  VITE v5.3.5  ready in 115 ms

  ➜  Local:   http://localhost:5173/
```
