export const queries = {
    // Charging Station
    createStation: "INSERT INTO charging_station (name, address, business_unit, tariff_id) VALUES ($1, $2, $3, $4) RETURNING *;",
    getAllStations: "SELECT * FROM charging_station;",
    getStationById: "SELECT * FROM charging_station WHERE id = $1;",
    updateStation: "UPDATE charging_station SET name = $1, address = $2, business_unit = $3, tariff_id = $4 WHERE id = $5 RETURNING *;",
    deleteStation: "DELETE FROM charging_station WHERE id = $1 RETURNING *;",

    // Charge Point
    createChargingPoint: "INSERT INTO charge_point (charging_station_id, charger_type, tariff_id) VALUES ($1, $2, $3) RETURNING *;",
    getAllChargingPoints: "SELECT * FROM charge_point;",
    getChargingPointById: "SELECT * FROM charge_point WHERE id = $1;",
    updateConnector: "UPDATE connector SET type = $1 WHERE id = $2 RETURNING *;",
    updateChargingPoint: "UPDATE charge_point SET charger_type = $1, tariff_id = $2 WHERE id = $3;",
    deleteChargingPoint: "DELETE FROM charge_point WHERE id = $1 RETURNING *;",

    // Customer
    createCustomer: "INSERT INTO customer (name, email, phone, wallet_balance) VALUES ($1, $2, $3, $4) RETURNING *;",
    getAllCustomers: "SELECT * FROM customer;",
    getCustomerById: "SELECT * FROM customer WHERE id = $1;",
    updateCustomer: "UPDATE customer SET name = $1, email = $2, phone = $3 WHERE id = $4;",
    deleteCustomer: "DELETE FROM customer WHERE id = $1;",
    getWalletBalance: "SELECT wallet_balance FROM customer WHERE id = $1;",
    deductWalletBalance: "UPDATE customer SET wallet_balance = wallet_balance - $1 WHERE id = $2 RETURNING *;",

    // Charging Session
    createSession: "INSERT INTO charging_session (customer_id, charging_station_id, charge_point_id, connector_id, charge_duration, units_consumed_kwh, status) VALUES ($1, $2, $3, $4, $5, $6, 'active') RETURNING *;",
    stopSession: "UPDATE charging_session SET status = 'inactive' WHERE id = $1 RETURNING *;",
    getSessionById: "SELECT * FROM charging_session WHERE id = $1;",
    getAllSession:"SELECT * FROM charging_session",
    getSessionHistory: "SELECT * FROM charging_session WHERE customer_id = $1;",
    updateSessionStatus: "UPDATE charging_session SET status = $1 WHERE id = $2;",
    getTotalSessionsPerCharger: "SELECT charge_point_id, COUNT(*) as session_count, SUM(units_consumed_kwh) as total_energy FROM charging_session GROUP BY charge_point_id;"
};
