/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiJson from 'chai-json';
import app from '../../index';
import 'babel-polyfill';

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiJson);
describe('Testing out Products endpoints', () => {
  describe('Testing products GET', () => {
    it('GET / products endpoint; should return all products with pagination', async () => {
      const res = await chai.request(app).get('/api/v1/products/')
        .query({ pageNumber: 1 });
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('Resources');
    });
    it('GET / products endpoint; should return all products without pagination', async () => {
      const res = await chai.request(app).get('/api/v1/products/');
      expect(res).to.have.status(200);
      expect(res).to.be.json;
    });

    it('GET / products endpoint; should return single product', async () => {
      const res = await chai.request(app).get('/api/v1/products/5');
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Resource Found!');
      expect(res.body).to.have.property('Resource');
    });

    it('GET / products endpoint; should return product not found', async () => {
      const res = await chai.request(app).get('/api/v1/products/50000');
      expect(res).to.have.status(404);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Resource doesn\'t exist!');
    });
  });

  // end of products GET
  describe('Testing the Posts Method', () => {
    it('POST / products endpoint should return a 401 error. No access token provided!', async () => {
      const res = await chai.request(app).post('/api/v1/products').type('form')
        .send({
          product_desc: 'short bread butter biscuit',
          unit_price: 650,
          quantity_supplied: 40,
          supplier_name: 'Okonkwo',
          category: 'biscuits',
        });
      expect(res).to.have.status(401);
      expect(res.body).to.eql({ message: 'No access token provided! Unaccessible resource' });
    });
    it('POST / products endpoint; should create a new Product in the database', async () => {
      const res = await chai.request(app).post('/api/v1/products').set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWlnYmVAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU0MTQ4NjQ2MH0.F-7ZK_IyOxO5VVKlotO7ySh5QF4Bz2T3qNEg0CxDNSI')
        .type('form')
        .send({
          product_desc: 'short bread butter biscuit',
          unit_price: 650,
          quantity_in_stock: 40,
          quantity_supplied: 40,
          supplier_name: 'Okonkwo',
          category: 'biscuits',
        });
      expect(res.body).to.be.a.jsonObj();
      expect(res.body).to.have.property('message');
      expect(res).to.have.status(201);
      expect(res.body.message).to.equal('Created a new product.');
    });
    it('POST / products endpoint; should report a validation error', async () => {
      const res = await chai.request(app).post('/api/v1/products')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWlnYmVAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU0MTQ4NjQ2MH0.F-7ZK_IyOxO5VVKlotO7ySh5QF4Bz2T3qNEg0CxDNSI')
        .type('form')
        .send({
          product_desc: 'bucket',
          unit_price: 350,
          quantity_in_stock: 10,
          supplier_name: 'Okonkwo',
          category: 'biscuits',
        });
      expect(res.body).to.be.a.jsonObj();
      expect(res).to.have.status(422);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('Error');
      expect(res.body.message).to.equal('Something wrong with input!');
    });

    it('POST / products endpoint; should return an already existing product message', async () => {
      const res = await chai.request(app)
        .post('/api/v1/products')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWlnYmVAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU0MTQ4NjQ2MH0.F-7ZK_IyOxO5VVKlotO7ySh5QF4Bz2T3qNEg0CxDNSI')
        .type('form')
        .send({
          product_desc: 'bucket',
          unit_price: 150,
          quantity_in_stock: 40,
          quantity_supplied: 10,
          supplier_name: 'Okonkwo',
          category: 'hardware',
        });
      expect(res.body).to.be.a.jsonObj();
      expect(res).to.have.status(200);
      expect(res.body).to.eql({ message: 'Product already exists Modify instead.' });
    });

    it('POST / products endpoint; should return a no access message', async () => {
      const res = await chai.request(app).post('/api/v1/products')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZ2VsYUBnbWFpbC5jb20iLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTU0MTQ4OTE5NH0.aEbvCde9ALV1B0VksKGuu39PIdbWUiGYc5eoigtEAgw')
        .type('form')
        .send({
          product_desc: 'bucket',
          unit_price: 350,
          quantity_in_stock: 10,
          supplier_name: 'Okonkwo',
          category: 'biscuits',
        });
      expect(res.body).to.be.a.jsonObj();
      expect(res).to.have.status(403);
      expect(res.body).to.eql({ message: 'Forbidden! You need to have  admin privileges' });
    });
  });

  // end of POST
  // Beginning of PUT
  describe('Testing the PUT method', () => {
    it('PUT / should return no access token error', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/id')
        .type('form')
        .send({
          product_id: 6,
          product_desc: 'Biscuits',
          unit_price: 400,
          quantity_supplied: 150,
          supplier_name: 'Okonkwo',
          category: 'soap',
        });
      expect(res).to.have.status(401);
      expect(res.body).to.eql({ message: 'No access token provided! Unaccessible resource' });
    });
    it('PUT / should return a product doesnt exists error message', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/6')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWlnYmVAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU0MTQ4NjQ2MH0.F-7ZK_IyOxO5VVKlotO7ySh5QF4Bz2T3qNEg0CxDNSI')
        .type('form')
        .send({
          product_id: 6,
          product_desc: 'Detergent',
          unit_price: 400,
          quantity_in_stock: 400,
          quantity_supplied: 150,
          supplier_name: 'Okonkwo',
          category: 'soap',
        });
      expect(res).to.have.status(404);
      expect(res.body).to.eql({ message: 'Product doesn\'t exist! Create the Product' });
    });
    it('PUT / should return a forbidden access error', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/6')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZ2VsYUBnbWFpbC5jb20iLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTU0MTQ4OTE5NH0.aEbvCde9ALV1B0VksKGuu39PIdbWUiGYc5eoigtEAgw')
        .type('form')
        .send({
          product_id: 6,
          product_desc: 'Biscuits',
          unit_price: 400,
          quantity_supplied: 150,
          supplier_name: 'Okonkwo',
          category: 'soap',
        });
      expect(res).to.have.status(403);
      expect(res.body).to.eql({ message: 'Forbidden! You need to have  admin privileges' });
    });
    it('PUT / should return a validation error! Unprocessable entity', async () => {
      const res = await chai.request(app).put('/api/v1/products/6')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWlnYmVAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU0MTQ4NjQ2MH0.F-7ZK_IyOxO5VVKlotO7ySh5QF4Bz2T3qNEg0CxDNSI')
        .type('form')
        .send({
          product_id: 6,
          product_desc: 'Biscuits',
          unit_price: 400,
          quantity_in_stock: 150,
          supplier_name: 'Okonkwo',
          category: 'soap',
        });
      expect(res).to.have.status(422);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Something wrong with input!');
    });
    it('PUT / should modify a product in the database', async () => {
      const res = await chai.request(app).put('/api/v1/products/7')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWlnYmVAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU0MTQ4NjQ2MH0.F-7ZK_IyOxO5VVKlotO7ySh5QF4Bz2T3qNEg0CxDNSI')
        .type('form')
        .send({
          product_id: 7,
          product_desc: 'Ariel',
          unit_price: 400,
          quantity_in_stock: 150,
          quantity_supplied: 150,
          supplier_name: 'Okonkwo',
          category: 'Detergent',
        });
      expect(res).to.have.status(200);
      expect(res.body).to.eql({ message: 'Product Modified' });
    });
  });
  // end of PUT
  // Beginning of DELETE
  describe('Testing the Delete method', () => {
    it('Delete / should return no access token error', async () => {
      const res = await chai.request(app).del('/api/v1/products/6');
      expect(res).to.have.status(401);
      expect(res.body).to.eql({ message: 'No access token provided! Unaccessible resource' });
    });
    it('Delete / should return cannot delete a non existent product message', async () => {
      const res = await chai.request(app).del('/api/v1/products/500')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWlnYmVAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU0MTQ4NjQ2MH0.F-7ZK_IyOxO5VVKlotO7ySh5QF4Bz2T3qNEg0CxDNSI');
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Product doesn\'t exist! Nothing to Delete');
    });

    it('Delete / should delete a product from the database', async () => {
      const res = await chai.request(app).del('/api/v1/products/8')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWlnYmVAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU0MTQ4NjQ2MH0.F-7ZK_IyOxO5VVKlotO7ySh5QF4Bz2T3qNEg0CxDNSI');
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Product Deleted');
    });

    it('checks if one is an admin', async () => {
      const res = await chai.request(app).del('/api/v1/products/8')
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZ2VsYUBnbWFpbC5jb20iLCJhZG1pbiI6ZmFsc2UsImF0dGVuZGFudF9pZCI6MiwibmFtZSI6ImFuZ2VsYSIsImlhdCI6MTU0MjI4Njg4MH0.8pQOl4ZxzdecrpTvUMGCc5x6boPzToWjgy5910cykEs');
      expect(res).to.have.status(403);
    });
  });
});
