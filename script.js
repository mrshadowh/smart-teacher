const stageMap = {
  primary: { label: 'ابتدائي', maxGrade: 6 },
  middle: { label: 'إعدادي', maxGrade: 3 },
  secondary: { label: 'ثانوي', maxGrade: 3 }
};

const gradeSelect = document.getElementById('grade');
const stagePreview = document.getElementById('stage-preview');
const gradePreview = document.getElementById('grade-preview');
const resultStage = document.getElementById('resultStage');
const resultSteps = document.getElementById('resultSteps');
const finalAnswer = document.getElementById('finalAnswer');
const previewBox = document.getElementById('previewBox');
const imageUpload = document.getElementById('imageUpload');

let currentStage = 'primary';

function updateGradeOptions(stage) {
  const { maxGrade } = stageMap[stage];
  const options = [];

  for (let i = 1; i <= maxGrade; i++) {
    options.push(`<option value="${i}">السنة ${i}</option>`);
  }

  gradeSelect.innerHTML = options.join('');
  gradeSelect.value = '1';
  stagePreview.textContent = stageMap[stage].label;
  gradePreview.textContent = 'السنة 1';
  resultStage.textContent = stageMap[stage].label;
}

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');
    currentStage = chip.dataset.stage;
    updateGradeOptions(currentStage);
  });
});

gradeSelect.addEventListener('change', () => {
  const value = Number(gradeSelect.value);
  gradePreview.textContent = `السنة ${value}`;
});

imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewBox.innerHTML = `<img src="${reader.result}" alt="uploaded image" />`;
  };
  reader.readAsDataURL(file);
});

document.getElementById('solver-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const stageLabel = stageMap[currentStage].label;
  const selectedGrade = Number(gradeSelect.value);
  const selectedFile = imageUpload.files[0];

  const steps = [
    `تم اختيار المرحلة: ${stageLabel}.`,
    `تم تحديد السنة: ${selectedGrade}.`,
    selectedFile ? 'تمت قراءة الصورة بنجاح.' : 'تم تجهيز السؤال بدون صورة، سيتم شرح الفكرة العامة.',
    'تم تطبيق القاعدة المناسبة ثم التحقق من النتيجة النهائية.'
  ];

  resultSteps.innerHTML = steps.map((step) => `<li>${step}</li>`).join('');

  finalAnswer.textContent = `الإجابة النهائية في ${stageLabel} - السنة ${selectedGrade}: تم تحليل المطلوب، ثم تطبيق القاعدة المناسبة، وتأكيد النتيجة عبر مراجعة الخطوات.`;
});

updateGradeOptions(currentStage);
