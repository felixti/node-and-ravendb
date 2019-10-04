import { Request, Response } from 'express';
import { DocumentStore } from 'ravendb';
import * as fs from 'fs';
import { resolve } from 'path';
 
class Product {
  constructor(id, title, description){
    this.id = id;
    this.title = title;
    this.description = description
  }
}

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
    this.store = new DocumentStore(process.env.RAVENDB_URL, 'products', authOptions);
    this.store.initialize();
  }

  /**
   * 
   * @param {Request} req 
   * @param {Response} res
   * @public 
   */
  async index(req, res) {

    try {
      const session = this.store.openSession();
     
      const products = await session
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

    const session = this.store.openSession();

    const product = await session.load(id);
  
    return res.json({ product });
  }

    /**
   * 
   * @param {Request} req 
   * @param {Response} res
   * @public 
   */
  async add(req, res) {
    try {
      const product = req.body;
      const session = this.store.openSession();

      const newProduct = await session.store(product);
      
      return res.json(product);
    } catch (error) {
      throw error;
    }
  }
}

export default new TestController();