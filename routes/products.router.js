import express from 'express';
import joi from 'joi';
import Item from '../schemas/products.schema.js';

const router = express.Router();

const validationTest = joi.object({
  product: joi.string().min(1).max(20),
  content: joi.string().min(1).max(100),
  writer: joi.string().min(1).max(15),
  pw: joi.number().min(1).max(1000000),
  soldStatus: joi.string().valid('FOR_SALE', 'SOLD_OUT'),
})

/* 상품 작성 API */
//상품명, 작성 내용, 작성자명, 상품 상태, 비밀번호 전달받기
//상품 상태는 판매 중(FOR_SALE)(기본)과 판매 완료(SOLD_OUT)을 가짐
router.post('/products', async (req, res, next) => {
  // const { product, content, writer, pw , soldStatus} = req.body;
  const validation = await validationTest.validateAsync(req.body);
  const { product, content, writer, pw , soldStatus} = validation;
  if (!product) {
    return res.status(400).json({ errorMessage: "상품이 없습니다." });
  }

  const date = new Date();

  const newProduct = new Item({ product, content, writer, pw, date, soldStatus });

  await newProduct.save();

  return res.status(201).json({ newProduct });
})

/** 상품 상세 목록 조회 API*/

router.get('/products', async (req, res) => {
  const products = await Item.find().sort('-date').exec();

  return res.status(200).json({ products });
})

/** 상품 목록 조회 API **/
//상품명, 작성자명, 상품 상태, 작성 날짜 조회하기
router.get('/products/:productsId', async (req, res) => {
  const productsId = req.params.productsId;
  const currentProduct = await Item.findById(productsId).exec();
  const targetProduct = currentProduct.product;
  const targetWriter = currentProduct.writer;
  const targetStatus = currentProduct.soldStatus;
  const targetDate = currentProduct.date;

  return res.status(200).json({targetProduct,targetWriter,targetStatus,targetDate});
})

/** 상품 정보(content,) 수정 API(pw 동일시)**/
router.patch('/products/:productsId', async (req, res) => {
  const productsId = req.params.productsId;
  const { product, content, pw, soldStatus } = req.body;

  // 나의 id에 맞는 상품이 무엇인지 찾는다.
  const currentProduct = await Item.findById(productsId).exec();
  if (!currentProduct) {
    return res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다." });
  }

  //비밀번호가 일치할 때 수정 기능
  if (product) {
    const targetProduct = await Item.findOne({ product}).exec();
    if (pw === targetProduct.pw && product === targetProduct.product) {
      targetProduct.content = currentProduct.content;
      targetProduct.soldStatus = currentProduct.soldStatus;
      await targetProduct.save();
    }else{
      return res.status(404).json({ errorMessage: "상품명과 비밀번호가 다릅니다." });
    }
    currentProduct.content = content;
    currentProduct.soldStatus = soldStatus;
  }else{
    return res.status(404).json({errorMessage: "상품 조회에 실패하였습니다."});
  }

  await currentProduct.save();
  return res.status(200).json({});
})

/** 상품 삭제하기 API **/
router.delete('/products/:productsId',async(req,res)=>{
const productsId = req.params.productsId;
const { product, pw } = req.body;

const currentProduct = await Item.findById(productsId).exec();
if (!currentProduct) {
  return res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다." });
}

// 비밀번호가 일치할 때 삭제 기능
if (product) {
  if (pw === currentProduct.pw && product === currentProduct.product) {
    await Item.deleteOne({ _id: productsId});
    return res.status(200).json({});
  }else{
    return res.status(404).json({ errorMessage: "상품명과 비밀번호가 다릅니다." });
  }
}
})

export default router;