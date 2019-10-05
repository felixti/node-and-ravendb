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
      const session = this.store.openSession( { noTracking: true } );
     
      const products = await session
                              .query({ collection: 'Products' })
                              .selectFields(['title', 'description'])
                              .all();
                              
      return res.json(products);
    } catch (error) {
      res.json(error).status(400);
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

    const product = await session.load(`products/${id}`);
  
    return res.json({ product });
  }

    /**
   * 
   * @param {Request} req 
   * @param {Response} res
   * @public 
   */
  async create(req, res) {
    try {
      const { title, description } = req.body;

      const session = this.store.openSession();
      const newProduct = new Product('products/', title, description);
      
      await session.store(newProduct);
      await session.saveChanges();

      return res.json(newProduct);
    } catch (error) {
      return res.json(error).status(400);
    }
  }

      /**
   * 
   * @param {Request} req 
   * @param {Response} res
   * @public 
   */
  async update(req, res) {
    try {
      const { id: productId } = req.params;
            
      const session = await this.store.openSession(); 
      let product = await session.load(`products/${productId}`, { documentType: 'products' } );   

      const { title, description } = req.body;

      product.title = title;
      product.description = description;

      await session.saveChanges();

      return res.json(product);      
    } catch (error) {
      console.error(error);
      return res.json(error).status(400);
    }
  }
}

export default new TestController();