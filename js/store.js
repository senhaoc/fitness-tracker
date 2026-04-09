// ============================================================
// 健身追踪应用 - 状态管理层
// LocalStorage 持久化 / 响应式状态
// ============================================================

const STORAGE_KEY = 'fitness_tracker_v4';

const Store = {
  _data: null,

  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this._data = JSON.parse(saved);
      } catch(e) {
        this._data = this._createEmpty();
      }
    } else {
      this._data = this._createEmpty();
    }
    this._save();
    return this._data;
  },

  _createEmpty() {
    return {
      profile: {
        name: '', gender: '', age: '', height: '', currentWeight: '',
        targetWeight: '', currentWaist: '', targetWaist: '',
        activityLevel: '中等活跃', goalType: '减脂',
        dailyCalorieGoal: 2000, proteinGoal: 150, carbsGoal: 200, fatGoal: 60,
        createdAt: getToday(), setupComplete: false,
        googleId: '', email: '', avatar: '',
      },
      bodyMeasurements: [], meals: [], workouts: [], progressPhotos: [],
    };
  },

  isSetupComplete() {
    return this._data && this._data.profile && this._data.profile.setupComplete === true;
  },

  completeSetup(profileData) {
    Object.assign(this._data.profile, profileData, { setupComplete: true, createdAt: getToday() });
    this._save();
  },

  getData() {
    if (!this._data) this.init();
    return this._data;
  },

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
  },

  resetToSample() {
    this._data = generateSampleData();
    this._data.profile.setupComplete = true;
    this._save();
    return this._data;
  },

  resetToEmpty() {
    this._data = this._createEmpty();
    this._save();
    return this._data;
  },

  // Profile
  updateProfile(profileData) {
    Object.assign(this._data.profile, profileData);
    this._save();
  },

  // Body Measurements
  addBodyMeasurement(m) {
    m.id = generateId();
    this._data.bodyMeasurements.push(m);
    this._data.bodyMeasurements.sort((a, b) => a.date.localeCompare(b.date));
    this._save();
    return m;
  },

  updateBodyMeasurement(id, updates) {
    const idx = this._data.bodyMeasurements.findIndex(m => m.id === id);
    if (idx >= 0) {
      Object.assign(this._data.bodyMeasurements[idx], updates);
      this._save();
    }
  },

  deleteBodyMeasurement(id) {
    this._data.bodyMeasurements = this._data.bodyMeasurements.filter(m => m.id !== id);
    this._save();
  },

  getLatestMeasurement() {
    const ms = this._data.bodyMeasurements;
    return ms.length > 0 ? ms[ms.length - 1] : null;
  },

  getMeasurementsByPeriod(days) {
    if (!days) return [...this._data.bodyMeasurements];
    const since = getDaysAgo(days);
    return this._data.bodyMeasurements.filter(m => m.date >= since);
  },

  getWeightTrend(days) {
    const ms = this.getMeasurementsByPeriod(days).filter(m => m.weight);
    return ms.map(m => ({ date: m.date, value: m.weight }));
  },

  getWaistTrend(days) {
    const ms = this.getMeasurementsByPeriod(days).filter(m => m.waist);
    return ms.map(m => ({ date: m.date, value: m.waist }));
  },

  // Meals
  addMeal(meal) {
    meal.id = generateId();
    this._data.meals.push(meal);
    this._save();
    return meal;
  },

  updateMeal(id, updates) {
    const idx = this._data.meals.findIndex(m => m.id === id);
    if (idx >= 0) {
      Object.assign(this._data.meals[idx], updates);
      this._save();
    }
  },

  deleteMeal(id) {
    this._data.meals = this._data.meals.filter(m => m.id !== id);
    this._save();
  },

  deleteFoodFromMeal(mealId, foodId) {
    const meal = this._data.meals.find(m => m.id === mealId);
    if (meal) {
      meal.foods = meal.foods.filter(f => f.id !== foodId);
      this._save();
    }
  },

  getMealsByDate(date) {
    return this._data.meals.filter(m => m.date === date);
  },

  getDailyNutrition(date) {
    const meals = this.getMealsByDate(date);
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    const byMeal = {};
    meals.forEach(meal => {
      let mealCal = 0;
      meal.foods.forEach(f => {
        totals.calories += f.calories;
        totals.protein += f.protein;
        totals.carbs += f.carbs;
        totals.fat += f.fat;
        mealCal += f.calories;
      });
      byMeal[meal.type] = mealCal;
    });
    return {
      ...totals,
      protein: Math.round(totals.protein * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fat: Math.round(totals.fat * 10) / 10,
      byMeal,
    };
  },

  copyMealsFromDate(fromDate, toDate) {
    const source = this.getMealsByDate(fromDate);
    source.forEach(meal => {
      const newMeal = {
        ...meal,
        id: generateId(),
        date: toDate,
        foods: meal.foods.map(f => ({ ...f, id: generateId() })),
      };
      this._data.meals.push(newMeal);
    });
    this._save();
  },

  // Workouts
  addWorkout(workout) {
    workout.id = generateId();
    this._data.workouts.push(workout);
    this._data.workouts.sort((a, b) => a.date.localeCompare(b.date));
    this._save();
    return workout;
  },

  updateWorkout(id, updates) {
    const idx = this._data.workouts.findIndex(w => w.id === id);
    if (idx >= 0) {
      Object.assign(this._data.workouts[idx], updates);
      this._save();
    }
  },

  deleteWorkout(id) {
    this._data.workouts = this._data.workouts.filter(w => w.id !== id);
    this._save();
  },

  getWorkoutsByDate(date) {
    return this._data.workouts.filter(w => w.date === date);
  },

  getWorkoutsByPeriod(days) {
    if (!days) return [...this._data.workouts];
    const since = getDaysAgo(days);
    return this._data.workouts.filter(w => w.date >= since);
  },

  getWeeklyWorkoutCount() {
    const since = getDaysAgo(7);
    return this._data.workouts.filter(w => w.date >= since).length;
  },

  getMonthlyWorkoutCount() {
    const since = getDaysAgo(30);
    return this._data.workouts.filter(w => w.date >= since).length;
  },

  getBodyPartFrequency(days) {
    const workouts = this.getWorkoutsByPeriod(days);
    const freq = {};
    BODY_PARTS.forEach(bp => freq[bp] = 0);
    workouts.forEach(w => {
      (w.bodyParts || []).forEach(bp => {
        freq[bp] = (freq[bp] || 0) + 1;
      });
    });
    return freq;
  },

  getTotalCaloriesBurned(days) {
    return this.getWorkoutsByPeriod(days).reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  },

  getTotalTrainingDuration(days) {
    return this.getWorkoutsByPeriod(days).reduce((sum, w) => sum + (w.duration || 0), 0);
  },

  // Progress Photos
  addProgressPhoto(photo) {
    photo.id = generateId();
    this._data.progressPhotos.push(photo);
    this._save();
    return photo;
  },

  deleteProgressPhoto(id) {
    this._data.progressPhotos = this._data.progressPhotos.filter(p => p.id !== id);
    this._save();
  },

  // Analytics
  getStreakDays() {
    let streak = 0;
    const today = getToday();
    for (let i = 0; i < 365; i++) {
      const date = getDaysAgo(i);
      const hasMeasurement = this._data.bodyMeasurements.some(m => m.date === date);
      const hasMeal = this._data.meals.some(m => m.date === date);
      const hasWorkout = this._data.workouts.some(w => w.date === date);
      if (hasMeasurement || hasMeal || hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  },

  getProgressSummary() {
    const ms = this._data.bodyMeasurements;
    if (ms.length < 2) return null;

    const first = ms[0];
    const latest = ms[ms.length - 1];
    const firstWaist = ms.find(m => m.waist)?.waist;
    const latestWaist = [...ms].reverse().find(m => m.waist)?.waist;

    return {
      startDate: first.date,
      currentDate: latest.date,
      startWeight: first.weight,
      currentWeight: latest.weight,
      weightChange: Math.round((latest.weight - first.weight) * 10) / 10,
      weightChangePercent: Math.round((latest.weight - first.weight) / first.weight * 1000) / 10,
      startWaist: firstWaist,
      currentWaist: latestWaist,
      waistChange: firstWaist && latestWaist ? Math.round((latestWaist - firstWaist) * 10) / 10 : null,
      totalWorkouts: this._data.workouts.length,
      totalCaloriesBurned: this._data.workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0),
    };
  },

  getAverageNutrition(days) {
    let totalCal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0, dayCount = 0;
    for (let i = 0; i < days; i++) {
      const date = getDaysAgo(i);
      const nutrition = this.getDailyNutrition(date);
      if (nutrition.calories > 0) {
        totalCal += nutrition.calories;
        totalProtein += nutrition.protein;
        totalCarbs += nutrition.carbs;
        totalFat += nutrition.fat;
        dayCount++;
      }
    }
    if (dayCount === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return {
      calories: Math.round(totalCal / dayCount),
      protein: Math.round(totalProtein / dayCount),
      carbs: Math.round(totalCarbs / dayCount),
      fat: Math.round(totalFat / dayCount),
    };
  },

  // Custom Foods
  getCustomFoods() {
    try {
      return JSON.parse(localStorage.getItem('ft_custom_foods') || '[]');
    } catch(e) { return []; }
  },

  addCustomFood(food) {
    const foods = this.getCustomFoods();
    food.id = 'c_' + Date.now();
    food.custom = true;
    foods.push(food);
    localStorage.setItem('ft_custom_foods', JSON.stringify(foods));
    return food;
  },

  deleteCustomFood(id) {
    const foods = this.getCustomFoods().filter(f => f.id !== id);
    localStorage.setItem('ft_custom_foods', JSON.stringify(foods));
  },
};
