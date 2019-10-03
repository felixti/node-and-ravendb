import { Request, Response } from 'express';
import { DocumentStore } from 'ravendb';
import * as fs from 'fs';
import { resolve } from 'path';
 

class TestController {

  constructor(){
    this.values = ['banana', 'apple', 'pear', 'strawberry'];
    const certificatePath = resolve(__dirname, '..', '..', 'certs', 'ravendb.certificate.pfx');
    console.log(certificatePath);
    const authOptions = {
      certificate: fs.readFileSync(certificatePath),
      password: process.env.CERT_PASSWORD,
      type: 'pfx'
    };
    const store = new DocumentStore(process.env.RAVENDB_URL, 'products', authOptions);
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
      const products = await this.session
                                 .query({ collection: '@empty' })
                                 .selectFields(['title', 'description'])
                                 .all();
  
      return res.json({ products });


      
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
  async indexWithName(req, res) {
    const id = req.params.id;

    const product = await this.session.load(id);
  
    return res.json({ product });
  }
}

export default new TestController();