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

//router.post('/', async (req, res, next) => {
router.post('/', function (req, res, next) {
    var fromaccount = req.body.fromaccount;
    var toaccount = req.body.toaccount;
    var amountmoney = req.body.amountmoney;
    var sessionguard = req.body.sessionguard;


    async function sessioncheck() {
        try {
            client = await pool.connect()
        } catch (error) {
            console.log('A client pool error occurred:', error);
            return error;
        }

        try {
            rows = await client.query('SELECT EXISTS(SELECT 1 from sessionguard WHERE session_number = $1::int)', [sessionguard])
        } catch (error) {
            return error;
        }

        // work with ROWS.
        if (rows != true) {
            return rows;
        }
    }

    async function updatesessionguard() {
        try {
            client = await pool.connect()
        } catch (error) {
            console.log('A client pool error occurred:', error);
            return error;
        }

        try {
            await client.query('INSERT INTO sessionguard (session_number, create_time) VALUES ($1::int, now())',
                [sessionguard]);
        } catch (error) {
            console.log('An error occurred:', error);
            return error;
        }
    }

    sessionguardvar = false;
    rows = sessioncheck();
    rows.then(function(result) {
        console.log(result);
        console.log(result.rows[0]['exists']);
        if (rows == true)  {
            sessionguardvar = true;
        }
    })

    if (sessionguardvar == true)  {
        updatesessionguard().then(function(results) {
            console.log(results)
        })
    }

    // right.  need to someone pass a value back out.

    /*
    console.log("WHY");
    if (rows) {
        res.render('transfer', {
            'title' : "MO MONEY TRANSFERRED - DUPE FOUND",
            'fromaccount' : fromaccount,
            'sessionguard' : sessionguard
        })
        return;
    }*/

    async function transaction() {
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
    }

    transaction();

    // set a value on the form somehow?

    res.render('transfer', {
        'title' : "MO MONEY TRANSFERRED",
        'fromaccount' : fromaccount,
        'sessionguard' : sessionguard
    })
 
})
//The response should return the following payload: {id:transaction_id, from:{id:account, balance:current_balance},to:{id:account,balance:current_balance}, transfered:transfer_amount}

module.exports = router
