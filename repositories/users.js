const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }

        this.filename = filename;
        try{
            fs.accessSync(this.filename);
        } catch (e) {
            fs.writeFileSync(this.filename, '[]')
        }
    }
    async getAll() {
        //1 open the file called this.filename
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
        //2 read contents
        // console.log(contents);
        //3 parse contents
        // const data = JSON.parse(contents);

        //4 Return the parsed data
        // return data;

    }
    async create(attrs){
        // attrs === {email: '', passord: ''}
        attrs.id = this.randomId();
        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);
        //todo: add created date and changed date
        // {email: 'asdfsdaf@gmail.com', password: 'asdfasdfasdf'}
        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        }
        records.push(record);
        // write the updated records array back to this.filename
        await this.writeAll(records);

        //return attributes
        return record;
    }
    async comparePasswords(saved, supplied) {
        // Saved -> password saved in our database. 'hashed.salt
        // Supplied -> password given to us by a user trying to sign in
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuf.toString('hex');
    }
    async writeAll(records) {
        //todo: change null to custom function that checks and changes the string
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id ===id);

        if (!record){
            throw new Error(`Record with id ${id} not found`)
        }

        Object.assign(record, attrs);
        this.writeAll(records);
    }

    async getOneBy(filters){
        const records = await this.getAll();

        for(let record of records) {
            let found = true;

            for (let key in filters) {
                if(record[key] !== filters[key]) {
                    found = false;
                }
                if (found) {
                    return record;
                }
            }
        }
    }
}

module.exports = new UsersRepository('users.json');

///////////////////////////////TEST CODE//////////////////////////
// const test = async () => {
//     const repo = new UsersRepository('users.json');
//     const user = await repo.getOneBy({password: 'aasdf22222'});
//
//     console.log(user);
// }
// test();

