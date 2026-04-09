export const defaultThemes = [
  { id: 'default', name: '기본 테마', cost: 0, primary: '#ffe66d', secondary: '#b4e88e', accent: '#6b8e23', background: '#fffef0' },
  { id: 'berry', name: '베리 테마', cost: 120, primary: '#ffcad4', secondary: '#f4acb7', accent: '#b23a48', background: '#fff6f7' },
  { id: 'sky', name: '하늘 테마', cost: 160, primary: '#cde7ff', secondary: '#8ecae6', accent: '#1877b8', background: '#f3fbff' },
  { id: 'mint', name: '민트 테마', cost: 180, primary: '#c7f9cc', secondary: '#80ed99', accent: '#2d6a4f', background: '#f4fff6' },
  { id: 'sunset', name: '노을 테마', cost: 220, primary: '#ffd6a5', secondary: '#ffadad', accent: '#e76f51', background: '#fff7f2' },
]

export const seedTransactions = [
  { id: 1, type: 'income', category: '용돈', description: '엄마에게 받은 주간 용돈', amount: 50000, time: '09:00', date: '2026-04-07' },
  { id: 2, type: 'expense', category: '식비', description: '점심 김밥', amount: 4500, time: '12:20', date: '2026-04-07' },
  { id: 3, type: 'expense', category: '교통', description: '버스 카드 충전', amount: 3000, time: '15:10', date: '2026-04-07' },
  { id: 4, type: 'expense', category: '문화', description: '만화책 구매', amount: 12000, time: '18:40', date: '2026-04-07' },
  { id: 5, type: 'expense', category: '식비', description: '떡볶이 간식', amount: 5000, time: '16:00', date: '2026-04-02' },
  { id: 6, type: 'expense', category: '교통', description: '지하철 이동', amount: 3000, time: '08:30', date: '2026-04-02' },
  { id: 7, type: 'expense', category: '문화', description: '영화 관람', amount: 15000, time: '14:00', date: '2026-04-05' },
  { id: 8, type: 'expense', category: '취미', description: '스티커 세트', amount: 8000, time: '11:45', date: '2026-04-10' },
]

export const seedLessons = {
  title: '용돈 관리의 첫걸음',
  description: [
    '용돈을 받으면 먼저 저축할 금액을 정해두는 습관이 중요해요.',
    '남은 금액 안에서 식비, 교통비, 문화생활처럼 용도를 나누면 계획적으로 쓸 수 있어요.',
    '작은 금액도 기록하면 어디에 돈이 새는지 금방 보이기 시작해요.',
  ],
  quiz: {
    question: '용돈을 받자마자 먼저 저축할 금액을 정해두는 것이 좋다.',
    answer: true,
    correct: '정답이에요. 먼저 남길 돈을 정하면 계획적인 소비가 쉬워져요.',
    incorrect: '아쉬워요. 먼저 저축 금액을 정해두면 충동 지출을 줄이는 데 도움이 돼요.',
  },
}
