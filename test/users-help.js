const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
    return [
      {
        id: 1,
        user_name: 'test-user-1',
        full_name: 'Test user 1',
        password: 'password',
      },
      {
        id: 2,
        user_name: 'test-user-2',
        full_name: 'Test user 2',
        password: 'password',
      },
      {
        id: 3,
        user_name: 'test-user-3',
        full_name: 'Test user 3',
        password: 'password',
      },
      {
        id: 4,
        user_name: 'test-user-4',
        full_name: 'Test user 4',
        password: 'password',
      }
    ];
}
function makeCapsulesArray() {
    return [
      {
        title: "Submarines Suck",
        note: "They Suck",
        imageurl: "www.com",
        burydate: "2020-05-15T03:56:59.001Z",
        unlockdate: "2020-05-16T03:56:59.001Z",
      },
      {
        title: "Submarines are k",
        note: "Nothing Special",
        imageurl: "www.com",
        burydate: "2020-05-15T03:56:59.001Z",
        unlockdate: "2020-05-16T03:56:59.001Z",
      },
      {
        title: "Submarines Rock",
        note: "So Fun",
        imageurl: "www.com",
        burydate: "2020-05-15T03:56:59.001Z",
        unlockdate: "2020-05-16T03:56:59.001Z",
      }
    ];
}
  
function makeExpectedcapsule(users, capsule) {
      return {
        title: capsule.title,
        note: note.title,
        imageurl: imageurl.title,
        burydate: burydate.title,
        unlockdate: unlockdate.ti,
      }
}
  
function makeMaliciouscapsule(user) {
    const maliciouscapsule = {
      id: 911,
      style: "How-to",
      date: new Date(),
      amount: 'Naughty naughty very naughty <script>alert("xss");</script>',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    };
    const expectedcapsule = {
      ...makeExpectedcapsule([user], maliciouscapsule),
      title:
        'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
      content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    };
    return {
      maliciouscapsule,
      expectedcapsule
    };
}
  
function makeCapsulesFixtures() {
    const testUsers = makeUsersArray()
    const testCapsules = makeCapsulesArray(testUsers)
    return { testUsers, testCapsules,}
}
  
function cleanTables(db) {
    return db.transaction(trx =>
      trx
        .raw(
          `TRUNCATE
          capsules,
          users
        `
        )
        .then(() =>
          Promise.all([
            trx.raw(
              `ALTER SEQUENCE capsules_id_seq minvalue 0 START WITH 1`
            ),
            trx.raw(
              `ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`
            ),
            trx.raw(`SELECT setval('capsules_id_seq', 0)`),
            trx.raw(`SELECT setval('users_id_seq', 0)`),
          ])
        )
    );
}
  
function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }));
    return db
      .into('users')
      .insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(`SELECT setval('users_id_seq', ?)`, [
          users[users.length - 1].id
        ])
      );
}
  
function seedcapsulesTables(db, users, capsules, ) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('capsules').insert(capsules)
      // update the auto sequence to match the forced id values
      await trx.raw(
        `SELECT setval('capsules_id_seq', ?)`,
        [capsules[capsules.length - 1].id],
      )
  
    })
}
  
function seedMaliciouscapsule(db, user, capsule) {
    return seedUsers(db, [user]).then(() =>
      db.into("capsules").insert([capsule])
    );
}
  
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: "HS256"
    });
  
    return `Bearer ${token}`;
}
  
module.exports = {
    makeUsersArray,
    makeCapsulesArray,
    makeExpectedcapsule,
    makeMaliciouscapsule,
  
    makeCapsulesFixtures,
    cleanTables,
    seedcapsulesTables,
    seedMaliciouscapsule,
    seedUsers,
    makeAuthHeader,
}

