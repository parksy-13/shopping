import express from 'express';
import Item from '../schemas/products.schema.js';

const router = express.Router();

/* 상품 작성 API */
//상품명, 작성 내용, 작성자명, 상품 상태, 비밀번호 전달받기
//상품 상태는 판매 중(FOR_SALE)(기본)과 판매 완료(SOLD_OUT)을 가짐
router.post('/products', async (req, res, next) => {
  const { product, content, writer, pw } = req.body;

  if (!product) {
    return res.status(400).json({ errorMessage: "상품이 없습니다." });
  }

  const date = new Date();

  const newProduct = new Item({ product, content, writer, pw, date });

  await newProduct.save();

  return res.status(201).json({ newProduct });
})

/** 상품 목록 조회 API **/
//상품명, 작성자명, 상품 상태, 작성 날짜 조회하기
router.get('/products', async (req, res, next) => {
  //상품명
  const products = await Item.find().sort('-date').exec();

  return res.status(200).json({ products });
})


/** 상품 content 변경 (pw 동일시)**/
router.patch('/products/:productsId', async (req, res, next) => {
  const { productsId } = req.params;
  const { product, content, pw } = req.body;

  // 나의 id에 맞는 상품이 무엇인지 찾는다.
  const currentProduct = await Item.findById(productsId).exec();
  if (!currentProduct) {
    return res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다." });
  }

  if (product) {
    const targetProduct = await Item.findOne({ product}).exec();
    if (pw === currentProduct.pw) {
      targetProduct.content = currentProduct.content;
      await targetProduct.save();
    }else{
      return res.status(404).json({ errorMessage: "비밀번호가 틀렸습니다." });
    }
    currentProduct.content = content;
  }

  await currentProduct.save();
  return res.status(200).json({});
})

/** 상품 상세 조회 API **/
//상품명, 작성자명, 상품 상태, 작성 날짜 + 작성 내용 조회하기


/** 상품 정보 수정, 판매 완료 API **/
// router.patch('/products/')

export default router;