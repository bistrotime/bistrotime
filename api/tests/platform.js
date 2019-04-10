
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

chai.use(chaiHttp);
chai.should();

describe('Platform', () => {
  it('should return a good platform status', (done) => {
    chai.request(app)
      .get('/platform/ping')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
