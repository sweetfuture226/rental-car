require('dotenv').config();

const dbConfigs = {
  development: {
    databases: {
      crm: {
        use_env_variable: 'CRM_DEV_DB_URL',
        dialect: 'postgres',
      },
      shopit: {
        use_env_variable: 'SHOPIT_DEV_DB_URL',
        dialect: 'postgres',
      },
      idemandbeauti: {
        use_env_variable: 'IDEMANDBEAUTI_DEV_DB_URL',
        dialect: 'postgres',
      },
      tipinapp: {
        use_env_variable: 'TIPINAPP_DEV_DB_URL',
        dialect: 'postgres',
      },
      quikbarber: {
        use_env_variable: 'QUIKBARBER_DEV_DB_URL',
        dialect: 'postgres',
      },
    },
  },

  test: {
    databases: {
      crm: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'test_db',
        host: '0.0.0.0',
        dialect: 'sqlite',
        storage: 'localdb/crm_test.sqlite',
        operatorsAliases: 0,
        logging: false,
      },
      shopit: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'test_db',
        host: '0.0.0.0',
        dialect: 'sqlite',
        storage: 'localdb/shopit_test.sqlite',
        operatorsAliases: 0,
        logging: false,
      },
      idemandbeauti: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'test_db',
        host: '0.0.0.0',
        dialect: 'sqlite',
        storage: 'localdb/idemandbeauti_test.sqlite',
        operatorsAliases: 0,
        logging: false,
      },
    },
  },

  staging: {
    databases: {
      crm: {
        use_env_variable: 'CRM_STAGING_DB_URL',
        dialect: 'postgres',
        logging: false,
      },
      shopit: {
        use_env_variable: 'SHOPIT_STAGING_DB_URL',
        dialect: 'postgres',
        logging: false,
      },
      idemandbeauti: {
        use_env_variable: 'IDEMANDBEAUTI_STAGING_DB_URL',
        dialect: 'postgres',
        logging: false,
      },
      tipinapp: {
        use_env_variable: 'TIPINAPP_STAGING_DB_URL',
        dialect: 'postgres',
      },
      quikbarber: {
        use_env_variable: 'QUIKBARBER_STAGING_DB_URL',
        dialect: 'postgres',
      },
    },
  },

  production: {
    databases: {
      crm: {
        use_env_variable: 'CRM_PROD_DB_URL',
        dialect: 'postgres',
        logging: false,
      },
      shopit: {
        use_env_variable: 'SHOPIT_PROD_DB_URL',
        dialect: 'postgres',
        logging: false,
      },
      idemandbeauti: {
        use_env_variable: 'IDEMANDBEAUTI_PROD_DB_URL',
        dialect: 'postgres',
        logging: false,
      },
      tipinapp: {
        use_env_variable: 'TIPINAPP_PROD_DB_URL',
        dialect: 'postgres',
      },
      quikbarber: {
        use_env_variable: 'QUIKBARBER_PROD_DB_URL',
        dialect: 'postgres',
      },
    },
  },
};

const getDBConfig = (dbName) => {
  if (!dbName) {
    return dbConfigs;
  }

  return {
    [process.env.NODE_ENV]:
      dbConfigs[process.env.NODE_ENV]['databases'][dbName],
  };
};

const dbObj = getDBConfig(process.env.db_name);

module.exports = getDBConfig(process.env.db_name);
