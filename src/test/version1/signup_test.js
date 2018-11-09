/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiJson from 'chai-json';
import chaiUrl from 'chai-url';
import co from 'co';
import app from '../../index';
import 'babel-polyfill';

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiJson);
chai.use(chaiUrl);
describe('Testing the SIGNUP endpoint', () => {
  describe('Testing the POST method', () => {
    it('should check if token exists', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send({
          name: 'Ehimare',
          email: 'Ehimare@gmail.com',
          password: 'password',
          admin: true,
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.eql({ message: 'No access token provided! Unaccessible resource' });
          done();
        });
    });
    it('should check if request successful after token is set and already existent email is passed', co.wrap(() => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWlnYmVAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU0MTQ0NTgxNn0.riIuOpKwOhPq3HVwxLQikmwJ2ZCf3gQue2Pb_xQTV3I')
        .type('form')
        .send({
          name: 'otaigbe',
          email: 'otaigbe@gmail.com',
          password: 'password',
          admin: true,
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.eql({ message: 'Email already exists, choose a unique email.' });
        });
    }));

    // it('should check if request successful after token is set and unique email is passed', (done) => {
    //   chai.request(app)
    //     .post('/api/v1/auth/signup')
    //     .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWlnYmVAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU0MTQ4NjQ2MH0.F-7ZK_IyOxO5VVKlotO7ySh5QF4Bz2T3qNEg0CxDNSI')
    //     .type('form')
    //     .send({
    //       name: 'stanley',
    //       email: 'stanley@gmail.com',
    //       password: 'password',
    //       admin: true,
    //     })
    //     .end((err, res) => {
    //       expect(res).to.have.status(201);
    //       expect(res.body).to.eql({ message: 'Attendant created! Proceed to login' });
    //       done();
    //     });
    // }).timeout(20000);
    it('should check if a user is admin', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZ2VsYUBnbWFpbC5jb20iLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTU0MTQ4OTE5NH0.aEbvCde9ALV1B0VksKGuu39PIdbWUiGYc5eoigtEAgw')
        .type('form')
        .send({
          name: 'olu',
          email: 'olu@gmail.com',
          password: 'password',
          admin: true,
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.eql({ message: 'Forbidden! You need to have  admin privileges' });
          done();
        });
    });

    it('POST / signup endpoint should return no errors', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send({
          name: 'Otaigbe',
          email: 'otaigbe@gmail.com',
          admin: true,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          done();
        });
    });
    it('(POST / signup endpoint) should check that the name,email,admin property of body is filled', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send({
          name: 'Otaigbe',
          email: 'otaigbe@gmail.com',
          admin: true,
        })
        .end((err, req) => {
          expect(req.body.name).to.not.be.null;
          expect(req.body.email).to.not.be.null;
          expect(req.body.admin).to.not.be.null;
          done();
        });
    });
    it('(POST / products endpoint) should check that the request is json', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send({
          name: 'Otaigbe',
          email: 'otaigbe@gmail.com',
          admin: true,
        })
        .end((err, req) => {
          expect(req.body).to.be.a.jsonObj();
          done();
        });
    });
    it('(POST / products endpoint) should check that the response is json', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send({
          name: 'Otaigbe',
          email: 'otaigbe@gmail.com',
          admin: true,
        })
        .end((err, res) => {
          expect(res.body).to.be.a.jsonObj();
          done();
        });
    });
  });
});
