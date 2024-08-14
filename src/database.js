import mysqlConnection from "mysql2/promise";

const properties = {
    host: "localhost",
    user:"root",
    password: "",
    database: "ProT4_32035780"
};

export const pool = mysqlConnection.createPool(properties);