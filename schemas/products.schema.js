import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  product: { // 상품명
    type: String,
    required: true// name 필드는 필수 요소입니다.
  },
  content: { // 작성 내용
    type: String,
    required: true,
  },
  writer:{ // 작성자명
    type: String,
    required: true,
  },
  soldStatus:{ // 판매 상태: 판매 중(FOR_SALE)(기본), 판매 완료(SOLD_OUT)
    type: Boolean,
    required: false
  },
  pw:{
    type: Number,
    required: true
  },
  date: { // 작성 날짜
    type: Date, // doneAt 필드는 Date 타입을 가집니다.
    required: false,
  },
});

// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Item', ItemSchema);