
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';

chai.use(chaiHttp);
chai.should();

describe('Finder', () => {
  it('should return an error without the coords parameter', (done) => {
    chai.request(app)
      .get('/finder')
      .end((err, res) => {
        res.should.have.status(422);
        done();
      });
  });

  it('should return an error with only one coordinate', (done) => {
    chai.request(app)
      .get('/finder?coords=48.850639,2.401598')
      .end((err, res) => {
        res.should.have.status(422);
        done();
      });
  });
});
