const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeCapsuleArray } = require('./capsule.fixture');
const moment = require('moment')

describe("Capsules Endpoints", function() {
    let db;
  
    before("make knex instance", () => {
      db = knex({
        client: "pg",
        connection: process.env.TEST_DATABASE_URL
      });
      app.set("db", db);
    });
  
    after("disconnect from db", () => db.destroy());
  
    before("clean the table", () => db("capsules").truncate());
  
    afterEach("cleanup", () => db("capsules").truncate());
    
    describe(`GET /api/capsules`, () => {
        context(`Give no capusules`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get("/api/capsule")
              .expect(200, []);
          });
        });
    
        context("Given there are capsules in the database", () => {
          const testCapsules = makeCapsuleArray();
          testCapsules[0].burydate = moment(testCapsules[0].burydate).subtract(4, 'hours')
          testCapsules[1].burydate = moment(testCapsules[1].burydate).subtract(4, 'hours')
          testCapsules[2].burydate = moment(testCapsules[2].burydate).subtract(4, 'hours')
          beforeEach("insert capsules", () => {
            return db.into("capsules").insert(testCapsules);
          });
    
          it("GET /api/capsules responds with 200 and all of the capsules", () => {
            testCapsules[0].burydate = moment(testCapsules[0].burydate).subtract(4, 'hours')
            testCapsules[1].burydate = moment(testCapsules[1].burydate).subtract(4, 'hours')
            testCapsules[2].burydate = moment(testCapsules[2].burydate).subtract(4, 'hours')
            return supertest(app)
              .get("/api/capsule")
              .expect(200);
          });
        });
      });
    
      describe(`GET /capsules/:capsules_id`, () => {
        context(`Given no capsules`, () => {
          it(`responds with 404`, () => {
            const capsuleId = 123456;
            return supertest(app)
              .get(`/api/capsule/${capsuleId}`)
              .expect(404, { error: { message: `capsule doesn't exist` } });
          });
        });
        context('Given there are articles in the database', () => {
          const testCapsules = makeCapsuleArray()
    
          beforeEach('insert capsules', () => {
            return db
              .into('capsules')
              .insert(testCapsules)
          })
    
          it('responds with 200 and the specified capsule', () => {
            const capsuleId = 2
            const expectedCapsule = testCapsules[(capsuleId-1)]
             return supertest(app)
              .get(`/api/capsule/${capsuleId}`)
              .expect(200)
          });
        })
        context(`Given an XSS attack article`, () => {
            const maliciousCapsule = {
                id: 1,
                title: "XSS",
                note: "Watchout",
                imageurl: 'Bad image<img src="https://url.to.file.which/does-not.exist">.But not<strong>all</strong> bad.',
                burydate: "2020-05-16T03:56:59.001Z",
                unlockdate: "2020-05-17T03:56:59.001Z",
            };
      
            beforeEach("insert malicious capsule", () => {
              return db.into("capsules").insert([maliciousCapsule]);
            });
      
            it("removes XSS attack content", () => {
              return supertest(app)
                .get(`/api/capsule/${maliciousCapsule.id}`)
                .expect(200)
                .expect(res => {
                  expect(res.body.imageurl).to.eql(
                    `Bad image<img src="https://url.to.file.which/does-not.exist">.But not<strong>all</strong> bad.`
                  );
                });
            });
          });
        });
      describe(`POST /capsules`, () => {
        it(`creates a capsule responding with 201 and the new capsule`,  function() {
            const newEx = {
                id: 1,
                title: "New",
                note: "Capsule",
                imageurl: "www.com",
                burydate: "2020-05-16T03:56:59.001Z",
                unlockdate: "2020-05-17T03:56:59.001Z",
                usernumber: 1
            };
          
            return supertest(app)
            .post('/api/capsule')
            .send( newEx)
            .expect(201)
            .expect(res => {
                expect(res.body.amount).to.eql(newEx.amount);
                expect(res.body.style).to.eql(newEx.style);
                expect(res.body.description).to.eql(newEx.description);
                expect(res.headers.location).to.eql(`/api/capsule/${res.body.id}`);
                const expected = new Date().toISOString().split("T")[0];
                const actual = new Date().toISOString().split("T")[0];
                expect(actual).to.eql(expected);
            })
            .then(postRes =>
              supertest(app)
                .get(`/api/capsule/${postRes.body.id}`)
                .expect(200)
            );
        });
        const requiredFields = ["title", "note", "burydate"];
    
        requiredFields.forEach(field => {
          const newEx = {
            title: "Test",
            note: "TestTest",
            burydate: "2020-05-16T03:56:59.001Z",
            unlockdate: "2020-05-17T03:56:59.001Z"
          };
    
          it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            delete newEx[field];
    
            return supertest(app)
              .post("/api/capsule")
              .send(newEx)
              .expect(400, {
                error: { message: `Missing '${field}' in request body` }
              });
          });
        });
    })
    describe(`DELETE /api/capsule/:capsule_id`, () => {
        context(`Given no capsules`, () => {
          it(`responds with 404`, () => {
            const capsuleId = 123456;
            return supertest(app)
              .delete(`/api/capsule/${capsuleId}`)
              .expect(404, { error: { message: `capsule doesn't exist` } });
          });
        });
        context(`Given there are capsules in the database`, () => {
          const testCapsules = makeCapsuleArray();
    
          beforeEach("insert capsules", () => {
            return db.into("capsules").insert(testCapsules);
          });
    
          it("responds with 204 and removes the capsule", () => {
            const idRemove = 2;
            const expectedCapsule = testCapsules.filter(
              capsule => capsule.id !== idRemove
            );
            return supertest(app)
              .delete(`/api/capsule/${idRemove}`)
              .expect(204)
              .then(res =>
                supertest(app)
                  .get(`/api/capsule`)
              );
          });
        });
      });
      describe(`PATCH /api/capsule/:capsule_id`, () => {
        context(`Given no Capsuless`, () => {
          it(`responds with 404`, () => {
            const capsuleId = 999999;
            return supertest(app)
              .patch(`/api/capsule/${capsuleId}`)
              .expect(404, { error: { message: `capsule doesn't exist` } });
          });
        });
    
        context("Given there are capsules in the database", () => {
          const testCapsule = makeCapsuleArray();
    
          beforeEach("insert capsules", () => {
            return db.into("capsules").insert(testCapsule);
          });
    
          it("responds with 204 and updates the Capsule", () => {
            const idUpdate = 2;
            const updateCapsule = {
                id: 2,
                title: "Update",
                note: "Me",
                imageurl: "www.philla.com",
                burydate: "2020-05-18T03:56:59.001Z",
                unlockdate: "2020-05-19T03:56:59.001Z",
                usernumber: 1
            
            };
            const expectedCapsule = {
              ...testCapsule[idUpdate - 1],
              ...updateCapsule
            };
            return supertest(app)
              .patch(`/api/capsule/${idUpdate}`)
              .send(updateCapsule)
              .expect(204)
              .then(res =>
                supertest(app)
                  .get(`/api/capsule/${idUpdate}`)
                  .expect(200)
              );
          });
    
          it(`responds with 400 when no required fields supplied`, () => {
            const idUpdate = 2;
            return supertest(app)
              .patch(`/api/capsule/${idUpdate}`)
              .send({ irrelevantField: "foo" })
              .expect(400, {
                error: {
                  message: `Request body must contain either 'amount', 'style', or 'description'`
                }
              });
          });
    
          it(`responds with 204 when updating only a subset of fields`, () => {
            const idUpdate = 2;
            const updateCapsule = {
                id: 2,
                title: "Update2",
                note: "Please",
                imageurl: "www.psu.com",
                burydate: "2020-05-16T03:56:59.001Z",
                unlockdate: "2020-05-17T03:56:59.001Z",
            
            };
            const expectedCapsule = {
              ...testCapsule[idUpdate - 1],
              ...updateCapsule
            };
    
            return supertest(app)
              .patch(`/api/capsule/${idUpdate}`)
              .send({
                ...updateCapsule,
                fieldToIgnore: "should not be in GET response"
              })
              .expect(204)
              .then(res =>
                supertest(app)
                  .get(`/api/capsule/${idUpdate}`)
                  .expect(200)
              );
          });
        });
      });
})