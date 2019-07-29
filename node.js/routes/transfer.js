var express = require('express')
var router = express.Router()

/* transfer */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

const pg = require('pg')
const pool = new pg.Pool({
    connectionString:  process.env.DATABASE_URL
})

/* need to add for POST */

router.post('/', async (req, res, next) => {
    var fromaccount = req.body.fromaccount;
    var toaccount = req.body.toaccount;
    var amountmoney = req.body.amountmoney;

    try {
        client = await pool.connect()
    } catch (error) {
        console.log('A client pool error occurred:', error);
        return error;
    }

    try {
        await client.query('BEGIN');
        await client.query('INSERT INTO transactions (id, amount, accountnumber) VALUES (DEFAULT, $1::int, $2::int)', 
            [-amountmoney, fromaccount]);
        await client.query('INSERT INTO transactions (id, amount, accountnumber) VALUES (DEFAULT, $1::int, $2::int)',
            [amountmoney, toaccount]);
        await client.query('COMMIT');
    } catch (error) {
        try {
            await client.query('ROLLBACK');
        } catch (rollbackError) {
            console.log('A rollback error occurred:', rollbackError);
        }
        console.log('An error occurred:', error);
        return error;
    } finally {
        client.release();
    }

    res.render('transfer', {
        'title' : "MO MONEY TRANSFERRED",
        'fromaccount' : fromaccount
    })
 
})
//The response should return the following payload: {id:transaction_id, from:{id:account, balance:current_balance},to:{id:account,balance:current_balance}, transfered:transfer_amount}

module.exports = router
