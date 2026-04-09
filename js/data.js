// ============================================================
// 健身追踪应用 - 数据层
// 食物数据库 / 运动预设 / 示例数据生成
// ============================================================

const FOOD_DATABASE = [
  // 主食类
  { id: 1, name: '米饭', category: '主食', caloriesPer100g: 116, protein: 2.6, carbs: 25.9, fat: 0.3, defaultUnit: '碗', defaultGrams: 200, emoji: '🍚', favorite: false },
  { id: 2, name: '面条(煮)', category: '主食', caloriesPer100g: 110, protein: 3.4, carbs: 24.3, fat: 0.2, defaultUnit: '碗', defaultGrams: 250, emoji: '🍜', favorite: false },
  { id: 3, name: '燕麦片', category: '主食', caloriesPer100g: 367, protein: 13.5, carbs: 66.3, fat: 6.7, defaultUnit: '份', defaultGrams: 40, emoji: '🥣', favorite: false },
  { id: 4, name: '全麦面包', category: '主食', caloriesPer100g: 247, protein: 8.5, carbs: 46.1, fat: 3.3, defaultUnit: '片', defaultGrams: 35, emoji: '🍞', favorite: false },
  { id: 5, name: '红薯', category: '主食', caloriesPer100g: 86, protein: 1.6, carbs: 20.1, fat: 0.1, defaultUnit: '个', defaultGrams: 200, emoji: '🍠', favorite: false },
  { id: 6, name: '土豆', category: '主食', caloriesPer100g: 77, protein: 2.0, carbs: 17.5, fat: 0.1, defaultUnit: '个', defaultGrams: 150, emoji: '🥔', favorite: false },
  { id: 7, name: '玉米', category: '主食', caloriesPer100g: 112, protein: 4.0, carbs: 22.8, fat: 1.2, defaultUnit: '根', defaultGrams: 200, emoji: '🌽', favorite: false },
  { id: 8, name: '馒头', category: '主食', caloriesPer100g: 221, protein: 7.0, carbs: 47.0, fat: 1.1, defaultUnit: '个', defaultGrams: 100, emoji: '🫓', favorite: false },

  // 肉类
  { id: 10, name: '鸡胸肉', category: '肉类', caloriesPer100g: 133, protein: 31.0, carbs: 0, fat: 1.2, defaultUnit: '块', defaultGrams: 150, emoji: '🍗', favorite: false },
  { id: 11, name: '牛肉(瘦)', category: '肉类', caloriesPer100g: 125, protein: 22.2, carbs: 0, fat: 4.2, defaultUnit: '份', defaultGrams: 150, emoji: '🥩', favorite: false },
  { id: 12, name: '三文鱼', category: '肉类', caloriesPer100g: 208, protein: 20.4, carbs: 0, fat: 13.6, defaultUnit: '块', defaultGrams: 120, emoji: '🐟', favorite: false },
  { id: 13, name: '虾仁', category: '肉类', caloriesPer100g: 87, protein: 18.6, carbs: 0.2, fat: 0.7, defaultUnit: '份', defaultGrams: 100, emoji: '🦐', favorite: false },
  { id: 14, name: '猪里脊', category: '肉类', caloriesPer100g: 155, protein: 20.2, carbs: 0, fat: 7.9, defaultUnit: '份', defaultGrams: 150, emoji: '🥓', favorite: false },
  { id: 15, name: '鸡腿', category: '肉类', caloriesPer100g: 181, protein: 16.0, carbs: 0, fat: 13.0, defaultUnit: '个', defaultGrams: 100, emoji: '🍗', favorite: false },
  { id: 16, name: '鳕鱼', category: '肉类', caloriesPer100g: 88, protein: 20.5, carbs: 0, fat: 0.7, defaultUnit: '块', defaultGrams: 120, emoji: '🐟', favorite: false },

  // 蛋奶类
  { id: 20, name: '鸡蛋', category: '蛋奶', caloriesPer100g: 144, protein: 13.3, carbs: 1.5, fat: 8.8, defaultUnit: '个', defaultGrams: 50, emoji: '🥚', favorite: false },
  { id: 21, name: '牛奶', category: '蛋奶', caloriesPer100g: 54, protein: 3.0, carbs: 3.4, fat: 3.2, defaultUnit: '杯', defaultGrams: 250, emoji: '🥛', favorite: false },
  { id: 22, name: '酸奶(无糖)', category: '蛋奶', caloriesPer100g: 57, protein: 3.1, carbs: 4.7, fat: 2.7, defaultUnit: '杯', defaultGrams: 200, emoji: '🍶', favorite: false },
  { id: 23, name: '奶酪', category: '蛋奶', caloriesPer100g: 328, protein: 25.7, carbs: 3.5, fat: 23.5, defaultUnit: '片', defaultGrams: 20, emoji: '🧀', favorite: false },
  { id: 24, name: '蛋白粉', category: '蛋奶', caloriesPer100g: 375, protein: 75.0, carbs: 10.0, fat: 3.0, defaultUnit: '勺', defaultGrams: 30, emoji: '🥤', favorite: false },

  // 蔬菜类
  { id: 30, name: '西兰花', category: '蔬菜', caloriesPer100g: 34, protein: 2.8, carbs: 6.6, fat: 0.4, defaultUnit: '份', defaultGrams: 150, emoji: '🥦', favorite: false },
  { id: 31, name: '菠菜', category: '蔬菜', caloriesPer100g: 23, protein: 2.9, carbs: 3.6, fat: 0.4, defaultUnit: '份', defaultGrams: 100, emoji: '🥬', favorite: false },
  { id: 32, name: '黄瓜', category: '蔬菜', caloriesPer100g: 16, protein: 0.7, carbs: 3.6, fat: 0.1, defaultUnit: '根', defaultGrams: 200, emoji: '🥒', favorite: false },
  { id: 33, name: '番茄', category: '蔬菜', caloriesPer100g: 18, protein: 0.9, carbs: 3.9, fat: 0.2, defaultUnit: '个', defaultGrams: 150, emoji: '🍅', favorite: false },
  { id: 34, name: '生菜', category: '蔬菜', caloriesPer100g: 15, protein: 1.4, carbs: 2.8, fat: 0.2, defaultUnit: '份', defaultGrams: 80, emoji: '🥗', favorite: false },

  // 水果类
  { id: 40, name: '香蕉', category: '水果', caloriesPer100g: 89, protein: 1.1, carbs: 22.8, fat: 0.3, defaultUnit: '根', defaultGrams: 120, emoji: '🍌', favorite: false },
  { id: 41, name: '苹果', category: '水果', caloriesPer100g: 52, protein: 0.3, carbs: 14.0, fat: 0.2, defaultUnit: '个', defaultGrams: 200, emoji: '🍎', favorite: false },
  { id: 42, name: '蓝莓', category: '水果', caloriesPer100g: 57, protein: 0.7, carbs: 14.5, fat: 0.3, defaultUnit: '份', defaultGrams: 100, emoji: '🫐', favorite: false },
  { id: 43, name: '橙子', category: '水果', caloriesPer100g: 47, protein: 0.9, carbs: 11.8, fat: 0.1, defaultUnit: '个', defaultGrams: 200, emoji: '🍊', favorite: false },
  { id: 44, name: '猕猴桃', category: '水果', caloriesPer100g: 61, protein: 1.1, carbs: 14.7, fat: 0.5, defaultUnit: '个', defaultGrams: 80, emoji: '🥝', favorite: false },

  // 坚果/其他
  { id: 50, name: '花生酱', category: '坚果', caloriesPer100g: 588, protein: 25.1, carbs: 20.0, fat: 50.4, defaultUnit: '勺', defaultGrams: 15, emoji: '🥜', favorite: false },
  { id: 51, name: '杏仁', category: '坚果', caloriesPer100g: 578, protein: 21.2, carbs: 21.7, fat: 49.4, defaultUnit: '份', defaultGrams: 25, emoji: '🌰', favorite: false },
  { id: 52, name: '核桃', category: '坚果', caloriesPer100g: 654, protein: 15.2, carbs: 13.7, fat: 65.2, defaultUnit: '个', defaultGrams: 10, emoji: '🌰', favorite: false },
  { id: 53, name: '橄榄油', category: '油脂', caloriesPer100g: 884, protein: 0, carbs: 0, fat: 100, defaultUnit: '勺', defaultGrams: 10, emoji: '🫒', favorite: false },
  { id: 54, name: '牛油果', category: '水果', caloriesPer100g: 160, protein: 2.0, carbs: 8.5, fat: 14.7, defaultUnit: '个', defaultGrams: 150, emoji: '🥑', favorite: false },
  { id: 55, name: '豆腐', category: '豆制品', caloriesPer100g: 76, protein: 8.1, carbs: 1.9, fat: 3.7, defaultUnit: '块', defaultGrams: 200, emoji: '🧈', favorite: false },
];

const FOOD_CATEGORIES = ['全部', '主食', '肉类', '蛋奶', '蔬菜', '水果', '坚果', '油脂', '豆制品'];

const EXERCISE_PRESETS = {
  '胸': ['平板卧推', '上斜卧推', '下斜卧推', '哑铃飞鸟', '龙门架夹胸', '俯卧撑', '哑铃卧推', '蝴蝶机夹胸'],
  '背': ['引体向上', '杠铃划船', '哑铃划船', '高位下拉', '坐姿划船', '硬拉', '直臂下压', 'T杠划船'],
  '腿': ['深蹲', '腿举', '罗马尼亚硬拉', '腿弯举', '腿屈伸', '保加利亚分腿蹲', '臀桥', '小腿提踵'],
  '肩': ['哑铃肩推', '杠铃推举', '侧平举', '前平举', '反向飞鸟', '面拉', '阿诺德推举', '绳索侧平举'],
  '手臂': ['杠铃弯举', '哑铃弯举', '锤式弯举', '三头绳索下压', '碎颅者', '过头臂屈伸', '集中弯举', '窄距卧推'],
  '核心': ['卷腹', '平板支撑', '悬垂举腿', '俄罗斯转体', '死虫', '腹轮', '侧平板', '登山者'],
};

const CARDIO_PRESETS = ['跑步', '椭圆机', '划船机', '动感单车', '爬坡走', '游泳', '跳绳', '户外骑行', '爬楼梯'];

const WORKOUT_TYPES = [
  { id: 'strength', name: '力量训练', icon: '🏋️' },
  { id: 'cardio', name: '有氧训练', icon: '🏃' },
  { id: 'hiit', name: 'HIIT', icon: '⚡' },
  { id: 'stretch', name: '拉伸/恢复', icon: '🧘' },
  { id: 'sports', name: '球类运动', icon: '⚽' },
  { id: 'custom', name: '自定义', icon: '✏️' },
];

const BODY_PARTS = ['胸', '背', '腿', '肩', '手臂', '核心'];

const UNITS = ['克', '个', '份', '碗', '杯', '片', '勺', '块', '根', '条'];

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function formatDateFull(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function generateSampleData() {
  const today = getToday();
  const data = {
    profile: {
      name: '健身达人',
      gender: '男',
      age: 28,
      height: 175,
      currentWeight: 78.5,
      targetWeight: 72,
      currentWaist: 85,
      targetWaist: 78,
      activityLevel: '中等活跃',
      goalType: '减脂',
      dailyCalorieGoal: 2000,
      proteinGoal: 150,
      carbsGoal: 200,
      fatGoal: 60,
      createdAt: getDaysAgo(45),
    },

    bodyMeasurements: [],
    meals: [],
    workouts: [],
    progressPhotos: [],
  };

  // Generate 45 days of body measurements
  for (let i = 45; i >= 0; i--) {
    const date = getDaysAgo(i);
    const weightBase = 82 - (45 - i) * 0.08 + (Math.random() - 0.5) * 0.6;
    const waistBase = 89 - (45 - i) * 0.09 + (Math.random() - 0.5) * 0.5;

    if (i % 1 === 0 || i < 7) {
      data.bodyMeasurements.push({
        id: generateId(),
        date: date,
        weight: Math.round(weightBase * 10) / 10,
        waist: i % 3 === 0 ? Math.round(waistBase * 10) / 10 : null,
        hip: i % 7 === 0 ? Math.round((96 - (45 - i) * 0.04 + (Math.random() - 0.5) * 0.3) * 10) / 10 : null,
        chest: i % 7 === 0 ? Math.round((98 + (45 - i) * 0.02 + (Math.random() - 0.5) * 0.3) * 10) / 10 : null,
        arm: i % 14 === 0 ? Math.round((34 + (45 - i) * 0.01 + (Math.random() - 0.5) * 0.2) * 10) / 10 : null,
        bodyFat: i % 7 === 0 ? Math.round((22 - (45 - i) * 0.04 + (Math.random() - 0.5) * 0.3) * 10) / 10 : null,
        note: '',
      });
    }
  }

  // Generate meals for last 7 days
  const mealTemplates = [
    { type: '早餐', foods: [
      { foodId: 3, quantity: 1, grams: 40 },
      { foodId: 21, quantity: 1, grams: 250 },
      { foodId: 20, quantity: 2, grams: 100 },
      { foodId: 40, quantity: 1, grams: 120 },
    ]},
    { type: '午餐', foods: [
      { foodId: 1, quantity: 1, grams: 200 },
      { foodId: 10, quantity: 1, grams: 150 },
      { foodId: 30, quantity: 1, grams: 150 },
    ]},
    { type: '晚餐', foods: [
      { foodId: 1, quantity: 0.7, grams: 140 },
      { foodId: 12, quantity: 1, grams: 120 },
      { foodId: 34, quantity: 1, grams: 80 },
      { foodId: 33, quantity: 1, grams: 150 },
    ]},
    { type: '加餐', foods: [
      { foodId: 24, quantity: 1, grams: 30 },
      { foodId: 41, quantity: 1, grams: 200 },
    ]},
  ];

  for (let i = 6; i >= 0; i--) {
    const date = getDaysAgo(i);
    mealTemplates.forEach(template => {
      const foods = template.foods.map(f => {
        const foodItem = FOOD_DATABASE.find(fd => fd.id === f.foodId);
        if (!foodItem) return null;
        const multiplier = f.grams / 100;
        return {
          id: generateId(),
          foodId: f.foodId,
          name: foodItem.name,
          emoji: foodItem.emoji,
          quantity: f.quantity,
          grams: f.grams,
          unit: foodItem.defaultUnit,
          calories: Math.round(foodItem.caloriesPer100g * multiplier),
          protein: Math.round(foodItem.protein * multiplier * 10) / 10,
          carbs: Math.round(foodItem.carbs * multiplier * 10) / 10,
          fat: Math.round(foodItem.fat * multiplier * 10) / 10,
        };
      }).filter(Boolean);

      data.meals.push({
        id: generateId(),
        date: date,
        type: template.type,
        foods: foods,
        note: '',
        time: template.type === '早餐' ? '07:30' : template.type === '午餐' ? '12:00' : template.type === '晚餐' ? '18:30' : '15:30',
      });
    });
  }

  // Generate workouts for last 14 days
  const workoutTemplates = [
    {
      name: '胸+三头',
      type: 'strength',
      bodyParts: ['胸', '手臂'],
      exercises: [
        { name: '平板卧推', sets: [
          { reps: 10, weight: 60, rpe: 7 }, { reps: 8, weight: 70, rpe: 8 },
          { reps: 8, weight: 75, rpe: 8.5 }, { reps: 6, weight: 80, rpe: 9 },
        ]},
        { name: '上斜哑铃卧推', sets: [
          { reps: 12, weight: 28, rpe: 7 }, { reps: 10, weight: 30, rpe: 8 },
          { reps: 10, weight: 30, rpe: 8.5 },
        ]},
        { name: '龙门架夹胸', sets: [
          { reps: 15, weight: 15, rpe: 7 }, { reps: 12, weight: 17.5, rpe: 8 },
          { reps: 12, weight: 17.5, rpe: 8 },
        ]},
        { name: '三头绳索下压', sets: [
          { reps: 15, weight: 25, rpe: 7 }, { reps: 12, weight: 30, rpe: 8 },
          { reps: 12, weight: 30, rpe: 8.5 },
        ]},
      ],
      duration: 65,
      caloriesBurned: 420,
    },
    {
      name: '背+二头',
      type: 'strength',
      bodyParts: ['背', '手臂'],
      exercises: [
        { name: '引体向上', sets: [
          { reps: 10, weight: 0, rpe: 7 }, { reps: 8, weight: 0, rpe: 8 },
          { reps: 8, weight: 0, rpe: 8.5 }, { reps: 6, weight: 10, rpe: 9 },
        ]},
        { name: '杠铃划船', sets: [
          { reps: 10, weight: 60, rpe: 7 }, { reps: 8, weight: 70, rpe: 8 },
          { reps: 8, weight: 70, rpe: 8.5 },
        ]},
        { name: '坐姿划船', sets: [
          { reps: 12, weight: 55, rpe: 7 }, { reps: 10, weight: 60, rpe: 8 },
          { reps: 10, weight: 60, rpe: 8 },
        ]},
        { name: '杠铃弯举', sets: [
          { reps: 12, weight: 25, rpe: 7 }, { reps: 10, weight: 30, rpe: 8 },
          { reps: 10, weight: 30, rpe: 8.5 },
        ]},
      ],
      duration: 60,
      caloriesBurned: 400,
    },
    {
      name: '腿部训练',
      type: 'strength',
      bodyParts: ['腿'],
      exercises: [
        { name: '深蹲', sets: [
          { reps: 10, weight: 80, rpe: 7 }, { reps: 8, weight: 90, rpe: 8 },
          { reps: 6, weight: 100, rpe: 9 }, { reps: 6, weight: 100, rpe: 9.5 },
        ]},
        { name: '罗马尼亚硬拉', sets: [
          { reps: 10, weight: 70, rpe: 7 }, { reps: 8, weight: 80, rpe: 8 },
          { reps: 8, weight: 80, rpe: 8.5 },
        ]},
        { name: '腿举', sets: [
          { reps: 12, weight: 140, rpe: 7 }, { reps: 10, weight: 160, rpe: 8 },
          { reps: 10, weight: 160, rpe: 8.5 },
        ]},
        { name: '腿弯举', sets: [
          { reps: 12, weight: 35, rpe: 7 }, { reps: 10, weight: 40, rpe: 8 },
          { reps: 10, weight: 40, rpe: 8 },
        ]},
      ],
      duration: 70,
      caloriesBurned: 500,
    },
  ];

  const cardioTemplate = {
    name: '有氧跑步',
    type: 'cardio',
    cardio: { activity: '跑步', duration: 30, distance: 4.5, pace: '6:40', incline: 1, caloriesBurned: 320 },
    duration: 30,
    caloriesBurned: 320,
  };

  const schedule = [0, 1, null, 2, 'cardio', 0, null, 1, 2, null, 'cardio', 0, 1, null];
  for (let i = 13; i >= 0; i--) {
    const wi = schedule[13 - i];
    if (wi === null) continue;
    const date = getDaysAgo(i);
    const isCardio = wi === 'cardio';
    const template = isCardio ? cardioTemplate : workoutTemplates[wi];

    const workout = {
      id: generateId(),
      date: date,
      name: template.name,
      type: template.type,
      bodyParts: template.bodyParts || [],
      exercises: template.exercises ? template.exercises.map(ex => ({
        id: generateId(),
        name: ex.name,
        sets: ex.sets.map((s, idx) => ({
          id: generateId(),
          setNumber: idx + 1,
          reps: s.reps,
          weight: s.weight,
          rpe: s.rpe,
          isPR: false,
        })),
      })) : [],
      cardio: template.cardio || null,
      startTime: '09:00',
      endTime: isCardio ? '09:30' : '10:10',
      duration: template.duration,
      caloriesBurned: template.caloriesBurned,
      note: '',
    };
    data.workouts.push(workout);
  }

  return data;
}
