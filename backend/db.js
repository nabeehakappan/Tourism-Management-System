const oracledb = require('oracledb');
require('dotenv').config();

oracledb.initOracleClient({
    libDir: 'C:\\Users\\DELL\\Downloads\\instantclient-basic-windows.x64-23.26.3.0.0\\instantclient_23_26'
});

async function connectToDatabase() {
    try {
        const connection = await oracledb.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONNECTION_STRING
        });

        console.log('Connected to Oracle Database!');
        return connection;

    } catch (error) {
        console.error('Oracle connection failed:', error);
        throw error;
    }
}

module.exports = connectToDatabase;