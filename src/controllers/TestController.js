import { Request, Response } from 'express';
import { DocumentStore } from 'ravendb';

class TestController {

  constructor(){
    this.values = ['banana', 'apple', 'pear', 'strawberry'];
    const store = new DocumentStore('https://a.free.felixlabs.ravendb.cloud', 'products');
    store.initialize();

    this.session = store.openSession();
  }

  /**
   * 
   * @param {Request} req 
   * @param {Response} res
   * @public 
   */
  async index(req, res) {

    try {
      let product = {
        title: 'test',
        description: 'test-2'
      };
  
      await this.session.store(product);
      await this.session.saveChanges();
  
      return res.json({ product });
      
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * 
   * @param {Request} req 
   * @param {Response} res
   * @public 
   */
  indexWithName(req, res) {
    const name = req.params.name;
  
    return res.json({ name, fruit: this.values[0] });
  }
}

export default new TestController();