# Postgres and RDS Required Homework

## PSQL Database Creation

### Amazon RDS Database (Production DB)
#### AWS RDS Instance Provision
I created Amazon RDS database for the production environment (cruddur), using awc CLI script below:

```bash
    aws rds create-db-instance \
        --db-instance-identifier cruddur-db-instance \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --engine-version  14.6 \
        --master-username root \
        --master-user-password ######## \
        --allocated-storage 20 \
        --availability-zone us-east-1a \
        --backup-retention-period 0 \
        --port 5432 \
        --no-multi-az \
        --db-name cruddur \
        --storage-type gp2 \
        --publicly-accessible \
        --storage-encrypted \
        --enable-performance-insights \
        --performance-insights-retention-period 7 \
        --no-deletion-protection
        
```
RDS Database
![RDS Databases](week_4_assets/RDS_cruddur.png)

### createdb — create a new PostgreSQL database

I used the createdb command to create our database.

    createdb cruddur -h localhost -U postgres

![CREATE CRUDDUR](week_4_assets/create_database.PNG)

I used below command to connect to PSQL Client and  list the database(s).

    psql -U postgres -h localhost
    
![Database list](week_4_assets/list%20of%20database.PNG)

## Create a `Schema.sql` for creating tables and Add UUID Extension

Create a new directory `db` in `the \backend-flask\` directory and add a new file `schema.sql` with the content below:

 ```sql
      
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      DROP TABLE IF EXISTS public.users;
      DROP TABLE IF EXISTS public.activities;


      CREATE TABLE public.users (
        uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        display_name text NOT NULL,
        handle text NOT NULL,
        email text NOT NULL,
        cognito_user_id text NOT NULL,
        created_at TIMESTAMP default current_timestamp NOT NULL
      );
      
      CREATE TABLE public.activities (
        uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_uuid UUID NOT NULL,
        message text NOT NULL,
        replies_count integer DEFAULT 0,
        reposts_count integer DEFAULT 0,
        likes_count integer DEFAULT 0,
        reply_to_activity_uuid integer,
        expires_at TIMESTAMP,
        created_at TIMESTAMP default current_timestamp NOT NULL
      );
  ```
  ![Shema for creating table](week_4_assets/db-shema.PNG)
  
## Shell script for PSQL Database Connecting

I created a new directory called `bin`

    mkdir /workspace/aws-bootcamp-cruddur-2023/backend-flask/bin

I created a new bash script bin/db-connect content below:

    #! /usr/bin/bash

    psql $CONNECTION_URL
    
## Shell script to  drop the PSQL Database

I created a new file `db-drop` in the `bin` directory.

     #! /usr/bin/bash
     
     NO_DB_CONNECTION_URL=$(sed 's/\/cruddur//g' <<<"$CONNECTION_URL")
     psql $NO_DB_CONNECTION_URL -c "drop database cruddur;"
 
 ![Drop db](week_4_assets/drop_database.PNG)
 
## Shell script for PSQL Database Connection Sessions

`db-session` file in the `bin` directory.

 ```bash   
    #! /usr/bin/bash
    if [ "$1" = "prod" ]; then
    echo "Running in production mode"
    URL=$PROD_CONNECTION_URL
    else
      URL=$CONNECTION_URL
    fi
    
    NO_DB_URL=$(sed 's/\/cruddur//g' <<<"$URL")
    psql $NO_DB_URL -c "select pid as process_id, \
           usename as user,  \
           datname as db, \
           client_addr, \
           application_name as app,\
           state \
    from pg_stat_activity;"
 ```
 ![Sessions](week_4_assets/db-sessions.png)
 
 ## Shell script to load the schema to the PSQL Database
 
 `db-shema` file in th `bin` directory.
 
 ```bash
    #! /usr/bin/bash
    
    schema_path="$(realpath .)/db/schema.sql"
    echo $schema_path
    
    if [ "$1" = "prod" ]; then
      echo "Running in production mode"
      URL=$PROD_CONNECTION_URL
    else
      URL=$CONNECTION_URL
    fi
    
    psql $URL cruddur < $schema_path
 ``` 
 ![Load schema](week_4_assets/schema_load.PNG)
 
 ## Shell script to load the seed data to the PSQL Database
 
 Insert seed data to the PSQL database.
 `db-seed` file in th `bin` directory.
 
 ```bash
    #! /usr/bin/bash
    seed_path="$(realpath .)/db/seed.sql"
    echo $seed_path
    
    if [ "$1" = "prod" ]; then
      echo "Running in production mode"
      URL=$PROD_CONNECTION_URL
    else
      URL=$CONNECTION_URL
    fi

    psql $URL cruddur < $seed_path
    
 ```
 ![Inserted data](week_4_assets/db-seed-insert.png)
 
 ## Sell script for easy PSQL Database Setup
 
 `db-setup` file in th `bin` directory.
 ```bash
    bin_path="$(realpath .)/bin"

    source "$bin_path/db-drop"
    source "$bin_path/db-create"
    source "$bin_path/db-schema-load"
    source "$bin_path/db-seed"
 ```
 
 ## Postgres Client Installation  for Backend

 Add below to the `docker-compose.yml` file
 
 ```yml
    ...
    
    backend-flask:
    environment:
        CONNECTION_URL: "${CONNECTION_URL}"
    
    ...
 ```
## Connection to AWS RDS Instance via GITPOD

I used the command `curl ifconfig.me` to print out current IP for my Gitpod workspace.

        GITPOD_IP = $(curl ifconfig.me)

I created the in bound rule for connection to the RDS instance.<br>
From the Security group rules, I collected the the Security group ID: `sg-02d49491e45f597z6` and Security group rule ID: `sgr-042ed5ae4489f57c0`.<br>

   ```yml
        export DB_SG_ID="sg-02d49491e45f597z6"
        gp env DB_SG_ID="sg-02d49491e45f597z6"
        export DB_SG_RULE_ID="sgr-042ed5ae4489f57c0"
        gp env DB_SG_RULE_ID="sgr-042ed5ae4489f57c0"
   ```
   
### Shell script to update the AWS RDS Instance Security group
I created a bash script to update the RDS instance security group, once I start the cruddur workspace on GITPOD.<br>
`rds-update-sg-rule` file in th `bin` directory.
    
    ```bash
    #! /usr/bin/bash

    CYAN='\033[1;36m'
    NO_COLOR='\033[0m'
    LABEL="rds-update-sg-rule"
    printf "${CYAN}==== ${LABEL}${NO_COLOR}\n"
    
    aws ec2 modify-security-group-rules \
        --group-id $DB_SG_ID \
        --security-group-rules "SecurityGroupRuleId=$DB_SG_RULE_ID,SecurityGroupRule={Description=GITPOD,IpProtocol=tcp,FromPort=5432,ToPort=5432,CidrIpv4=$GITPOD_IP/32}"
        
    ```
    
### Connection to RND Instance Testing
I ran below script to connect to the production database (RDS instance)

    ```bash
            .\bin\db-connect prod
    ```
#### RND Instance connection    
![Production](week_4_assets/Connection_RDS_prod_mode.png)

### Connection to Production database
Connected the RND instance and list the databases available.

#### Production database
![Production](week_4_assets/Connection_RDS.png)

### Load Schema to the Production database
Run below scrip to load the database schema to the database
`./bin/db-schema-load prod`

![PROD SCHEMA](week_4_assets/schema_load_production.png)



