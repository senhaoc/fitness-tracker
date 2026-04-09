// ============================================================
// 健身追踪应用 - Vue 3 主应用
// ============================================================

const { createApp, ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } = Vue;

try {
  Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  Chart.defaults.font.size = 11;
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.animation.duration = 600;
} catch(e) { console.warn('Chart.js config skipped:', e); }

// ============================================================
// ROOT APP
// ============================================================
const app = createApp({
  setup() {
    const currentTab = ref('home');
    const darkMode = ref(localStorage.getItem('ft_dark') === '1');
    const storeData = Store.init();
    const state = reactive({
      profile: storeData.profile,
      bodyMeasurements: storeData.bodyMeasurements,
      meals: storeData.meals,
      workouts: storeData.workouts,
      progressPhotos: storeData.progressPhotos,
    });
    const showOnboarding = ref(!Store.isSetupComplete());
    const toastMsg = ref('');
    let toastTimer = null;

    watch(darkMode, (v) => {
      document.documentElement.classList.toggle('dark', v);
      localStorage.setItem('ft_dark', v ? '1' : '0');
    }, { immediate: true });

    function showToast(msg) {
      toastMsg.value = msg;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastMsg.value = '', 2500);
    }

    function refreshData() {
      const d = Store.getData();
      state.profile = d.profile;
      state.bodyMeasurements = d.bodyMeasurements;
      state.meals = d.meals;
      state.workouts = d.workouts;
      state.progressPhotos = d.progressPhotos;
    }

    function resetData() {
      const d = Store.resetToSample();
      state.profile = d.profile;
      state.bodyMeasurements = d.bodyMeasurements;
      state.meals = d.meals;
      state.workouts = d.workouts;
      state.progressPhotos = d.progressPhotos;
      showToast('已重置为示例数据');
    }

    function onSetupComplete() {
      refreshData();
      showOnboarding.value = false;
      showToast('欢迎使用 FitTrack！');
    }

    function logout() {
      const d = Store.resetToEmpty();
      state.profile = d.profile;
      state.bodyMeasurements = d.bodyMeasurements;
      state.meals = d.meals;
      state.workouts = d.workouts;
      state.progressPhotos = d.progressPhotos;
      showOnboarding.value = true;
    }

    return { currentTab, darkMode, state, toastMsg, showOnboarding, showToast, refreshData, resetData, onSetupComplete, logout };
  },
  template: `
    <onboarding-page v-if="showOnboarding" @complete="onSetupComplete" />
    <template v-else>
      <div class="page-container" style="background:var(--bg);">
        <home-page v-if="currentTab==='home'" :state="state" @navigate="currentTab=$event" @refresh="refreshData" @toast="showToast" />
        <diet-page v-if="currentTab==='diet'" :state="state" @refresh="refreshData" @toast="showToast" />
        <workout-page v-if="currentTab==='workout'" :state="state" @refresh="refreshData" @toast="showToast" />
        <analytics-page v-if="currentTab==='analytics'" :state="state" @refresh="refreshData" />
        <profile-page v-if="currentTab==='profile'" :state="state" :dark-mode="darkMode"
          @refresh="refreshData" @toast="showToast" @toggle-dark="darkMode=!darkMode" @reset="resetData" @logout="logout" />
      </div>
      <nav class="bottom-nav">
        <button v-for="t in [{id:'home',label:'首页',icon:'🏠'},{id:'diet',label:'饮食',icon:'🍽️'},{id:'workout',label:'训练',icon:'💪'},{id:'analytics',label:'数据',icon:'📊'},{id:'profile',label:'我的',icon:'👤'}]"
          :key="t.id" class="nav-item" :class="{active:currentTab===t.id}" @click="currentTab=t.id">
          <span class="nav-icon">{{t.icon}}</span><span>{{t.label}}</span>
        </button>
      </nav>
    </template>
    <div v-if="toastMsg" class="toast">{{toastMsg}}</div>
  `,
});


// ============================================================
// ONBOARDING PAGE — 欢迎引导 + Google登录 + 个人档案设置
// ============================================================
app.component('onboarding-page', {
  emits: ['complete'],
  setup(props, { emit }) {
    const step = ref(1);
    const googleLoading = ref(false);
    const form = reactive({
      name: '', gender: '男', age: '', height: '', currentWeight: '',
      targetWeight: '', currentWaist: '', targetWaist: '',
      activityLevel: '中等活跃', goalType: '减脂',
      dailyCalorieGoal: 2000, proteinGoal: 150, carbsGoal: 200, fatGoal: 60,
      avatar: '', email: '', googleId: '',
    });

    function handleGoogleSignIn() {
      const clientId = localStorage.getItem('ft_google_client_id') || '';
      if (!clientId || clientId === 'YOUR_CLIENT_ID.apps.googleusercontent.com') {
        const id = prompt(
          'Google 登录需要 OAuth Client ID。\n\n' +
          '获取方法：\n' +
          '1. 打开 console.cloud.google.com\n' +
          '2. 创建项目 → API和服务 → 凭据\n' +
          '3. 创建 OAuth 2.0 客户端 ID（Web 应用）\n' +
          '4. 添加已授权的 JavaScript 来源\n' +
          '5. 复制 Client ID 粘贴到下方\n\n' +
          '或点取消，使用「手动创建档案」。',
        );
        if (!id || !id.includes('.apps.googleusercontent.com')) {
          step.value = 2;
          return;
        }
        localStorage.setItem('ft_google_client_id', id);
      }
      if (typeof google === 'undefined' || !google.accounts) {
        alert('Google 登录服务加载中，请稍后再试。');
        step.value = 2;
        return;
      }
      googleLoading.value = true;
      try {
        google.accounts.id.initialize({
          client_id: localStorage.getItem('ft_google_client_id'),
          callback: (response) => {
            googleLoading.value = false;
            try {
              const payload = JSON.parse(atob(response.credential.split('.')[1]));
              form.name = payload.name || '';
              form.email = payload.email || '';
              form.avatar = payload.picture || '';
              form.googleId = payload.sub || '';
              step.value = 2;
            } catch(e) {
              alert('登录解析失败，请使用手动创建档案。');
              step.value = 2;
            }
          },
        });
        google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            googleLoading.value = false;
            google.accounts.id.renderButton(
              document.getElementById('google-signin-btn'),
              { theme: 'outline', size: 'large', text: 'signin_with', locale: 'zh_CN', width: 300 }
            );
          }
        });
      } catch(e) {
        googleLoading.value = false;
        alert('Google 登录失败，已切换到手动创建档案。');
        step.value = 2;
      }
    }

    function skipToManual() {
      step.value = 2;
    }

    function goToGoals() {
      if (!form.name || !form.gender || !form.age || !form.height || !form.currentWeight) {
        alert('请填写基本信息（姓名、性别、年龄、身高、体重）');
        return;
      }
      step.value = 3;
    }

    function finishSetup() {
      const profile = {
        name: form.name,
        gender: form.gender,
        age: parseInt(form.age) || 25,
        height: parseFloat(form.height) || 170,
        currentWeight: parseFloat(form.currentWeight) || 70,
        targetWeight: parseFloat(form.targetWeight) || parseFloat(form.currentWeight) - 5,
        currentWaist: parseFloat(form.currentWaist) || 0,
        targetWaist: parseFloat(form.targetWaist) || 0,
        activityLevel: form.activityLevel,
        goalType: form.goalType,
        dailyCalorieGoal: parseInt(form.dailyCalorieGoal) || 2000,
        proteinGoal: parseInt(form.proteinGoal) || 150,
        carbsGoal: parseInt(form.carbsGoal) || 200,
        fatGoal: parseInt(form.fatGoal) || 60,
        avatar: form.avatar,
        email: form.email,
        googleId: form.googleId,
      };
      Store.completeSetup(profile);
      if (form.currentWeight) {
        Store.addBodyMeasurement({
          date: getToday(),
          weight: parseFloat(form.currentWeight),
          waist: form.currentWaist ? parseFloat(form.currentWaist) : null,
        });
      }
      emit('complete');
    }

    function loadDemo() {
      const d = Store.resetToSample();
      emit('complete');
    }

    const suggestedCalories = computed(() => {
      const w = parseFloat(form.currentWeight) || 70;
      const h = parseFloat(form.height) || 170;
      const a = parseInt(form.age) || 25;
      let bmr = form.gender === '男' ? 10*w + 6.25*h - 5*a + 5 : 10*w + 6.25*h - 5*a - 161;
      const mult = { '久坐':1.2, '轻度活跃':1.375, '中等活跃':1.55, '非常活跃':1.725 };
      let tdee = Math.round(bmr * (mult[form.activityLevel] || 1.55));
      if (form.goalType === '减脂') tdee -= 400;
      else if (form.goalType === '增肌') tdee += 300;
      return tdee;
    });

    watch(suggestedCalories, (v) => {
      form.dailyCalorieGoal = v;
      const cal = v;
      if (form.goalType === '减脂') {
        form.proteinGoal = Math.round(parseFloat(form.currentWeight || 70) * 2);
        form.fatGoal = Math.round(cal * 0.25 / 9);
        form.carbsGoal = Math.round((cal - form.proteinGoal * 4 - form.fatGoal * 9) / 4);
      } else if (form.goalType === '增肌') {
        form.proteinGoal = Math.round(parseFloat(form.currentWeight || 70) * 1.8);
        form.fatGoal = Math.round(cal * 0.25 / 9);
        form.carbsGoal = Math.round((cal - form.proteinGoal * 4 - form.fatGoal * 9) / 4);
      } else {
        form.proteinGoal = Math.round(parseFloat(form.currentWeight || 70) * 1.6);
        form.fatGoal = Math.round(cal * 0.3 / 9);
        form.carbsGoal = Math.round((cal - form.proteinGoal * 4 - form.fatGoal * 9) / 4);
      }
    });

    return { step, form, googleLoading, handleGoogleSignIn, skipToManual, goToGoals, finishSetup, loadDemo, suggestedCalories };
  },
  template: `
    <div style="min-height:100vh;background:var(--bg);display:flex;flex-direction:column;">
      <!-- Step 1: Welcome -->
      <div v-if="step===1" style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:32px 24px;text-align:center;">
        <div style="font-size:64px;margin-bottom:16px;">💪</div>
        <div style="font-size:28px;font-weight:800;margin-bottom:8px;color:var(--text);">FitTrack</div>
        <div style="font-size:15px;color:var(--text-secondary);margin-bottom:40px;line-height:1.6;">
          你的专属健身追踪助手<br/>记录体重·饮食·训练·见证改变
        </div>

        <div id="google-signin-btn" style="display:flex;justify-content:center;margin-bottom:16px;"></div>

        <button class="btn" @click="handleGoogleSignIn" :disabled="googleLoading"
          style="width:100%;padding:14px;border-radius:12px;font-size:15px;font-weight:600;background:white;color:#1f1f1f;border:1.5px solid #dadce0;margin-bottom:12px;gap:10px;">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style="width:20px;height:20px;" />
          {{ googleLoading ? '正在连接...' : '使用 Google 账号登录' }}
        </button>

        <button class="btn" @click="skipToManual"
          style="width:100%;padding:14px;border-radius:12px;font-size:15px;font-weight:600;background:var(--primary);color:white;">
          手动创建档案
        </button>

        <button @click="loadDemo" style="margin-top:24px;background:none;border:none;color:var(--text-secondary);font-size:13px;cursor:pointer;text-decoration:underline;">
          跳过，使用示例数据体验
        </button>
      </div>

      <!-- Step 2: Basic Info -->
      <div v-if="step===2" style="flex:1;padding:24px;overflow-y:auto;">
        <div style="margin-bottom:24px;">
          <div style="font-size:13px;color:var(--primary);font-weight:600;">第 1 步 / 共 2 步</div>
          <div style="font-size:22px;font-weight:800;margin-top:4px;color:var(--text);">建立你的档案</div>
          <div style="font-size:14px;color:var(--text-secondary);margin-top:4px;">填写基本信息，我们会为你计算推荐热量</div>
        </div>

        <div v-if="form.avatar" style="text-align:center;margin-bottom:16px;">
          <img :src="form.avatar" style="width:64px;height:64px;border-radius:50%;border:3px solid var(--primary);" />
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">{{ form.email }}</div>
        </div>

        <div class="form-group">
          <label class="form-label">你的名字 *</label>
          <input class="form-input" v-model="form.name" placeholder="如何称呼你？" />
        </div>
        <div class="form-group">
          <label class="form-label">性别 *</label>
          <div class="pill-group">
            <span class="pill" :class="{active:form.gender==='男'}" @click="form.gender='男'" style="flex:1;text-align:center;">🙋‍♂️ 男</span>
            <span class="pill" :class="{active:form.gender==='女'}" @click="form.gender='女'" style="flex:1;text-align:center;">🙋‍♀️ 女</span>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">年龄 *</label>
            <input class="form-input" type="number" v-model="form.age" placeholder="25" />
          </div>
          <div class="form-group">
            <label class="form-label">身高 (cm) *</label>
            <input class="form-input" type="number" v-model="form.height" placeholder="170" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">当前体重 (kg) *</label>
            <input class="form-input" type="number" step="0.1" v-model="form.currentWeight" placeholder="70.0" />
          </div>
          <div class="form-group">
            <label class="form-label">当前腰围 (cm)</label>
            <input class="form-input" type="number" step="0.1" v-model="form.currentWaist" placeholder="可选" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">活动水平</label>
          <div class="pill-group">
            <span v-for="lv in ['久坐','轻度活跃','中等活跃','非常活跃']" :key="lv" class="pill" :class="{active:form.activityLevel===lv}" @click="form.activityLevel=lv" style="font-size:12px;">{{lv}}</span>
          </div>
        </div>

        <button class="btn btn-primary" @click="goToGoals" style="margin-top:8px;">下一步 →</button>
        <button @click="step=1" style="width:100%;margin-top:12px;background:none;border:none;color:var(--text-secondary);font-size:13px;cursor:pointer;">← 返回</button>
      </div>

      <!-- Step 3: Goals -->
      <div v-if="step===3" style="flex:1;padding:24px;overflow-y:auto;">
        <div style="margin-bottom:24px;">
          <div style="font-size:13px;color:var(--primary);font-weight:600;">第 2 步 / 共 2 步</div>
          <div style="font-size:22px;font-weight:800;margin-top:4px;color:var(--text);">设定你的目标</div>
          <div style="font-size:14px;color:var(--text-secondary);margin-top:4px;">我们根据你的信息推荐了目标值，你可以自由调整</div>
        </div>

        <div class="form-group">
          <label class="form-label">目标类型</label>
          <div class="pill-group">
            <span class="pill" :class="{active:form.goalType==='减脂'}" @click="form.goalType='减脂'" style="flex:1;text-align:center;">🔥 减脂</span>
            <span class="pill" :class="{active:form.goalType==='增肌'}" @click="form.goalType='增肌'" style="flex:1;text-align:center;">💪 增肌</span>
            <span class="pill" :class="{active:form.goalType==='维持'}" @click="form.goalType='维持'" style="flex:1;text-align:center;">⚖️ 维持</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">目标体重 (kg)</label>
            <input class="form-input" type="number" step="0.1" v-model="form.targetWeight" />
          </div>
          <div class="form-group">
            <label class="form-label">目标腰围 (cm)</label>
            <input class="form-input" type="number" step="0.1" v-model="form.targetWaist" placeholder="可选" />
          </div>
        </div>

        <div class="card" style="margin:16px 0;background:linear-gradient(135deg,#ecfdf5,#f0fdf4);border-color:#a7f3d0;">
          <div style="font-size:13px;font-weight:600;color:#059669;margin-bottom:8px;">📊 推荐每日摄入</div>
          <div style="font-size:28px;font-weight:800;color:#059669;">{{suggestedCalories}} kcal</div>
          <div style="font-size:12px;color:#064e3b;margin-top:4px;">基于你的 BMR × 活动水平 {{form.goalType==='减脂'?'- 400 热量缺口':form.goalType==='增肌'?'+ 300 热量盈余':''}}</div>
        </div>

        <div class="form-group">
          <label class="form-label">每日热量目标 (kcal)</label>
          <input class="form-input" type="number" v-model="form.dailyCalorieGoal" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">蛋白质 (g)</label>
            <input class="form-input" type="number" v-model="form.proteinGoal" />
          </div>
          <div class="form-group">
            <label class="form-label">碳水 (g)</label>
            <input class="form-input" type="number" v-model="form.carbsGoal" />
          </div>
          <div class="form-group">
            <label class="form-label">脂肪 (g)</label>
            <input class="form-input" type="number" v-model="form.fatGoal" />
          </div>
        </div>

        <button class="btn btn-primary" @click="finishSetup" style="margin-top:12px;">✓ 开始使用 FitTrack</button>
        <button @click="step=2" style="width:100%;margin-top:12px;background:none;border:none;color:var(--text-secondary);font-size:13px;cursor:pointer;">← 返回上一步</button>
      </div>
    </div>
  `,
});


// ============================================================
// NUTRITION RING
// ============================================================
app.component('nutrition-ring', {
  props: ['label','value','goal','color','unit'],
  setup(props) {
    const pct = computed(() => props.goal > 0 ? Math.min(Math.round(props.value / props.goal * 100), 100) : 0);
    const r = 28, c = 2 * Math.PI * r;
    const dashArray = computed(() => `${c * pct.value / 100} ${c}`);
    return { pct, dashArray };
  },
  template: `
    <div style="flex:1;text-align:center;">
      <div class="progress-ring" style="width:68px;height:68px;margin:0 auto;">
        <svg width="68" height="68">
          <circle cx="34" cy="34" r="28" fill="none" stroke="var(--border)" stroke-width="5"/>
          <circle cx="34" cy="34" r="28" fill="none" :stroke="color" stroke-width="5" stroke-linecap="round" :stroke-dasharray="dashArray"/>
        </svg>
        <div class="center-text" style="font-size:12px;font-weight:700;">{{pct}}%</div>
      </div>
      <div style="font-size:12px;font-weight:600;margin-top:4px;color:var(--text);">{{Math.round(value)}}{{unit}}</div>
      <div style="font-size:11px;color:var(--text-secondary);">{{label}}</div>
    </div>
  `,
});


// ============================================================
// MINI LINE CHART
// ============================================================
app.component('mini-line-chart', {
  props: ['data','color'],
  setup(props) {
    const canvasRef = ref(null);
    let chart = null;
    function render() {
      nextTick(() => {
        if (!canvasRef.value) return;
        if (chart) chart.destroy();
        const isDark = document.documentElement.classList.contains('dark');
        chart = new Chart(canvasRef.value.getContext('2d'), {
          type: 'line',
          data: {
            labels: (props.data||[]).map(d => formatDate(d.date)),
            datasets: [{ data: (props.data||[]).map(d => d.value), borderColor: props.color||'#10b981', backgroundColor: (props.color||'#10b981')+'20', fill:true, tension:0.4, borderWidth:2.5, pointRadius:3, pointBackgroundColor: props.color||'#10b981' }],
          },
          options: {
            responsive:true, maintainAspectRatio:false,
            scales: { x:{ grid:{display:false}, ticks:{color:'#94a3b8',font:{size:10}} }, y:{ grid:{color:isDark?'#334155':'#f1f5f9'}, ticks:{color:'#94a3b8',font:{size:10}} } },
            plugins: { tooltip:{ backgroundColor:isDark?'#1e293b':'#0f172a', cornerRadius:8, padding:8 } },
          },
        });
      });
    }
    onMounted(render);
    watch(() => props.data, render, { deep:true });
    onUnmounted(() => { if (chart) chart.destroy(); });
    return { canvasRef };
  },
  template: `<div style="height:160px;"><canvas ref="canvasRef"></canvas></div>`,
});


// ============================================================
// TREND CHART (larger, for analytics page)
// ============================================================
app.component('trend-chart', {
  props: ['data','label','color'],
  setup(props) {
    const canvasRef = ref(null);
    let chart = null;
    function render() {
      nextTick(() => {
        if (!canvasRef.value) return;
        if (chart) chart.destroy();
        const d = props.data || [];
        if (d.length === 0) return;
        const isDark = document.documentElement.classList.contains('dark');
        chart = new Chart(canvasRef.value.getContext('2d'), {
          type: 'line',
          data: {
            labels: d.map(p => formatDate(p.date)),
            datasets: [{ label: props.label, data: d.map(p => p.value), borderColor: props.color, backgroundColor: props.color+'15', fill:true, tension:0.3, borderWidth:2.5, pointRadius: d.length>30?0:3, pointHoverRadius:5, pointBackgroundColor: props.color }],
          },
          options: {
            responsive:true, maintainAspectRatio:false, interaction:{intersect:false,mode:'index'},
            scales: { x:{ grid:{display:false}, ticks:{color:'#94a3b8',maxTicksLimit:7,font:{size:10}} }, y:{ grid:{color:isDark?'#334155':'#f1f5f9'}, ticks:{color:'#94a3b8',font:{size:10}} } },
            plugins: { legend:{display:true,labels:{boxWidth:12,font:{size:12}}}, tooltip:{backgroundColor:isDark?'#1e293b':'#0f172a',cornerRadius:8,padding:10} },
          },
        });
      });
    }
    onMounted(render);
    watch(() => [props.data, props.color], render, { deep:true });
    onUnmounted(() => { if (chart) chart.destroy(); });
    return { canvasRef };
  },
  template: `
    <div>
      <div v-if="!data||data.length===0" class="empty-state" style="padding:20px;"><div class="icon">📈</div><div class="desc">暂无数据</div></div>
      <div v-else style="height:220px;"><canvas ref="canvasRef"></canvas></div>
    </div>
  `,
});


// ============================================================
// HOME PAGE
// ============================================================
app.component('home-page', {
  props: ['state'],
  emits: ['navigate','refresh','toast'],
  setup(props, { emit }) {
    const showWeightModal = ref(false);
    const newWeight = ref('');
    const newWaist = ref('');
    const today = computed(() => getToday());

    const greeting = computed(() => {
      const h = new Date().getHours();
      if (h<6) return '夜深了'; if (h<12) return '早上好'; if (h<14) return '中午好'; if (h<18) return '下午好'; return '晚上好';
    });

    const latestWeight = computed(() => {
      for (let i = props.state.bodyMeasurements.length-1; i>=0; i--) {
        if (props.state.bodyMeasurements[i].weight) return props.state.bodyMeasurements[i].weight;
      }
      return null;
    });

    const latestWaist = computed(() => {
      for (let i = props.state.bodyMeasurements.length-1; i>=0; i--) {
        if (props.state.bodyMeasurements[i].waist) return props.state.bodyMeasurements[i].waist;
      }
      return null;
    });

    const todayNutrition = computed(() => {
      const todayMeals = props.state.meals.filter(m => m.date === today.value);
      const t = { calories:0, protein:0, carbs:0, fat:0 };
      todayMeals.forEach(meal => meal.foods.forEach(f => { t.calories+=f.calories; t.protein+=f.protein; t.carbs+=f.carbs; t.fat+=f.fat; }));
      return { calories:t.calories, protein:Math.round(t.protein*10)/10, carbs:Math.round(t.carbs*10)/10, fat:Math.round(t.fat*10)/10 };
    });

    const todayWorkouts = computed(() => props.state.workouts.filter(w => w.date === today.value));

    const weekWorkoutCount = computed(() => {
      const since = getDaysAgo(7);
      return props.state.workouts.filter(w => w.date >= since).length;
    });

    const streak = computed(() => {
      let s = 0;
      for (let i=0; i<365; i++) {
        const d = getDaysAgo(i);
        const has = props.state.bodyMeasurements.some(m => m.date===d) || props.state.meals.some(m => m.date===d) || props.state.workouts.some(w => w.date===d);
        if (has) s++; else if (i>0) break;
      }
      return s;
    });

    const weightTrend7 = computed(() => {
      const since = getDaysAgo(7);
      return props.state.bodyMeasurements.filter(m => m.date >= since && m.weight).map(m => ({date:m.date, value:m.weight}));
    });

    const weekWeightChange = computed(() => {
      const t = weightTrend7.value;
      if (t.length < 2) return null;
      return Math.round((t[t.length-1].value - t[0].value)*10)/10;
    });

    function saveWeight() {
      if (!newWeight.value && !newWaist.value) return;
      const existing = props.state.bodyMeasurements.find(m => m.date === today.value);
      if (existing) {
        Store.updateBodyMeasurement(existing.id, {
          weight: newWeight.value ? parseFloat(newWeight.value) : existing.weight,
          waist: newWaist.value ? parseFloat(newWaist.value) : existing.waist,
        });
      } else {
        Store.addBodyMeasurement({ date:today.value, weight: newWeight.value?parseFloat(newWeight.value):null, waist: newWaist.value?parseFloat(newWaist.value):null });
      }
      emit('refresh'); showWeightModal.value = false; newWeight.value=''; newWaist.value='';
      emit('toast','记录已保存 ✓');
    }

    return { today, greeting, latestWeight, latestWaist, todayNutrition, todayWorkouts, weekWorkoutCount, streak, weightTrend7, weekWeightChange, showWeightModal, newWeight, newWaist, saveWeight };
  },
  template: `
    <div style="padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <div>
          <div style="font-size:14px;color:var(--text-secondary);">{{greeting}}，{{state.profile.name}}</div>
          <div style="font-size:22px;font-weight:800;margin-top:2px;">今日概览</div>
        </div>
        <div class="tag" v-if="streak>0">🔥 连续{{streak}}天</div>
      </div>

      <div class="stats-grid" style="margin-bottom:16px;">
        <div class="stat-card" @click="showWeightModal=true" style="cursor:pointer;">
          <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">📏 当前体重</div>
          <div class="stat-value">{{latestWeight||'--'}}<span class="stat-unit"> kg</span></div>
          <div v-if="weekWeightChange!==null" style="font-size:12px;margin-top:4px;" :style="{color:weekWeightChange<=0?'#10b981':'#ef4444'}">
            本周 {{weekWeightChange>0?'+':''}}{{weekWeightChange}} kg
          </div>
        </div>
        <div class="stat-card">
          <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">📐 当前腰围</div>
          <div class="stat-value">{{latestWaist||'--'}}<span class="stat-unit"> cm</span></div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">目标 {{state.profile.targetWaist}} cm</div>
        </div>
        <div class="stat-card">
          <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">🔥 今日热量</div>
          <div class="stat-value">{{todayNutrition.calories}}<span class="stat-unit"> kcal</span></div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">目标 {{state.profile.dailyCalorieGoal}} kcal</div>
        </div>
        <div class="stat-card">
          <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">💪 本周训练</div>
          <div class="stat-value">{{weekWorkoutCount}}<span class="stat-unit"> 次</span></div>
          <div style="font-size:12px;margin-top:4px;" :style="{color:todayWorkouts.length>0?'#10b981':'#f59e0b'}">
            {{todayWorkouts.length>0?'✓ 今日已训练':'今日未训练'}}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="section-header">
          <span class="section-title" style="font-size:15px;">今日营养</span>
          <span class="section-link" @click="$emit('navigate','diet')">详情 →</span>
        </div>
        <div style="display:flex;gap:12px;">
          <nutrition-ring label="蛋白质" :value="todayNutrition.protein" :goal="state.profile.proteinGoal" color="#3b82f6" unit="g" />
          <nutrition-ring label="碳水" :value="todayNutrition.carbs" :goal="state.profile.carbsGoal" color="#f59e0b" unit="g" />
          <nutrition-ring label="脂肪" :value="todayNutrition.fat" :goal="state.profile.fatGoal" color="#ef4444" unit="g" />
        </div>
      </div>

      <div class="card">
        <div class="section-header">
          <span class="section-title" style="font-size:15px;">体重趋势 (7天)</span>
          <span class="section-link" @click="$emit('navigate','analytics')">查看更多 →</span>
        </div>
        <mini-line-chart :data="weightTrend7" color="#10b981" />
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-size:15px;font-weight:700;margin-bottom:10px;">快速记录</div>
        <div class="quick-actions">
          <div class="quick-btn" @click="showWeightModal=true"><span class="icon">⚖️</span><span>记体重</span></div>
          <div class="quick-btn" @click="$emit('navigate','diet')"><span class="icon">🍽️</span><span>记饮食</span></div>
          <div class="quick-btn" @click="$emit('navigate','workout')"><span class="icon">🏋️</span><span>记训练</span></div>
          <div class="quick-btn" @click="$emit('navigate','analytics')"><span class="icon">📸</span><span>对比照</span></div>
        </div>
      </div>

      <div class="card" style="background:linear-gradient(135deg,#ecfdf5,#f0fdf4);border-color:#a7f3d0;">
        <div style="font-size:14px;font-weight:700;margin-bottom:8px;color:#059669;">📋 今日总结</div>
        <div style="font-size:13px;color:#064e3b;line-height:1.6;">
          <div v-if="todayNutrition.calories>0">
            今日已摄入 <b>{{todayNutrition.calories}} kcal</b>，
            蛋白质 {{todayNutrition.protein}}g / 碳水 {{todayNutrition.carbs}}g / 脂肪 {{todayNutrition.fat}}g
          </div>
          <div v-else style="color:#92400e;">⚠️ 今日尚未记录饮食，请及时记录</div>
          <div v-if="todayWorkouts.length>0" style="margin-top:4px;">
            已完成 <b>{{todayWorkouts.length}}</b> 次训练，消耗约 <b>{{todayWorkouts.reduce((s,w)=>s+(w.caloriesBurned||0),0)}} kcal</b>
          </div>
          <div v-else style="margin-top:4px;color:#92400e;">⚠️ 今日尚未训练，动起来吧！</div>
        </div>
      </div>
    </div>

    <div v-if="showWeightModal" class="modal-overlay" @click.self="showWeightModal=false">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div style="font-size:18px;font-weight:700;margin-bottom:16px;">记录体重/腰围</div>
        <div class="form-group">
          <label class="form-label">体重 (kg)</label>
          <input class="form-input" type="number" step="0.1" v-model="newWeight" :placeholder="latestWeight?'上次: '+latestWeight:'输入体重'" />
        </div>
        <div class="form-group">
          <label class="form-label">腰围 (cm) - 可选</label>
          <input class="form-input" type="number" step="0.1" v-model="newWaist" :placeholder="latestWaist?'上次: '+latestWaist:'输入腰围'" />
        </div>
        <button class="btn btn-primary" @click="saveWeight" style="margin-top:8px;">保存记录</button>
      </div>
    </div>
  `,
});


// ============================================================
// DIET PAGE — reads from props.state.meals (reactive)
// ============================================================
app.component('diet-page', {
  props: ['state'],
  emits: ['refresh','toast'],
  setup(props, { emit }) {
    const selectedDate = ref(getToday());
    const showAddFood = ref(false);
    const addMealType = ref('');
    const searchQuery = ref('');
    const selectedCategory = ref('全部');
    const mealTypes = ['早餐','午餐','晚餐','加餐'];

    const meals = computed(() => props.state.meals.filter(m => m.date === selectedDate.value));

    const nutrition = computed(() => {
      const t = { calories:0, protein:0, carbs:0, fat:0 };
      meals.value.forEach(meal => meal.foods.forEach(f => { t.calories+=f.calories; t.protein+=f.protein; t.carbs+=f.carbs; t.fat+=f.fat; }));
      return { calories:t.calories, protein:Math.round(t.protein*10)/10, carbs:Math.round(t.carbs*10)/10, fat:Math.round(t.fat*10)/10 };
    });

    function getMealData(type) {
      const meal = meals.value.find(m => m.type === type);
      return meal ? meal : null;
    }
    function getMealFoods(type) {
      const meal = getMealData(type);
      return meal ? meal.foods : [];
    }
    function getMealCalories(type) {
      return getMealFoods(type).reduce((s,f) => s+f.calories, 0);
    }

    function openAddFood(type) {
      addMealType.value = type;
      searchQuery.value = '';
      selectedCategory.value = '全部';
      showAddFood.value = true;
    }

    const filteredFoods = computed(() => {
      let foods = FOOD_DATABASE;
      if (selectedCategory.value !== '全部') foods = foods.filter(f => f.category === selectedCategory.value);
      if (searchQuery.value) { const q = searchQuery.value.toLowerCase(); foods = foods.filter(f => f.name.toLowerCase().includes(q)); }
      return foods;
    });

    function addFoodToMeal(food) {
      const multiplier = food.defaultGrams / 100;
      const foodEntry = {
        id: generateId(), foodId: food.id, name: food.name, emoji: food.emoji,
        quantity: 1, grams: food.defaultGrams, unit: food.defaultUnit,
        calories: Math.round(food.caloriesPer100g * multiplier),
        protein: Math.round(food.protein * multiplier * 10)/10,
        carbs: Math.round(food.carbs * multiplier * 10)/10,
        fat: Math.round(food.fat * multiplier * 10)/10,
      };
      const existingMeal = getMealData(addMealType.value);
      if (existingMeal) {
        existingMeal.foods.push(foodEntry);
        Store.updateMeal(existingMeal.id, { foods: existingMeal.foods });
      } else {
        Store.addMeal({
          date: selectedDate.value, type: addMealType.value, foods: [foodEntry],
          time: addMealType.value==='早餐'?'07:30':addMealType.value==='午餐'?'12:00':addMealType.value==='晚餐'?'18:30':'15:30', note:'',
        });
      }
      emit('refresh'); showAddFood.value = false;
      emit('toast', food.name + ' 已添加');
    }

    function removeFood(mealType, foodId) {
      const meal = getMealData(mealType);
      if (meal) { Store.deleteFoodFromMeal(meal.id, foodId); emit('refresh'); }
    }

    function changeDate(delta) {
      const d = new Date(selectedDate.value); d.setDate(d.getDate()+delta);
      selectedDate.value = d.toISOString().split('T')[0];
    }

    function copyYesterday() {
      const yesterday = getDaysAgo(1);
      const yMeals = props.state.meals.filter(m => m.date === yesterday);
      if (yMeals.length === 0) { emit('toast','昨天没有饮食记录'); return; }
      Store.copyMealsFromDate(yesterday, selectedDate.value);
      emit('refresh'); emit('toast','已复制昨天的饮食记录');
    }

    const isToday = computed(() => selectedDate.value === getToday());
    const calPercent = computed(() => {
      const goal = props.state.profile.dailyCalorieGoal;
      return goal > 0 ? Math.min(Math.round(nutrition.value.calories / goal * 100), 100) : 0;
    });

    return { selectedDate, meals, nutrition, mealTypes, getMealFoods, getMealCalories, showAddFood, addMealType, searchQuery, selectedCategory, filteredFoods, openAddFood, addFoodToMeal, removeFood, changeDate, copyYesterday, isToday, calPercent };
  },
  template: `
    <div style="padding:16px;">
      <div class="date-nav">
        <button class="arrow" @click="changeDate(-1)">◀</button>
        <div class="date-label">{{isToday?'今天 ':''}}{{formatDate(selectedDate)}}</div>
        <button class="arrow" @click="changeDate(1)">▶</button>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-weight:700;font-size:15px;">每日摄入</span>
          <span style="font-size:13px;color:var(--text-secondary);">{{nutrition.calories}} / {{state.profile.dailyCalorieGoal}} kcal</span>
        </div>
        <div class="nutrition-bar">
          <div class="fill" :style="{width:calPercent+'%',background:calPercent>100?'#ef4444':'#10b981'}"></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <div style="flex:1;text-align:center;padding:8px;border-radius:10px;background:var(--bg);">
            <div style="font-size:16px;font-weight:700;color:#3b82f6;">{{Math.round(nutrition.protein)}}g</div>
            <div style="font-size:11px;color:var(--text-secondary);">蛋白质</div>
          </div>
          <div style="flex:1;text-align:center;padding:8px;border-radius:10px;background:var(--bg);">
            <div style="font-size:16px;font-weight:700;color:#f59e0b;">{{Math.round(nutrition.carbs)}}g</div>
            <div style="font-size:11px;color:var(--text-secondary);">碳水</div>
          </div>
          <div style="flex:1;text-align:center;padding:8px;border-radius:10px;background:var(--bg);">
            <div style="font-size:16px;font-weight:700;color:#ef4444;">{{Math.round(nutrition.fat)}}g</div>
            <div style="font-size:11px;color:var(--text-secondary);">脂肪</div>
          </div>
        </div>
      </div>

      <div v-if="meals.length===0" style="text-align:center;margin-bottom:12px;">
        <button class="btn btn-outline btn-sm" @click="copyYesterday">📋 复制昨天的饮食</button>
      </div>

      <div v-for="type in mealTypes" :key="type" class="meal-section">
        <div class="meal-header">
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-weight:700;font-size:15px;">{{type==='早餐'?'🌅':type==='午餐'?'☀️':type==='晚餐'?'🌙':'🍪'}} {{type}}</span>
            <span v-if="getMealCalories(type)>0" class="badge" style="font-size:11px;">{{getMealCalories(type)}} kcal</span>
          </div>
          <button class="btn btn-sm btn-outline" @click="openAddFood(type)" style="font-size:18px;padding:4px 10px;">+</button>
        </div>
        <div v-if="getMealFoods(type).length===0" style="text-align:center;padding:16px;background:var(--card);border-radius:12px;border:1px dashed var(--border);color:var(--text-secondary);font-size:13px;">
          点击 + 添加食物
        </div>
        <div v-for="food in getMealFoods(type)" :key="food.id" class="food-item">
          <div class="food-emoji">{{food.emoji}}</div>
          <div class="food-info">
            <div class="food-name">{{food.name}}</div>
            <div class="food-detail">{{food.quantity}}{{food.unit}} · {{food.grams}}g</div>
          </div>
          <div style="text-align:right;">
            <div class="food-cal">{{food.calories}} kcal</div>
            <div style="font-size:10px;color:var(--text-secondary);">P{{food.protein}} C{{food.carbs}} F{{food.fat}}</div>
          </div>
          <button style="background:none;border:none;cursor:pointer;font-size:16px;color:var(--text-secondary);padding:4px;" @click="removeFood(type,food.id)">✕</button>
        </div>
      </div>
    </div>

    <div v-if="showAddFood" class="modal-overlay" @click.self="showAddFood=false">
      <div class="modal-sheet" style="max-height:85vh;">
        <div class="modal-handle"></div>
        <div style="font-size:18px;font-weight:700;margin-bottom:12px;">添加食物 · {{addMealType}}</div>
        <div class="form-group">
          <input class="form-input" v-model="searchQuery" placeholder="🔍 搜索食物..." style="font-size:15px;" />
        </div>
        <div class="pill-group" style="margin-bottom:14px;">
          <span v-for="cat in ['全部','主食','肉类','蛋奶','蔬菜','水果','坚果']" :key="cat" class="pill" :class="{active:selectedCategory===cat}" @click="selectedCategory=cat">{{cat}}</span>
        </div>
        <div style="max-height:50vh;overflow-y:auto;">
          <div v-for="food in filteredFoods" :key="food.id" class="food-item" @click="addFoodToMeal(food)" style="cursor:pointer;">
            <div class="food-emoji">{{food.emoji}}</div>
            <div class="food-info">
              <div class="food-name">{{food.name}}</div>
              <div class="food-detail">每{{food.defaultUnit}}({{food.defaultGrams}}g) · {{Math.round(food.caloriesPer100g*food.defaultGrams/100)}} kcal</div>
            </div>
            <div style="color:var(--primary);font-size:20px;font-weight:300;">+</div>
          </div>
          <div v-if="filteredFoods.length===0" class="empty-state" style="padding:20px;">
            <div class="icon">🔍</div><div class="desc">未找到匹配食物</div>
          </div>
        </div>
      </div>
    </div>
  `,
});


// ============================================================
// WORKOUT PAGE — reads from props.state.workouts (reactive)
// ============================================================
app.component('workout-page', {
  props: ['state'],
  emits: ['refresh','toast'],
  setup(props, { emit }) {
    const selectedDate = ref(getToday());
    const showAddWorkout = ref(false);
    const showAddExercise = ref(false);
    const viewMode = ref('today');

    const newWorkout = reactive({
      name:'', type:'strength', bodyParts:[], exercises:[], cardio:null,
      startTime:'09:00', duration:60, caloriesBurned:300, note:'',
    });
    const newExercise = reactive({ name:'', sets:[{reps:10,weight:0,rpe:7}] });
    const selectedBodyPart = ref('胸');
    const exerciseSearch = ref('');

    const todayWorkouts = computed(() => props.state.workouts.filter(w => w.date === selectedDate.value));

    const recentWorkouts = computed(() => {
      const since = getDaysAgo(30);
      return [...props.state.workouts].filter(w => w.date >= since).sort((a,b) => b.date.localeCompare(a.date)).slice(0,15);
    });

    const isToday = computed(() => selectedDate.value === getToday());

    function changeDate(delta) {
      const d = new Date(selectedDate.value); d.setDate(d.getDate()+delta);
      selectedDate.value = d.toISOString().split('T')[0];
    }

    function startAddWorkout() {
      Object.assign(newWorkout, { name:'',type:'strength',bodyParts:[],exercises:[],cardio:null,startTime:'09:00',duration:60,caloriesBurned:300,note:'' });
      showAddWorkout.value = true;
    }

    function toggleBodyPart(bp) {
      const idx = newWorkout.bodyParts.indexOf(bp);
      if (idx>=0) newWorkout.bodyParts.splice(idx,1); else newWorkout.bodyParts.push(bp);
    }

    function openAddExercise() {
      Object.assign(newExercise, { name:'', sets:[{reps:10,weight:0,rpe:7}] });
      exerciseSearch.value = '';
      selectedBodyPart.value = newWorkout.bodyParts[0] || '胸';
      showAddExercise.value = true;
    }

    const exerciseOptions = computed(() => {
      const presets = EXERCISE_PRESETS[selectedBodyPart.value] || [];
      return exerciseSearch.value ? presets.filter(e => e.includes(exerciseSearch.value)) : presets;
    });

    function selectExerciseName(name) { newExercise.name = name; }
    function addSet() { newExercise.sets.push({...newExercise.sets[newExercise.sets.length-1]}); }
    function removeSet(idx) { if (newExercise.sets.length>1) newExercise.sets.splice(idx,1); }

    function confirmExercise() {
      if (!newExercise.name) { emit('toast','请选择动作名称'); return; }
      newWorkout.exercises.push({
        id: generateId(), name: newExercise.name,
        sets: newExercise.sets.map((s,i) => ({ id:generateId(), setNumber:i+1, reps:parseInt(s.reps)||0, weight:parseFloat(s.weight)||0, rpe:parseFloat(s.rpe)||0, isPR:false })),
      });
      showAddExercise.value = false;
    }

    function removeExercise(idx) { newWorkout.exercises.splice(idx,1); }

    function saveWorkout() {
      if (newWorkout.type==='strength' && newWorkout.exercises.length===0) { emit('toast','请添加至少一个动作'); return; }
      Store.addWorkout({
        date: selectedDate.value,
        name: newWorkout.name || (newWorkout.type==='strength' ? (newWorkout.bodyParts.join('+')||'力量')+'训练' : '有氧训练'),
        type: newWorkout.type, bodyParts: [...newWorkout.bodyParts],
        exercises: JSON.parse(JSON.stringify(newWorkout.exercises)),
        cardio: newWorkout.type==='cardio' ? { activity:newWorkout.name||'跑步', duration:parseInt(newWorkout.duration)||30, distance:0, pace:'', incline:0, caloriesBurned:parseInt(newWorkout.caloriesBurned)||200 } : null,
        startTime: newWorkout.startTime, endTime:'', duration:parseInt(newWorkout.duration)||60,
        caloriesBurned: parseInt(newWorkout.caloriesBurned)||300, note: newWorkout.note,
      });
      emit('refresh'); showAddWorkout.value = false;
      emit('toast','训练记录已保存 ✓');
    }

    function deleteWorkout(id) { Store.deleteWorkout(id); emit('refresh'); emit('toast','已删除'); }

    function copyLastWorkout() {
      if (props.state.workouts.length===0) { emit('toast','没有历史训练记录'); return; }
      const last = props.state.workouts[props.state.workouts.length-1];
      Object.assign(newWorkout, {
        name: last.name, type: last.type, bodyParts:[...(last.bodyParts||[])],
        exercises: JSON.parse(JSON.stringify(last.exercises||[])),
        cardio: last.cardio?{...last.cardio}:null, duration:last.duration, caloriesBurned:last.caloriesBurned, note:'',
      });
      showAddWorkout.value = true;
      emit('toast','已加载上次训练模板');
    }

    return { selectedDate, isToday, todayWorkouts, recentWorkouts, showAddWorkout, showAddExercise, viewMode, newWorkout, newExercise, selectedBodyPart, exerciseSearch, exerciseOptions, changeDate, startAddWorkout, toggleBodyPart, openAddExercise, selectExerciseName, addSet, removeSet, confirmExercise, removeExercise, saveWorkout, deleteWorkout, copyLastWorkout };
  },
  template: `
    <div style="padding:16px;">
      <div class="tabs">
        <button class="tab" :class="{active:viewMode==='today'}" @click="viewMode='today'">今日训练</button>
        <button class="tab" :class="{active:viewMode==='history'}" @click="viewMode='history'">历史记录</button>
      </div>

      <div v-if="viewMode==='today'">
        <div class="date-nav">
          <button class="arrow" @click="changeDate(-1)">◀</button>
          <div class="date-label">{{isToday?'今天 ':''}}{{formatDate(selectedDate)}}</div>
          <button class="arrow" @click="changeDate(1)">▶</button>
        </div>

        <div v-if="todayWorkouts.length===0" class="empty-state">
          <div class="icon">🏋️</div>
          <div class="title">{{isToday?'今日尚未训练':'当日无训练记录'}}</div>
          <div class="desc">开始记录你的训练吧</div>
          <div style="display:flex;gap:8px;justify-content:center;">
            <button class="btn btn-primary" style="width:auto;padding:10px 24px;" @click="startAddWorkout">+ 新建训练</button>
            <button class="btn btn-outline" style="padding:10px 24px;" @click="copyLastWorkout">📋 复制上次</button>
          </div>
        </div>

        <div v-else>
          <div v-for="w in todayWorkouts" :key="w.id" class="workout-card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div style="font-weight:700;font-size:16px;">
                  {{w.type==='cardio'?'🏃':w.type==='hiit'?'⚡':'🏋️'}} {{w.name}}
                </div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">
                  {{w.duration}}分钟 · {{w.caloriesBurned}} kcal
                  <span v-for="bp in w.bodyParts" :key="bp" class="tag" style="margin-left:4px;font-size:10px;">{{bp}}</span>
                </div>
              </div>
              <button class="btn-icon" @click="deleteWorkout(w.id)" style="font-size:14px;color:#ef4444;">🗑</button>
            </div>
            <div v-if="w.exercises&&w.exercises.length>0" class="exercise-sets">
              <div v-for="ex in w.exercises" :key="ex.id" style="margin-top:10px;">
                <div style="font-weight:600;font-size:13px;color:var(--primary);">{{ex.name}}</div>
                <div class="set-row" v-for="s in ex.sets" :key="s.id">
                  <span>第{{s.setNumber}}组</span>
                  <span>{{s.weight>0?s.weight+'kg × ':''}}{{s.reps}}次</span>
                  <span v-if="s.rpe">RPE {{s.rpe}}</span>
                </div>
              </div>
            </div>
            <div v-if="w.cardio" style="margin-top:8px;font-size:13px;color:var(--text-secondary);">
              {{w.cardio.activity}} · {{w.cardio.duration}}分钟 <span v-if="w.cardio.distance"> · {{w.cardio.distance}}km</span>
            </div>
          </div>
          <button class="btn btn-outline" style="width:100%;margin-top:8px;" @click="startAddWorkout">+ 添加训练</button>
        </div>
      </div>

      <div v-if="viewMode==='history'">
        <div style="font-size:15px;font-weight:700;margin-bottom:12px;">最近30天训练记录</div>
        <div v-if="recentWorkouts.length===0" class="empty-state"><div class="icon">📭</div><div class="desc">暂无训练记录</div></div>
        <div v-for="w in recentWorkouts" :key="w.id" class="workout-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:12px;color:var(--text-secondary);">{{formatDate(w.date)}}</div>
              <div style="font-weight:700;font-size:15px;margin-top:2px;">{{w.name}}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:13px;font-weight:600;color:var(--primary);">{{w.caloriesBurned}} kcal</div>
              <div style="font-size:12px;color:var(--text-secondary);">{{w.duration}}分钟</div>
            </div>
          </div>
          <div v-if="w.exercises&&w.exercises.length" style="margin-top:6px;font-size:12px;color:var(--text-secondary);">
            {{w.exercises.map(e=>e.name).join(' · ')}}
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddWorkout" class="modal-full">
      <div style="padding:16px;padding-top:20px;">
        <div class="modal-header">
          <button class="btn btn-sm btn-outline" @click="showAddWorkout=false">← 返回</button>
          <span style="font-weight:700;font-size:17px;">添加训练</span>
          <button class="btn btn-sm" style="background:var(--primary);color:white;" @click="saveWorkout">保存</button>
        </div>
        <div class="form-group">
          <label class="form-label">训练类型</label>
          <div class="pill-group">
            <span v-for="t in [{id:'strength',name:'🏋️ 力量'},{id:'cardio',name:'🏃 有氧'},{id:'hiit',name:'⚡ HIIT'},{id:'stretch',name:'🧘 拉伸'}]"
              :key="t.id" class="pill" :class="{active:newWorkout.type===t.id}" @click="newWorkout.type=t.id">{{t.name}}</span>
          </div>
        </div>
        <template v-if="newWorkout.type==='strength'">
          <div class="form-group">
            <label class="form-label">训练部位</label>
            <div class="pill-group">
              <span v-for="bp in ['胸','背','腿','肩','手臂','核心']" :key="bp" class="pill" :class="{active:newWorkout.bodyParts.includes(bp)}" @click="toggleBodyPart(bp)">{{bp}}</span>
            </div>
          </div>
          <div style="margin-bottom:14px;">
            <label class="form-label">训练动作</label>
            <div v-for="(ex,idx) in newWorkout.exercises" :key="ex.id" class="card card-sm" style="margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:600;font-size:14px;color:var(--primary);">{{ex.name}}</span>
                <button style="background:none;border:none;cursor:pointer;color:#ef4444;font-size:14px;" @click="removeExercise(idx)">删除</button>
              </div>
              <div v-for="s in ex.sets" :key="s.id" class="set-row" style="font-size:12px;">
                <span>第{{s.setNumber}}组</span>
                <span>{{s.weight>0?s.weight+'kg × ':''}}{{s.reps}}次 (RPE {{s.rpe}})</span>
              </div>
            </div>
            <button class="btn btn-outline" style="width:100%;" @click="openAddExercise">+ 添加动作</button>
          </div>
        </template>
        <div class="form-group">
          <label class="form-label">训练名称</label>
          <input class="form-input" v-model="newWorkout.name" :placeholder="newWorkout.type==='cardio'?'如: 跑步':'如: 胸+三头'" />
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">时长(分钟)</label><input class="form-input" type="number" v-model="newWorkout.duration" /></div>
          <div class="form-group"><label class="form-label">消耗(kcal)</label><input class="form-input" type="number" v-model="newWorkout.caloriesBurned" /></div>
        </div>
        <div class="form-group"><label class="form-label">备注</label><input class="form-input" v-model="newWorkout.note" placeholder="可选备注..." /></div>
      </div>
    </div>

    <div v-if="showAddExercise" class="modal-overlay" @click.self="showAddExercise=false">
      <div class="modal-sheet" style="max-height:85vh;">
        <div class="modal-handle"></div>
        <div style="font-size:18px;font-weight:700;margin-bottom:12px;">添加动作</div>
        <div class="form-group">
          <div class="pill-group" style="margin-bottom:10px;">
            <span v-for="bp in ['胸','背','腿','肩','手臂','核心']" :key="bp" class="pill" :class="{active:selectedBodyPart===bp}" @click="selectedBodyPart=bp">{{bp}}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
            <span v-for="name in exerciseOptions" :key="name" class="pill" :class="{active:newExercise.name===name}" @click="selectExerciseName(name)" style="font-size:13px;">{{name}}</span>
          </div>
          <input class="form-input" v-model="newExercise.name" placeholder="或输入自定义动作名称" />
        </div>
        <div style="margin-bottom:14px;">
          <label class="form-label">组数设置</label>
          <div v-for="(s,i) in newExercise.sets" :key="i" style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
            <span style="font-size:12px;color:var(--text-secondary);width:36px;">第{{i+1}}组</span>
            <input class="form-input" type="number" v-model="s.weight" placeholder="重量kg" style="flex:1;" />
            <span style="font-size:12px;">×</span>
            <input class="form-input" type="number" v-model="s.reps" placeholder="次数" style="flex:1;" />
            <input class="form-input" type="number" v-model="s.rpe" placeholder="RPE" style="width:56px;" />
            <button v-if="newExercise.sets.length>1" style="background:none;border:none;cursor:pointer;color:#ef4444;" @click="removeSet(i)">✕</button>
          </div>
          <button class="btn btn-sm btn-outline" @click="addSet" style="margin-top:4px;">+ 添加一组</button>
        </div>
        <button class="btn btn-primary" @click="confirmExercise">确认添加</button>
      </div>
    </div>
  `,
});


// ============================================================
// ANALYTICS PAGE — reads from props.state (reactive)
// ============================================================
app.component('analytics-page', {
  props: ['state'],
  emits: ['refresh'],
  setup(props) {
    const period = ref(30);
    const activeChart = ref('weight');
    const beforePhotoUrl = ref('');
    const afterPhotoUrl = ref('');

    const weightData = computed(() => {
      const since = period.value ? getDaysAgo(period.value) : '0000';
      return props.state.bodyMeasurements.filter(m => m.date >= since && m.weight).map(m => ({date:m.date,value:m.weight}));
    });

    const waistData = computed(() => {
      const since = period.value ? getDaysAgo(period.value) : '0000';
      return props.state.bodyMeasurements.filter(m => m.date >= since && m.waist).map(m => ({date:m.date,value:m.waist}));
    });

    const summary = computed(() => {
      const ms = props.state.bodyMeasurements;
      if (ms.length < 2) return null;
      const first = ms[0], latest = ms[ms.length-1];
      const firstWaist = ms.find(m => m.waist)?.waist;
      const latestWaist = [...ms].reverse().find(m => m.waist)?.waist;
      return {
        startDate: first.date, currentDate: latest.date,
        startWeight: first.weight, currentWeight: latest.weight,
        weightChange: Math.round((latest.weight-first.weight)*10)/10,
        weightChangePercent: Math.round((latest.weight-first.weight)/first.weight*1000)/10,
        startWaist: firstWaist, currentWaist: latestWaist,
        waistChange: firstWaist && latestWaist ? Math.round((latestWaist-firstWaist)*10)/10 : null,
      };
    });

    const avgNutrition = computed(() => {
      const days = period.value || 90;
      let totalCal=0, totalP=0, totalC=0, totalF=0, cnt=0;
      for (let i=0; i<days; i++) {
        const d = getDaysAgo(i);
        const dayMeals = props.state.meals.filter(m => m.date === d);
        let cal=0, p=0, c=0, f=0;
        dayMeals.forEach(meal => meal.foods.forEach(fd => { cal+=fd.calories; p+=fd.protein; c+=fd.carbs; f+=fd.fat; }));
        if (cal > 0) { totalCal+=cal; totalP+=p; totalC+=c; totalF+=f; cnt++; }
      }
      if (!cnt) return {calories:0,protein:0,carbs:0,fat:0};
      return { calories:Math.round(totalCal/cnt), protein:Math.round(totalP/cnt), carbs:Math.round(totalC/cnt), fat:Math.round(totalF/cnt) };
    });

    const workoutsInPeriod = computed(() => {
      const since = period.value ? getDaysAgo(period.value) : '0000';
      return props.state.workouts.filter(w => w.date >= since);
    });

    const totalWorkouts = computed(() => workoutsInPeriod.value.length);
    const totalBurned = computed(() => workoutsInPeriod.value.reduce((s,w)=>s+(w.caloriesBurned||0),0));
    const totalDuration = computed(() => workoutsInPeriod.value.reduce((s,w)=>s+(w.duration||0),0));

    const bodyPartFreq = computed(() => {
      const freq = {}; ['胸','背','腿','肩','手臂','核心'].forEach(bp => freq[bp]=0);
      workoutsInPeriod.value.forEach(w => (w.bodyParts||[]).forEach(bp => { freq[bp]=(freq[bp]||0)+1; }));
      return freq;
    });

    function handlePhoto(event, which) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => { if (which==='before') beforePhotoUrl.value=e.target.result; else afterPhotoUrl.value=e.target.result; };
      reader.readAsDataURL(file);
    }

    return { period, activeChart, weightData, waistData, summary, avgNutrition, totalWorkouts, totalBurned, totalDuration, bodyPartFreq, beforePhotoUrl, afterPhotoUrl, handlePhoto };
  },
  template: `
    <div style="padding:16px;">
      <div style="font-size:22px;font-weight:800;margin-bottom:16px;">数据分析</div>
      <div class="tabs">
        <button v-for="p in [{v:7,l:'7天'},{v:30,l:'30天'},{v:90,l:'90天'},{v:0,l:'全部'}]" :key="p.v" class="tab" :class="{active:period===p.v}" @click="period=p.v">{{p.l}}</button>
      </div>

      <div v-if="summary" class="card" style="margin-bottom:16px;">
        <div style="font-weight:700;font-size:15px;margin-bottom:12px;">📊 进度总览</div>
        <div class="compare-card">
          <div class="compare-item"><div class="compare-label">起始体重</div><div class="compare-value" style="font-size:22px;">{{summary.startWeight}} kg</div></div>
          <div class="compare-item"><div class="compare-label">当前体重</div><div class="compare-value" style="font-size:22px;">{{summary.currentWeight}} kg</div></div>
        </div>
        <div style="text-align:center;margin-bottom:12px;">
          <span class="compare-change" :class="summary.weightChange<=0?'change-negative':'change-positive'" style="font-size:18px;">
            {{summary.weightChange>0?'+':''}}{{summary.weightChange}} kg ({{summary.weightChangePercent>0?'+':''}}{{summary.weightChangePercent}}%)
          </span>
        </div>
        <div v-if="summary.startWaist&&summary.currentWaist" class="compare-card">
          <div class="compare-item"><div class="compare-label">起始腰围</div><div class="compare-value" style="font-size:22px;">{{summary.startWaist}} cm</div></div>
          <div class="compare-item"><div class="compare-label">当前腰围</div><div class="compare-value" style="font-size:22px;">{{summary.currentWaist}} cm</div></div>
        </div>
        <div v-if="summary.waistChange!==null" style="text-align:center;">
          <span class="compare-change" :class="summary.waistChange<=0?'change-negative':'change-positive'">腰围 {{summary.waistChange>0?'+':''}}{{summary.waistChange}} cm</span>
        </div>
      </div>

      <div class="tabs" style="margin-bottom:8px;">
        <button class="tab" :class="{active:activeChart==='weight'}" @click="activeChart='weight'">体重</button>
        <button class="tab" :class="{active:activeChart==='waist'}" @click="activeChart='waist'">腰围</button>
        <button class="tab" :class="{active:activeChart==='nutrition'}" @click="activeChart='nutrition'">营养</button>
      </div>

      <div class="card">
        <trend-chart v-if="activeChart==='weight'" :data="weightData" label="体重 (kg)" color="#10b981" />
        <trend-chart v-if="activeChart==='waist'" :data="waistData" label="腰围 (cm)" color="#3b82f6" />
        <div v-if="activeChart==='nutrition'" style="padding:12px 0;">
          <div style="font-weight:600;font-size:14px;margin-bottom:12px;">日均营养摄入</div>
          <div style="display:flex;gap:8px;">
            <div style="flex:1;text-align:center;padding:12px;border-radius:12px;background:var(--bg);">
              <div style="font-size:22px;font-weight:700;">{{avgNutrition.calories}}</div><div style="font-size:11px;color:var(--text-secondary);">热量 kcal</div>
            </div>
            <div style="flex:1;text-align:center;padding:12px;border-radius:12px;background:var(--bg);">
              <div style="font-size:22px;font-weight:700;color:#3b82f6;">{{avgNutrition.protein}}</div><div style="font-size:11px;color:var(--text-secondary);">蛋白质 g</div>
            </div>
            <div style="flex:1;text-align:center;padding:12px;border-radius:12px;background:var(--bg);">
              <div style="font-size:22px;font-weight:700;color:#f59e0b;">{{avgNutrition.carbs}}</div><div style="font-size:11px;color:var(--text-secondary);">碳水 g</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:12px;">
        <div style="font-weight:700;font-size:15px;margin-bottom:12px;">🏋️ 训练统计</div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-value" style="font-size:20px;">{{totalWorkouts}}</div><div class="stat-label">训练次数</div></div>
          <div class="stat-card"><div class="stat-value" style="font-size:20px;">{{totalBurned}}</div><div class="stat-label">总消耗 kcal</div></div>
          <div class="stat-card"><div class="stat-value" style="font-size:20px;">{{Math.round(totalDuration/60*10)/10}}</div><div class="stat-label">总时长(小时)</div></div>
          <div class="stat-card"><div class="stat-value" style="font-size:20px;">{{totalWorkouts>0?Math.round(totalBurned/totalWorkouts):0}}</div><div class="stat-label">场均消耗</div></div>
        </div>
        <div style="margin-top:14px;">
          <div style="font-size:13px;font-weight:600;margin-bottom:8px;">部位训练频率</div>
          <div v-for="(count,part) in bodyPartFreq" :key="part" style="margin-bottom:6px;">
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:2px;"><span>{{part}}</span><span>{{count}}次</span></div>
            <div class="nutrition-bar"><div class="fill" :style="{width:(totalWorkouts>0?Math.min(count/totalWorkouts*100,100):0)+'%',background:'#10b981'}"></div></div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:12px;">
        <div style="font-weight:700;font-size:15px;margin-bottom:12px;">📸 对比照片</div>
        <div class="photo-compare">
          <div class="photo-box" @click="$refs.beforeInput.click()">
            <img v-if="beforePhotoUrl" :src="beforePhotoUrl" /><div v-else class="placeholder"><div style="font-size:32px;margin-bottom:4px;">📷</div><div>点击上传<br/>之前照片</div></div>
            <div class="photo-label">之前</div><input ref="beforeInput" type="file" accept="image/*" @change="handlePhoto($event,'before')" style="display:none;" />
          </div>
          <div class="photo-box" @click="$refs.afterInput.click()">
            <img v-if="afterPhotoUrl" :src="afterPhotoUrl" /><div v-else class="placeholder"><div style="font-size:32px;margin-bottom:4px;">📷</div><div>点击上传<br/>之后照片</div></div>
            <div class="photo-label">之后</div><input ref="afterInput" type="file" accept="image/*" @change="handlePhoto($event,'after')" style="display:none;" />
          </div>
        </div>
        <div v-if="summary" style="margin-top:12px;text-align:center;font-size:13px;color:var(--text-secondary);">
          {{formatDateFull(summary.startDate)}} → {{formatDateFull(summary.currentDate)}}
        </div>
      </div>
    </div>
  `,
});


// ============================================================
// PROFILE PAGE
// ============================================================
app.component('profile-page', {
  props: ['state','darkMode'],
  emits: ['refresh','toast','toggleDark','reset','logout'],
  setup(props, { emit }) {
    const showEditProfile = ref(false);
    const showGoals = ref(false);
    const showBodyRecord = ref(false);
    const editForm = reactive({});
    const goalForm = reactive({});
    const bodyForm = reactive({ weight:'',waist:'',hip:'',chest:'',arm:'',bodyFat:'',note:'' });

    const streak = computed(() => {
      let s=0;
      for (let i=0;i<365;i++) {
        const d=getDaysAgo(i);
        const has = props.state.bodyMeasurements.some(m=>m.date===d)||props.state.meals.some(m=>m.date===d)||props.state.workouts.some(w=>w.date===d);
        if (has) s++; else if (i>0) break;
      }
      return s;
    });

    const totalWorkouts = computed(() => props.state.workouts.length);

    function openEditProfile() { Object.assign(editForm, props.state.profile); showEditProfile.value=true; }
    function saveProfile() { Store.updateProfile({...editForm}); emit('refresh'); showEditProfile.value=false; emit('toast','个人资料已更新'); }

    function openGoals() {
      Object.assign(goalForm, { goalType:props.state.profile.goalType, targetWeight:props.state.profile.targetWeight, targetWaist:props.state.profile.targetWaist, dailyCalorieGoal:props.state.profile.dailyCalorieGoal, proteinGoal:props.state.profile.proteinGoal, carbsGoal:props.state.profile.carbsGoal, fatGoal:props.state.profile.fatGoal });
      showGoals.value=true;
    }
    function saveGoals() { Store.updateProfile({...goalForm}); emit('refresh'); showGoals.value=false; emit('toast','目标已更新'); }

    function openBodyRecord() { Object.assign(bodyForm,{weight:'',waist:'',hip:'',chest:'',arm:'',bodyFat:'',note:''}); showBodyRecord.value=true; }
    function saveBodyRecord() {
      const m = { date:getToday(), weight:bodyForm.weight?parseFloat(bodyForm.weight):null, waist:bodyForm.waist?parseFloat(bodyForm.waist):null, hip:bodyForm.hip?parseFloat(bodyForm.hip):null, chest:bodyForm.chest?parseFloat(bodyForm.chest):null, arm:bodyForm.arm?parseFloat(bodyForm.arm):null, bodyFat:bodyForm.bodyFat?parseFloat(bodyForm.bodyFat):null, note:bodyForm.note };
      const existing = props.state.bodyMeasurements.find(x => x.date===getToday());
      if (existing) { const u={}; Object.keys(m).forEach(k=>{if(m[k]!==null&&k!=='date')u[k]=m[k]}); Store.updateBodyMeasurement(existing.id,u); }
      else { Store.addBodyMeasurement(m); }
      emit('refresh'); showBodyRecord.value=false; emit('toast','身体数据已记录');
    }

    const latestMeasurements = computed(() => {
      const ms = props.state.bodyMeasurements; if (ms.length===0) return null;
      const latest = {...ms[ms.length-1]};
      for (let i=ms.length-1;i>=0;i--) {
        if (!latest.waist&&ms[i].waist) latest.waist=ms[i].waist;
        if (!latest.hip&&ms[i].hip) latest.hip=ms[i].hip;
        if (!latest.chest&&ms[i].chest) latest.chest=ms[i].chest;
        if (!latest.arm&&ms[i].arm) latest.arm=ms[i].arm;
        if (!latest.bodyFat&&ms[i].bodyFat) latest.bodyFat=ms[i].bodyFat;
      }
      return latest;
    });

    return { showEditProfile,showGoals,showBodyRecord, editForm,goalForm,bodyForm, streak,totalWorkouts,latestMeasurements, openEditProfile,saveProfile,openGoals,saveGoals,openBodyRecord,saveBodyRecord };
  },
  template: `
    <div style="padding:16px;">
      <div class="profile-header">
        <div v-if="state.profile.avatar" style="width:72px;height:72px;border-radius:50%;margin:0 auto 12px;overflow:hidden;border:3px solid var(--primary);">
          <img :src="state.profile.avatar" style="width:100%;height:100%;object-fit:cover;" />
        </div>
        <div v-else class="profile-avatar">{{state.profile.name ? state.profile.name[0] : '?'}}</div>
        <div class="profile-name">{{state.profile.name || '未设置'}}</div>
        <div v-if="state.profile.email" style="font-size:12px;color:var(--text-secondary);">{{state.profile.email}}</div>
        <div class="profile-streak">🔥 连续记录 {{streak}} 天 · 累计训练 {{totalWorkouts}} 次</div>
      </div>

      <div class="stats-grid" style="margin-bottom:16px;">
        <div class="stat-card"><div class="stat-value" style="font-size:18px;">{{state.profile.height}}<span class="stat-unit">cm</span></div><div class="stat-label">身高</div></div>
        <div class="stat-card"><div class="stat-value" style="font-size:18px;">{{state.profile.currentWeight}}<span class="stat-unit">kg</span></div><div class="stat-label">体重</div></div>
        <div class="stat-card"><div class="stat-value" style="font-size:18px;">{{state.profile.age}}<span class="stat-unit">岁</span></div><div class="stat-label">年龄</div></div>
        <div class="stat-card">
          <div class="stat-value" style="font-size:18px;">
            <span class="tag" :class="state.profile.goalType==='减脂'?'':state.profile.goalType==='增肌'?'tag-blue':'tag-orange'">{{state.profile.goalType}}</span>
          </div><div class="stat-label">目标</div>
        </div>
      </div>

      <div class="card" v-if="latestMeasurements">
        <div class="section-header">
          <span class="section-title" style="font-size:15px;">📐 最新围度数据</span>
          <button class="btn btn-sm btn-outline" @click="openBodyRecord">更新</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
          <div v-if="latestMeasurements.waist" style="text-align:center;padding:8px;background:var(--bg);border-radius:10px;"><div style="font-weight:700;">{{latestMeasurements.waist}}</div><div style="font-size:11px;color:var(--text-secondary);">腰围 cm</div></div>
          <div v-if="latestMeasurements.hip" style="text-align:center;padding:8px;background:var(--bg);border-radius:10px;"><div style="font-weight:700;">{{latestMeasurements.hip}}</div><div style="font-size:11px;color:var(--text-secondary);">臀围 cm</div></div>
          <div v-if="latestMeasurements.chest" style="text-align:center;padding:8px;background:var(--bg);border-radius:10px;"><div style="font-weight:700;">{{latestMeasurements.chest}}</div><div style="font-size:11px;color:var(--text-secondary);">胸围 cm</div></div>
          <div v-if="latestMeasurements.arm" style="text-align:center;padding:8px;background:var(--bg);border-radius:10px;"><div style="font-weight:700;">{{latestMeasurements.arm}}</div><div style="font-size:11px;color:var(--text-secondary);">臂围 cm</div></div>
          <div v-if="latestMeasurements.bodyFat" style="text-align:center;padding:8px;background:var(--bg);border-radius:10px;"><div style="font-weight:700;">{{latestMeasurements.bodyFat}}%</div><div style="font-size:11px;color:var(--text-secondary);">体脂率</div></div>
        </div>
      </div>

      <div class="card" style="padding:0;overflow:hidden;">
        <div class="settings-item" @click="openEditProfile"><span class="settings-label">👤 个人资料</span><span class="settings-value">{{state.profile.gender}} · {{state.profile.age}}岁 →</span></div>
        <div class="settings-item" @click="openGoals"><span class="settings-label">🎯 目标设置</span><span class="settings-value">{{state.profile.goalType}} →</span></div>
        <div class="settings-item" @click="openBodyRecord"><span class="settings-label">📏 记录围度</span><span class="settings-value">→</span></div>
        <div class="settings-item" @click="$emit('toggleDark')">
          <span class="settings-label">🌓 深色模式</span>
          <div class="toggle" :class="{active:darkMode}" @click.stop="$emit('toggleDark')"><div class="handle"></div></div>
        </div>
        <div class="settings-item" @click="$emit('reset')">
          <span class="settings-label">🔄 加载示例数据</span><span class="settings-value">→</span>
        </div>
        <div class="settings-item" @click="$emit('logout')" style="color:#ef4444;">
          <span class="settings-label" style="color:#ef4444;">🚪 退出登录</span><span class="settings-value">→</span>
        </div>
      </div>

      <div class="card" style="margin-top:12px;">
        <div style="font-weight:700;font-size:15px;margin-bottom:12px;">🎯 目标进度</div>
        <div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span>体重目标</span><span>{{state.profile.currentWeight}} → {{state.profile.targetWeight}} kg</span></div>
          <div class="nutrition-bar"><div class="fill" :style="{width:Math.min(100,Math.max(5,100-Math.abs(state.profile.currentWeight-state.profile.targetWeight)/10*100))+'%',background:'#10b981'}"></div></div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span>腰围目标</span><span>{{state.profile.currentWaist}} → {{state.profile.targetWaist}} cm</span></div>
          <div class="nutrition-bar"><div class="fill" :style="{width:Math.min(100,Math.max(5,100-Math.abs(state.profile.currentWaist-state.profile.targetWaist)/10*100))+'%',background:'#3b82f6'}"></div></div>
        </div>
      </div>
    </div>

    <div v-if="showEditProfile" class="modal-overlay" @click.self="showEditProfile=false">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div style="font-size:18px;font-weight:700;margin-bottom:16px;">编辑个人资料</div>
        <div class="form-group"><label class="form-label">昵称</label><input class="form-input" v-model="editForm.name" /></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">性别</label><select class="form-input" v-model="editForm.gender"><option>男</option><option>女</option></select></div>
          <div class="form-group"><label class="form-label">年龄</label><input class="form-input" type="number" v-model="editForm.age" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">身高 (cm)</label><input class="form-input" type="number" v-model="editForm.height" /></div>
          <div class="form-group"><label class="form-label">活动水平</label><select class="form-input" v-model="editForm.activityLevel"><option>久坐</option><option>轻度活跃</option><option>中等活跃</option><option>非常活跃</option></select></div>
        </div>
        <button class="btn btn-primary" @click="saveProfile">保存</button>
      </div>
    </div>

    <div v-if="showGoals" class="modal-overlay" @click.self="showGoals=false">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div style="font-size:18px;font-weight:700;margin-bottom:16px;">目标设置</div>
        <div class="form-group"><label class="form-label">目标类型</label>
          <div class="pill-group"><span v-for="g in ['减脂','增肌','维持']" :key="g" class="pill" :class="{active:goalForm.goalType===g}" @click="goalForm.goalType=g">{{g}}</span></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">目标体重 (kg)</label><input class="form-input" type="number" step="0.1" v-model="goalForm.targetWeight" /></div>
          <div class="form-group"><label class="form-label">目标腰围 (cm)</label><input class="form-input" type="number" step="0.1" v-model="goalForm.targetWaist" /></div>
        </div>
        <div class="form-group"><label class="form-label">每日热量目标 (kcal)</label><input class="form-input" type="number" v-model="goalForm.dailyCalorieGoal" /></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">蛋白质 (g)</label><input class="form-input" type="number" v-model="goalForm.proteinGoal" /></div>
          <div class="form-group"><label class="form-label">碳水 (g)</label><input class="form-input" type="number" v-model="goalForm.carbsGoal" /></div>
          <div class="form-group"><label class="form-label">脂肪 (g)</label><input class="form-input" type="number" v-model="goalForm.fatGoal" /></div>
        </div>
        <button class="btn btn-primary" @click="saveGoals">保存目标</button>
      </div>
    </div>

    <div v-if="showBodyRecord" class="modal-overlay" @click.self="showBodyRecord=false">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div style="font-size:18px;font-weight:700;margin-bottom:16px;">记录身体数据</div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">体重 (kg)</label><input class="form-input" type="number" step="0.1" v-model="bodyForm.weight" placeholder="可选" /></div>
          <div class="form-group"><label class="form-label">腰围 (cm)</label><input class="form-input" type="number" step="0.1" v-model="bodyForm.waist" placeholder="可选" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">臀围 (cm)</label><input class="form-input" type="number" step="0.1" v-model="bodyForm.hip" placeholder="可选" /></div>
          <div class="form-group"><label class="form-label">胸围 (cm)</label><input class="form-input" type="number" step="0.1" v-model="bodyForm.chest" placeholder="可选" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">臂围 (cm)</label><input class="form-input" type="number" step="0.1" v-model="bodyForm.arm" placeholder="可选" /></div>
          <div class="form-group"><label class="form-label">体脂率 (%)</label><input class="form-input" type="number" step="0.1" v-model="bodyForm.bodyFat" placeholder="可选" /></div>
        </div>
        <div class="form-group"><label class="form-label">备注</label><input class="form-input" v-model="bodyForm.note" placeholder="可选备注" /></div>
        <button class="btn btn-primary" @click="saveBodyRecord">保存数据</button>
      </div>
    </div>
  `,
});


// Expose global helpers to all templates
app.config.globalProperties.formatDate = formatDate;
app.config.globalProperties.formatDateFull = formatDateFull;
app.config.globalProperties.getDaysAgo = getDaysAgo;
app.config.globalProperties.generateId = generateId;
app.config.globalProperties.FOOD_DATABASE = FOOD_DATABASE;
app.config.globalProperties.EXERCISE_PRESETS = EXERCISE_PRESETS;
app.config.globalProperties.BODY_PARTS = BODY_PARTS;
app.config.globalProperties.Store = Store;

app.config.errorHandler = (err, vm, info) => {
  console.error('[Vue Error]', info, err);
  const el = document.getElementById('app');
  if (el && !el.innerHTML.trim()) {
    el.innerHTML = '<div style="padding:20px;color:red;font-size:13px;"><b>渲染错误:</b><br/>' + err.message + '<br/><br/>' + info + '</div>';
  }
};

app.mount('#app');
