var http = require('http');
var port = process.env.port || 1337;
var sql = require('node-sqlserver');

var conn_str = "Driver={SQL Server Native Client 11.0};" +
               "Server=tcp:[databasename].database.windows.net,1433;" +
               "Database=TaskList;Uid=[username];" +
               "Pwd=[password];Encrypt=yes;Connection Timeout=30";

var query = "SELECT description, priority, status FROM dbo.Tasks";

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    sql.open(conn_str, function (err, conn) {
        if (err) {
            res.end("Error opening the connection!");
            return;
        }
        conn.queryRaw(query, function (err, results) {
            if (err) {
                res.write("Error running query!");
                return;
            }
            console.log("row count = " + results.rows.length + "\n");
            for (var i = 0; i < results.rows.length; i++) {
                res.write("Description: " + results.rows[i][0] +
                          " Priority: " + results.rows[i][1] + 
                          " Status: " + results.rows[i][2] + "\n");
            }
            res.end('Done --\n');
        }); 
    }); // sql.open
}).listen(port);