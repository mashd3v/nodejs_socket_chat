const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utils')

const users = new Users();

io.on('connection', (client) => {

    client.on('loginChat', (data, callback) => {

        if (!data.name || !data.party) {
            return callback({
                error: true,
                message: 'User name and party chat are necesary.'
            });
        }

        client.join(data.party);

        users.addPerson(client.id, data.name, data.party);

        client.broadcast.to(data.party).emit('peopleList', users.getPeopleByParty(data.party));

        client.broadcast.to(data.party).emit('createMessage', createMessage('Admin', `${data.name} joined the party chat.`));

        callback(users.getPeopleByParty(data.party));

    });

    client.on('createMessage', (data, callback) => {

        let person = users.getPerson(client.id);
        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.party).emit('createMessage', message);

        callback(message);

    });

    // Private messages
    client.on('privateMessage', data => {

        let person = users.getPerson(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message));

    });

    client.on('disconnect', () => {

        let deletedPerson = users.deletePerson(client.id);

        client.broadcast.to(deletedPerson.party).emit('createMessage', createMessage('Admin', `${deletedPerson.name} left the party chat.`));

        client.broadcast.to(deletedPerson.party).emit('peopleList', users.getPeopleByParty(deletedPerson.party));

    });

});