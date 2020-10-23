class Users {

    constructor() {
        this.people = [];
    }

    addPerson(id, name, party) {

        let person = { id, name, party };
        this.people.push(person);
        return this.people;

    }

    getPerson(id) {

        let person = this.people.filter(person => person.id === id)[0];
        return person;

    }

    getPeople() {

        return this.people;

    }

    getPeopleByParty(party) {

        let partyPeople = this.people.filter(person => person.party === party);
        return partyPeople;

    }

    deletePerson(id) {

        let deletedPerson = this.getPerson(id);
        this.people = this.people.filter(person => person.id != id);
        return deletedPerson;

    }

}

module.exports = {
    Users,
}