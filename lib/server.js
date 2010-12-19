/**
 * This file is part of Shorty.
 *
 * Shorty is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3 of the License.
 *
 * Shorty is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Shorty.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @category   shorty
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPL
 * @copyright  Copyright 2010 Evan Coury (http://www.Evan.pro/)
 * @package    server
 */
var net     = require('net'),
    sys     = require('sys'),
    smpp    = require('./smpp'),
    pdu     = require('./models/pdu'),
    sms     = require('./models/sms'),
    client  = require('./models/serverClient');
/* SERVER GOES HERE */

exports.server = function(config) {
    var self = this;
    self.config = config;
    self.server = {};
    self.clients = {};

    self.start = function() {
        self.server = net.createServer(self.connectionListener);
        self.server.listen(self.config.port, self.config.host, function() {
            console.log('listening on ' + self.config.host + ':' + self.config.port);
        });

        self.server.on('error', self.serverErrorHandler);
    };

    self.connectionListener = function(incomingSocket) {
        if ( DEBUG ) { console.log('incoming connection!'); }

        myClient = client.fromSocket(incomingSocket, self, self.clientCloseHandler);
        self.clients[ myClient.connection_id ] = myClient;

        console.log(sys.inspect(self.clients));
    };

    self.serverErrorHandler = function(e) {
        console.log(sys.inspect(e));
    };

    self.clientCloseHandler = function() {
        if (DEBUG) { console.log('connection closed'); }
        myClient = self.clients[ this.fd ];
        delete self.clients[ this.fd ];
        myClient.destroy();
    };

};