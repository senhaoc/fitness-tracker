// ============================================================
// 健身追踪应用 - 数据层
// 食物数据库 / 运动预设 / 示例数据生成
// ============================================================

const FOOD_DATABASE = [
  // ========== 主食类 ==========
  { id: 1, name: '米饭', category: '主食', caloriesPer100g: 116, protein: 2.6, carbs: 25.9, fat: 0.3, defaultUnit: '碗', defaultGrams: 200, emoji: '🍚', favorite: false },
  { id: 2, name: '面条(煮)', category: '主食', caloriesPer100g: 110, protein: 3.4, carbs: 24.3, fat: 0.2, defaultUnit: '碗', defaultGrams: 250, emoji: '🍜', favorite: false },
  { id: 3, name: '燕麦片', category: '主食', caloriesPer100g: 367, protein: 13.5, carbs: 66.3, fat: 6.7, defaultUnit: '份', defaultGrams: 40, emoji: '🥣', favorite: false },
  { id: 4, name: '全麦面包', category: '主食', caloriesPer100g: 247, protein: 8.5, carbs: 46.1, fat: 3.3, defaultUnit: '片', defaultGrams: 35, emoji: '🍞', favorite: false },
  { id: 5, name: '红薯', category: '主食', caloriesPer100g: 86, protein: 1.6, carbs: 20.1, fat: 0.1, defaultUnit: '个', defaultGrams: 200, emoji: '🍠', favorite: false },
  { id: 6, name: '土豆', category: '主食', caloriesPer100g: 77, protein: 2.0, carbs: 17.5, fat: 0.1, defaultUnit: '个', defaultGrams: 150, emoji: '🥔', favorite: false },
  { id: 7, name: '玉米', category: '主食', caloriesPer100g: 112, protein: 4.0, carbs: 22.8, fat: 1.2, defaultUnit: '根', defaultGrams: 200, emoji: '🌽', favorite: false },
  { id: 8, name: '馒头', category: '主食', caloriesPer100g: 221, protein: 7.0, carbs: 47.0, fat: 1.1, defaultUnit: '个', defaultGrams: 100, emoji: '🫓', favorite: false },
  { id: 9, name: '贝果', category: '主食', caloriesPer100g: 257, protein: 10.0, carbs: 50.5, fat: 1.6, defaultUnit: '个', defaultGrams: 90, emoji: '🥯', favorite: false },
  { id: 101, name: '紫薯', category: '主食', caloriesPer100g: 82, protein: 1.6, carbs: 18.7, fat: 0.2, defaultUnit: '个', defaultGrams: 200, emoji: '🍠', favorite: false },
  { id: 102, name: '糙米饭', category: '主食', caloriesPer100g: 111, protein: 2.6, carbs: 23.0, fat: 0.9, defaultUnit: '碗', defaultGrams: 200, emoji: '🍚', favorite: false },
  { id: 103, name: '小米粥', category: '主食', caloriesPer100g: 46, protein: 1.4, carbs: 8.4, fat: 0.7, defaultUnit: '碗', defaultGrams: 300, emoji: '🥣', favorite: false },
  { id: 104, name: '米糊', category: '主食', caloriesPer100g: 65, protein: 1.5, carbs: 14.0, fat: 0.3, defaultUnit: '碗', defaultGrams: 250, emoji: '🥣', favorite: false },
  { id: 105, name: '米粉', category: '主食', caloriesPer100g: 361, protein: 7.0, carbs: 82.0, fat: 1.0, defaultUnit: '份', defaultGrams: 80, emoji: '🍜', favorite: false },
  { id: 106, name: '意面(煮)', category: '主食', caloriesPer100g: 131, protein: 5.0, carbs: 25.0, fat: 1.1, defaultUnit: '份', defaultGrams: 220, emoji: '🍝', favorite: false },
  { id: 107, name: '年糕', category: '主食', caloriesPer100g: 154, protein: 3.3, carbs: 34.7, fat: 0.6, defaultUnit: '份', defaultGrams: 150, emoji: '🍡', favorite: false },
  { id: 108, name: '花卷', category: '主食', caloriesPer100g: 211, protein: 6.4, carbs: 44.0, fat: 1.0, defaultUnit: '个', defaultGrams: 80, emoji: '🫓', favorite: false },
  { id: 109, name: '饺子(猪肉)', category: '主食', caloriesPer100g: 183, protein: 8.5, carbs: 22.0, fat: 6.5, defaultUnit: '个', defaultGrams: 25, emoji: '🥟', favorite: false },
  { id: 110, name: '包子(猪肉)', category: '主食', caloriesPer100g: 200, protein: 7.5, carbs: 30.0, fat: 5.5, defaultUnit: '个', defaultGrams: 80, emoji: '🥟', favorite: false },
  { id: 111, name: '粉丝(干)', category: '主食', caloriesPer100g: 338, protein: 0.5, carbs: 83.7, fat: 0.1, defaultUnit: '份', defaultGrams: 50, emoji: '🍜', favorite: false },
  { id: 112, name: '白面包', category: '主食', caloriesPer100g: 266, protein: 8.0, carbs: 50.6, fat: 3.2, defaultUnit: '片', defaultGrams: 30, emoji: '🍞', favorite: false },
  { id: 113, name: '吐司', category: '主食', caloriesPer100g: 266, protein: 8.0, carbs: 50.6, fat: 3.2, defaultUnit: '片', defaultGrams: 35, emoji: '🍞', favorite: false },
  { id: 114, name: '烙饼', category: '主食', caloriesPer100g: 260, protein: 7.0, carbs: 45.0, fat: 6.0, defaultUnit: '张', defaultGrams: 100, emoji: '🫓', favorite: false },
  { id: 115, name: '藜麦', category: '主食', caloriesPer100g: 368, protein: 14.1, carbs: 64.2, fat: 6.1, defaultUnit: '份', defaultGrams: 50, emoji: '🌾', favorite: false },

  // ========== 肉类 ==========
  { id: 10, name: '鸡胸肉', category: '肉类', caloriesPer100g: 133, protein: 31.0, carbs: 0, fat: 1.2, defaultUnit: '块', defaultGrams: 150, emoji: '🍗', favorite: false },
  { id: 11, name: '牛肉(瘦)', category: '肉类', caloriesPer100g: 125, protein: 22.2, carbs: 0, fat: 4.2, defaultUnit: '份', defaultGrams: 150, emoji: '🥩', favorite: false },
  { id: 12, name: '三文鱼', category: '肉类', caloriesPer100g: 208, protein: 20.4, carbs: 0, fat: 13.6, defaultUnit: '块', defaultGrams: 120, emoji: '🐟', favorite: false },
  { id: 13, name: '虾仁', category: '肉类', caloriesPer100g: 87, protein: 18.6, carbs: 0.2, fat: 0.7, defaultUnit: '份', defaultGrams: 100, emoji: '🦐', favorite: false },
  { id: 14, name: '猪里脊', category: '肉类', caloriesPer100g: 155, protein: 20.2, carbs: 0, fat: 7.9, defaultUnit: '份', defaultGrams: 150, emoji: '🥓', favorite: false },
  { id: 15, name: '鸡腿(去皮)', category: '肉类', caloriesPer100g: 161, protein: 19.3, carbs: 0, fat: 9.2, defaultUnit: '个', defaultGrams: 100, emoji: '🍗', favorite: false },
  { id: 16, name: '鳕鱼', category: '肉类', caloriesPer100g: 88, protein: 20.5, carbs: 0, fat: 0.7, defaultUnit: '块', defaultGrams: 120, emoji: '🐟', favorite: false },
  { id: 120, name: '虾(整只)', category: '肉类', caloriesPer100g: 93, protein: 20.1, carbs: 0.5, fat: 0.7, defaultUnit: '份', defaultGrams: 150, emoji: '🦐', favorite: false },
  { id: 121, name: '猪瘦肉', category: '肉类', caloriesPer100g: 143, protein: 20.3, carbs: 0, fat: 6.2, defaultUnit: '份', defaultGrams: 120, emoji: '🥩', favorite: false },
  { id: 122, name: '牛腱肉', category: '肉类', caloriesPer100g: 106, protein: 21.2, carbs: 0, fat: 2.2, defaultUnit: '份', defaultGrams: 150, emoji: '🥩', favorite: false },
  { id: 123, name: '鸭胸肉', category: '肉类', caloriesPer100g: 132, protein: 19.7, carbs: 0, fat: 5.3, defaultUnit: '块', defaultGrams: 150, emoji: '🦆', favorite: false },
  { id: 124, name: '羊肉(瘦)', category: '肉类', caloriesPer100g: 118, protein: 20.5, carbs: 0, fat: 3.9, defaultUnit: '份', defaultGrams: 150, emoji: '🍖', favorite: false },
  { id: 125, name: '带鱼', category: '肉类', caloriesPer100g: 127, protein: 17.7, carbs: 0, fat: 5.0, defaultUnit: '条', defaultGrams: 120, emoji: '🐟', favorite: false },
  { id: 126, name: '鲈鱼', category: '肉类', caloriesPer100g: 105, protein: 18.6, carbs: 0, fat: 3.4, defaultUnit: '份', defaultGrams: 150, emoji: '🐟', favorite: false },
  { id: 127, name: '金枪鱼罐头(水浸)', category: '肉类', caloriesPer100g: 116, protein: 25.5, carbs: 0, fat: 1.0, defaultUnit: '罐', defaultGrams: 100, emoji: '🐟', favorite: false },
  { id: 128, name: '蛤蜊', category: '肉类', caloriesPer100g: 87, protein: 15.6, carbs: 2.2, fat: 1.0, defaultUnit: '份', defaultGrams: 150, emoji: '🐚', favorite: false },
  { id: 129, name: '鱿鱼', category: '肉类', caloriesPer100g: 92, protein: 17.0, carbs: 1.7, fat: 1.6, defaultUnit: '份', defaultGrams: 120, emoji: '🦑', favorite: false },
  { id: 130, name: '鸡翅', category: '肉类', caloriesPer100g: 194, protein: 17.4, carbs: 0, fat: 13.6, defaultUnit: '个', defaultGrams: 50, emoji: '🍗', favorite: false },
  { id: 131, name: '牛排(西冷)', category: '肉类', caloriesPer100g: 210, protein: 25.0, carbs: 0, fat: 12.0, defaultUnit: '块', defaultGrams: 200, emoji: '🥩', favorite: false },
  { id: 132, name: '火腿片', category: '肉类', caloriesPer100g: 145, protein: 16.0, carbs: 2.0, fat: 8.0, defaultUnit: '片', defaultGrams: 20, emoji: '🥓', favorite: false },

  // ========== 蛋奶类 ==========
  { id: 20, name: '鸡蛋(全蛋)', category: '蛋奶', caloriesPer100g: 144, protein: 13.3, carbs: 1.5, fat: 8.8, defaultUnit: '个', defaultGrams: 50, emoji: '🥚', favorite: false },
  { id: 21, name: '牛奶(全脂)', category: '蛋奶', caloriesPer100g: 54, protein: 3.0, carbs: 3.4, fat: 3.2, defaultUnit: '杯', defaultGrams: 250, emoji: '🥛', favorite: false },
  { id: 22, name: '酸奶(无糖)', category: '蛋奶', caloriesPer100g: 57, protein: 3.1, carbs: 4.7, fat: 2.7, defaultUnit: '杯', defaultGrams: 200, emoji: '🍶', favorite: false },
  { id: 23, name: '奶酪', category: '蛋奶', caloriesPer100g: 328, protein: 25.7, carbs: 3.5, fat: 23.5, defaultUnit: '片', defaultGrams: 20, emoji: '🧀', favorite: false },
  { id: 24, name: '蛋白粉(乳清)', category: '蛋奶', caloriesPer100g: 375, protein: 75.0, carbs: 10.0, fat: 3.0, defaultUnit: '勺', defaultGrams: 30, emoji: '🥤', favorite: false },
  { id: 140, name: '蛋白(纯)', category: '蛋奶', caloriesPer100g: 47, protein: 11.0, carbs: 0.7, fat: 0.2, defaultUnit: '个', defaultGrams: 33, emoji: '🥚', favorite: false },
  { id: 141, name: '蛋黄', category: '蛋奶', caloriesPer100g: 322, protein: 15.9, carbs: 3.6, fat: 26.5, defaultUnit: '个', defaultGrams: 17, emoji: '🥚', favorite: false },
  { id: 142, name: '脱脂牛奶', category: '蛋奶', caloriesPer100g: 34, protein: 3.4, carbs: 5.0, fat: 0.1, defaultUnit: '杯', defaultGrams: 250, emoji: '🥛', favorite: false },
  { id: 143, name: '全脂酸奶', category: '蛋奶', caloriesPer100g: 97, protein: 3.5, carbs: 12.0, fat: 3.3, defaultUnit: '杯', defaultGrams: 200, emoji: '🍶', favorite: false },
  { id: 144, name: '希腊酸奶(脱脂)', category: '蛋奶', caloriesPer100g: 59, protein: 10.0, carbs: 3.6, fat: 0.4, defaultUnit: '杯', defaultGrams: 170, emoji: '🍶', favorite: false },
  { id: 145, name: '酪蛋白粉', category: '蛋奶', caloriesPer100g: 360, protein: 70.0, carbs: 12.0, fat: 3.5, defaultUnit: '勺', defaultGrams: 30, emoji: '🥤', favorite: false },
  { id: 146, name: '鹌鹑蛋', category: '蛋奶', caloriesPer100g: 160, protein: 12.8, carbs: 0.4, fat: 11.1, defaultUnit: '个', defaultGrams: 10, emoji: '🥚', favorite: false },

  // ========== 蔬菜类 ==========
  { id: 30, name: '西兰花', category: '蔬菜', caloriesPer100g: 34, protein: 2.8, carbs: 6.6, fat: 0.4, defaultUnit: '份', defaultGrams: 150, emoji: '🥦', favorite: false },
  { id: 31, name: '菠菜', category: '蔬菜', caloriesPer100g: 23, protein: 2.9, carbs: 3.6, fat: 0.4, defaultUnit: '份', defaultGrams: 100, emoji: '🥬', favorite: false },
  { id: 32, name: '黄瓜', category: '蔬菜', caloriesPer100g: 16, protein: 0.7, carbs: 3.6, fat: 0.1, defaultUnit: '根', defaultGrams: 200, emoji: '🥒', favorite: false },
  { id: 33, name: '番茄', category: '蔬菜', caloriesPer100g: 18, protein: 0.9, carbs: 3.9, fat: 0.2, defaultUnit: '个', defaultGrams: 150, emoji: '🍅', favorite: false },
  { id: 34, name: '生菜', category: '蔬菜', caloriesPer100g: 15, protein: 1.4, carbs: 2.8, fat: 0.2, defaultUnit: '份', defaultGrams: 80, emoji: '🥗', favorite: false },
  { id: 150, name: '芹菜', category: '蔬菜', caloriesPer100g: 16, protein: 0.7, carbs: 3.0, fat: 0.2, defaultUnit: '份', defaultGrams: 120, emoji: '🥬', favorite: false },
  { id: 151, name: '白菜', category: '蔬菜', caloriesPer100g: 13, protein: 1.5, carbs: 2.2, fat: 0.1, defaultUnit: '份', defaultGrams: 150, emoji: '🥬', favorite: false },
  { id: 152, name: '卷心菜', category: '蔬菜', caloriesPer100g: 25, protein: 1.3, carbs: 5.8, fat: 0.1, defaultUnit: '份', defaultGrams: 150, emoji: '🥬', favorite: false },
  { id: 153, name: '胡萝卜', category: '蔬菜', caloriesPer100g: 41, protein: 0.9, carbs: 9.6, fat: 0.2, defaultUnit: '根', defaultGrams: 120, emoji: '🥕', favorite: false },
  { id: 154, name: '豆角', category: '蔬菜', caloriesPer100g: 31, protein: 1.8, carbs: 7.0, fat: 0.1, defaultUnit: '份', defaultGrams: 150, emoji: '🫘', favorite: false },
  { id: 155, name: '秋葵', category: '蔬菜', caloriesPer100g: 33, protein: 1.9, carbs: 7.0, fat: 0.2, defaultUnit: '份', defaultGrams: 100, emoji: '🌿', favorite: false },
  { id: 156, name: '蘑菇', category: '蔬菜', caloriesPer100g: 22, protein: 3.1, carbs: 3.3, fat: 0.3, defaultUnit: '份', defaultGrams: 100, emoji: '🍄', favorite: false },
  { id: 157, name: '茄子', category: '蔬菜', caloriesPer100g: 25, protein: 1.0, carbs: 5.7, fat: 0.2, defaultUnit: '个', defaultGrams: 200, emoji: '🍆', favorite: false },
  { id: 158, name: '洋葱', category: '蔬菜', caloriesPer100g: 40, protein: 1.1, carbs: 9.3, fat: 0.1, defaultUnit: '个', defaultGrams: 150, emoji: '🧅', favorite: false },
  { id: 159, name: '青椒', category: '蔬菜', caloriesPer100g: 20, protein: 0.9, carbs: 4.6, fat: 0.2, defaultUnit: '个', defaultGrams: 100, emoji: '🫑', favorite: false },
  { id: 160, name: '南瓜', category: '蔬菜', caloriesPer100g: 26, protein: 1.0, carbs: 6.5, fat: 0.1, defaultUnit: '份', defaultGrams: 200, emoji: '🎃', favorite: false },
  { id: 161, name: '冬瓜', category: '蔬菜', caloriesPer100g: 12, protein: 0.4, carbs: 2.6, fat: 0.2, defaultUnit: '份', defaultGrams: 200, emoji: '🥒', favorite: false },
  { id: 162, name: '韭菜', category: '蔬菜', caloriesPer100g: 25, protein: 2.4, carbs: 4.2, fat: 0.4, defaultUnit: '份', defaultGrams: 100, emoji: '🌿', favorite: false },
  { id: 163, name: '芦笋', category: '蔬菜', caloriesPer100g: 20, protein: 2.2, carbs: 3.9, fat: 0.1, defaultUnit: '份', defaultGrams: 100, emoji: '🌿', favorite: false },
  { id: 164, name: '莲藕', category: '蔬菜', caloriesPer100g: 74, protein: 2.6, carbs: 17.2, fat: 0.1, defaultUnit: '份', defaultGrams: 150, emoji: '🌿', favorite: false },
  { id: 165, name: '山药', category: '蔬菜', caloriesPer100g: 57, protein: 1.9, carbs: 12.4, fat: 0.2, defaultUnit: '份', defaultGrams: 150, emoji: '🌿', favorite: false },
  { id: 166, name: '木耳(泡发)', category: '蔬菜', caloriesPer100g: 21, protein: 1.5, carbs: 5.0, fat: 0.2, defaultUnit: '份', defaultGrams: 80, emoji: '🍄', favorite: false },

  // ========== 水果类 ==========
  { id: 40, name: '香蕉', category: '水果', caloriesPer100g: 89, protein: 1.1, carbs: 22.8, fat: 0.3, defaultUnit: '根', defaultGrams: 120, emoji: '🍌', favorite: false },
  { id: 41, name: '苹果', category: '水果', caloriesPer100g: 52, protein: 0.3, carbs: 14.0, fat: 0.2, defaultUnit: '个', defaultGrams: 200, emoji: '🍎', favorite: false },
  { id: 42, name: '蓝莓', category: '水果', caloriesPer100g: 57, protein: 0.7, carbs: 14.5, fat: 0.3, defaultUnit: '份', defaultGrams: 100, emoji: '🫐', favorite: false },
  { id: 43, name: '橙子', category: '水果', caloriesPer100g: 47, protein: 0.9, carbs: 11.8, fat: 0.1, defaultUnit: '个', defaultGrams: 200, emoji: '🍊', favorite: false },
  { id: 44, name: '猕猴桃', category: '水果', caloriesPer100g: 61, protein: 1.1, carbs: 14.7, fat: 0.5, defaultUnit: '个', defaultGrams: 80, emoji: '🥝', favorite: false },
  { id: 54, name: '牛油果', category: '水果', caloriesPer100g: 160, protein: 2.0, carbs: 8.5, fat: 14.7, defaultUnit: '个', defaultGrams: 150, emoji: '🥑', favorite: false },
  { id: 170, name: '葡萄', category: '水果', caloriesPer100g: 69, protein: 0.7, carbs: 18.1, fat: 0.2, defaultUnit: '份', defaultGrams: 150, emoji: '🍇', favorite: false },
  { id: 171, name: '西瓜', category: '水果', caloriesPer100g: 30, protein: 0.6, carbs: 7.6, fat: 0.2, defaultUnit: '块', defaultGrams: 300, emoji: '🍉', favorite: false },
  { id: 172, name: '芒果', category: '水果', caloriesPer100g: 60, protein: 0.8, carbs: 15.0, fat: 0.4, defaultUnit: '个', defaultGrams: 200, emoji: '🥭', favorite: false },
  { id: 173, name: '草莓', category: '水果', caloriesPer100g: 32, protein: 0.7, carbs: 7.7, fat: 0.3, defaultUnit: '份', defaultGrams: 150, emoji: '🍓', favorite: false },
  { id: 174, name: '樱桃', category: '水果', caloriesPer100g: 63, protein: 1.1, carbs: 16.0, fat: 0.2, defaultUnit: '份', defaultGrams: 100, emoji: '🍒', favorite: false },
  { id: 175, name: '桃子', category: '水果', caloriesPer100g: 39, protein: 0.9, carbs: 9.5, fat: 0.3, defaultUnit: '个', defaultGrams: 200, emoji: '🍑', favorite: false },
  { id: 176, name: '梨', category: '水果', caloriesPer100g: 57, protein: 0.4, carbs: 15.2, fat: 0.1, defaultUnit: '个', defaultGrams: 200, emoji: '🍐', favorite: false },
  { id: 177, name: '火龙果', category: '水果', caloriesPer100g: 55, protein: 1.1, carbs: 13.3, fat: 0.4, defaultUnit: '个', defaultGrams: 250, emoji: '🐉', favorite: false },
  { id: 178, name: '柚子', category: '水果', caloriesPer100g: 42, protein: 0.8, carbs: 10.7, fat: 0.1, defaultUnit: '份', defaultGrams: 200, emoji: '🍊', favorite: false },
  { id: 179, name: '哈密瓜', category: '水果', caloriesPer100g: 34, protein: 0.8, carbs: 8.2, fat: 0.2, defaultUnit: '份', defaultGrams: 200, emoji: '🍈', favorite: false },
  { id: 180, name: '石榴', category: '水果', caloriesPer100g: 83, protein: 1.7, carbs: 18.7, fat: 1.2, defaultUnit: '个', defaultGrams: 150, emoji: '🍎', favorite: false },

  // ========== 坚果类 ==========
  { id: 50, name: '花生酱', category: '坚果', caloriesPer100g: 588, protein: 25.1, carbs: 20.0, fat: 50.4, defaultUnit: '勺', defaultGrams: 15, emoji: '🥜', favorite: false },
  { id: 51, name: '杏仁', category: '坚果', caloriesPer100g: 578, protein: 21.2, carbs: 21.7, fat: 49.4, defaultUnit: '份', defaultGrams: 25, emoji: '🌰', favorite: false },
  { id: 52, name: '核桃', category: '坚果', caloriesPer100g: 654, protein: 15.2, carbs: 13.7, fat: 65.2, defaultUnit: '个', defaultGrams: 10, emoji: '🌰', favorite: false },
  { id: 190, name: '腰果', category: '坚果', caloriesPer100g: 553, protein: 18.2, carbs: 30.2, fat: 43.9, defaultUnit: '份', defaultGrams: 25, emoji: '🥜', favorite: false },
  { id: 191, name: '开心果', category: '坚果', caloriesPer100g: 560, protein: 20.2, carbs: 27.2, fat: 45.3, defaultUnit: '份', defaultGrams: 25, emoji: '🌰', favorite: false },
  { id: 192, name: '南瓜子', category: '坚果', caloriesPer100g: 559, protein: 30.2, carbs: 10.7, fat: 49.1, defaultUnit: '份', defaultGrams: 20, emoji: '🌰', favorite: false },
  { id: 193, name: '亚麻籽', category: '坚果', caloriesPer100g: 534, protein: 18.3, carbs: 28.9, fat: 42.2, defaultUnit: '勺', defaultGrams: 10, emoji: '🌾', favorite: false },
  { id: 194, name: '奇亚籽', category: '坚果', caloriesPer100g: 486, protein: 16.5, carbs: 42.1, fat: 30.7, defaultUnit: '勺', defaultGrams: 15, emoji: '🌾', favorite: false },
  { id: 195, name: '花生(生)', category: '坚果', caloriesPer100g: 567, protein: 25.8, carbs: 16.1, fat: 49.2, defaultUnit: '份', defaultGrams: 25, emoji: '🥜', favorite: false },
  { id: 196, name: '巴旦木', category: '坚果', caloriesPer100g: 578, protein: 21.2, carbs: 21.7, fat: 49.4, defaultUnit: '份', defaultGrams: 25, emoji: '🌰', favorite: false },
  { id: 197, name: '混合坚果', category: '坚果', caloriesPer100g: 580, protein: 18.0, carbs: 22.0, fat: 50.0, defaultUnit: '份', defaultGrams: 10, emoji: '🌰', favorite: false },

  // ========== 油脂类 ==========
  { id: 53, name: '橄榄油', category: '油脂', caloriesPer100g: 884, protein: 0, carbs: 0, fat: 100, defaultUnit: '勺', defaultGrams: 10, emoji: '🫒', favorite: false },
  { id: 200, name: '椰子油', category: '油脂', caloriesPer100g: 862, protein: 0, carbs: 0, fat: 100, defaultUnit: '勺', defaultGrams: 10, emoji: '🥥', favorite: false },
  { id: 201, name: '黄油', category: '油脂', caloriesPer100g: 717, protein: 0.9, carbs: 0.1, fat: 81.1, defaultUnit: '勺', defaultGrams: 10, emoji: '🧈', favorite: false },
  { id: 202, name: '芝麻油', category: '油脂', caloriesPer100g: 884, protein: 0, carbs: 0, fat: 100, defaultUnit: '勺', defaultGrams: 5, emoji: '🫒', favorite: false },
  { id: 203, name: '菜籽油', category: '油脂', caloriesPer100g: 884, protein: 0, carbs: 0, fat: 100, defaultUnit: '勺', defaultGrams: 10, emoji: '🫒', favorite: false },

  // ========== 豆制品 ==========
  { id: 55, name: '豆腐', category: '豆制品', caloriesPer100g: 76, protein: 8.1, carbs: 1.9, fat: 3.7, defaultUnit: '块', defaultGrams: 200, emoji: '🫘', favorite: false },
  { id: 210, name: '豆浆(无糖)', category: '豆制品', caloriesPer100g: 33, protein: 3.0, carbs: 1.8, fat: 1.6, defaultUnit: '杯', defaultGrams: 300, emoji: '🥛', favorite: false },
  { id: 211, name: '腐竹(干)', category: '豆制品', caloriesPer100g: 459, protein: 44.6, carbs: 22.3, fat: 21.7, defaultUnit: '份', defaultGrams: 30, emoji: '🫘', favorite: false },
  { id: 212, name: '豆干', category: '豆制品', caloriesPer100g: 140, protein: 16.2, carbs: 4.9, fat: 6.0, defaultUnit: '块', defaultGrams: 80, emoji: '🫘', favorite: false },
  { id: 213, name: '毛豆', category: '豆制品', caloriesPer100g: 131, protein: 13.1, carbs: 8.9, fat: 5.0, defaultUnit: '份', defaultGrams: 100, emoji: '🫛', favorite: false },
  { id: 214, name: '黑豆', category: '豆制品', caloriesPer100g: 341, protein: 36.0, carbs: 33.6, fat: 15.9, defaultUnit: '份', defaultGrams: 30, emoji: '🫘', favorite: false },
  { id: 215, name: '豆腐皮', category: '豆制品', caloriesPer100g: 204, protein: 23.0, carbs: 3.5, fat: 11.0, defaultUnit: '份', defaultGrams: 50, emoji: '🫘', favorite: false },
  { id: 216, name: '纳豆', category: '豆制品', caloriesPer100g: 211, protein: 17.7, carbs: 14.4, fat: 9.8, defaultUnit: '份', defaultGrams: 50, emoji: '🫘', favorite: false },

  // ========== 补剂/调味 ==========
  { id: 220, name: '鱼油', category: '补剂', caloriesPer100g: 900, protein: 0, carbs: 0, fat: 100, defaultUnit: '粒', defaultGrams: 1, emoji: '💊', favorite: false },
  { id: 221, name: '复合维生素', category: '补剂', caloriesPer100g: 0, protein: 0, carbs: 0, fat: 0, defaultUnit: '粒', defaultGrams: 1, emoji: '💊', favorite: false },
  { id: 222, name: '蜂蜜', category: '补剂', caloriesPer100g: 321, protein: 0.3, carbs: 79.6, fat: 0, defaultUnit: '勺', defaultGrams: 15, emoji: '🍯', favorite: false },
  { id: 223, name: '肌酸', category: '补剂', caloriesPer100g: 0, protein: 0, carbs: 0, fat: 0, defaultUnit: '勺', defaultGrams: 5, emoji: '💊', favorite: false },
  { id: 224, name: '谷氨酰胺', category: '补剂', caloriesPer100g: 0, protein: 0, carbs: 0, fat: 0, defaultUnit: '勺', defaultGrams: 5, emoji: '💊', favorite: false },
];

const FOOD_CATEGORIES = ['全部', '主食', '肉类', '蛋奶', '蔬菜', '水果', '坚果', '油脂', '豆制品', '补剂'];

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
  const d = new Date(dateStr + 'T12:00:00');
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function formatDateFull(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
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
