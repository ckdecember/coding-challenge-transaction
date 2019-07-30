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
    var sessionguard = req.body.sessionguard;
    var toaccount_tid;
    var fromaccount_tid;

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

    console.log(rows)
    
    if (await rows.rows[0]['exists'] == true) {
        // just show the page witout doing the transaction
        res.render('transfer', {
            'title' : "MO MONEY TRANSFERRED",
            'fromaccount' : fromaccount,
            'sessionguard' : sessionguard
        })    
    }  else  {

        try {
            await client.query('BEGIN');
            fromaccount_tid = await client.query('INSERT INTO transactions (id, amount, accountnumber) \
                VALUES (DEFAULT, $1::int, $2::int) RETURNING id', [-amountmoney, fromaccount]);
            toaccount_tid = await client.query('INSERT INTO transactions (id, amount, accountnumber) \
                VALUES (DEFAULT, $1::int, $2::int) RETURNING id', [amountmoney, toaccount]);
            await client.query('COMMIT');
        } catch (error) {
            try {
                await client.query('ROLLBACK');
            } catch (rollbackError) {
                console.log('A rollback error occurred:', rollbackError);
            }
            console.log('An error occurred:', error);
            return error;
        }
        
        try {
            await client.query('INSERT INTO sessionguard (session_number, create_time) VALUES ($1::int, now())',
                [sessionguard]);
        } catch (error) {
            console.log('An error occurred:', error);
            return error;
        }

        // retro fit to return just a payload.  json it
        // transaction id, 
        console.log(fromaccount_tid.rows[0]['id']);
        console.log(toaccount_tid.rows[0]['id']);

        res.render('transfer', {
            'title' : "MO MONEY TRANSFERRED",
            'fromaccount' : fromaccount,
            'sessionguard' : sessionguard
        })
    }
})
//The response should return the following payload: {id:transaction_id, from:{id:account, balance:current_balance},to:{id:account,balance:current_balance}, transfered:transfer_amount}

module.exports = router
