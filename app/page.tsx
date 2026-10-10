'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';

type Stage = 'primary' | 'middle' | 'secondary';

type ResultData = {
  summary: string;
  steps: string[];
  finalAnswer: string;
  note?: string;
};

const stageLabels: Record<Stage, string> = {
  primary: 'ابتدائي',
  middle: 'إعدادي',
  secondary: 'ثانوي',
};

const gradeOptions: Record<Stage, number[]> = {
  primary: [1, 2, 3, 4, 5, 6],
  middle: [1, 2, 3],
  secondary: [1, 2, 3],
};

export default function HomePage() {
  const [stage, setStage] = useState<Stage>('primary');
  const [grade, setGrade] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string>('');

  const gradeList = useMemo(() => gradeOptions[stage], [stage]);

  const handleStageChange = (nextStage: Stage) => {
    setStage(nextStage);
    setGrade(gradeOptions[nextStage][0]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('stage', stage);
      formData.append('grade', String(grade));
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'حدث خطأ أثناء تحليل السؤال');
      }

      setResult(data);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'حدث خطأ غير متوقع';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="badge">المعلم الذكي</div>
        <h1>حل المسائل بسهولة من خلال صورة أو صورة من الكاميرا</h1>
        <p>
          اختر صفك، حدد السنة، ثم ارفع السؤال أو التقط صورة. سيقوم الذكاء الاصطناعي بشرح الحل
          بطريقة سهلة ومناسبة لك.
        </p>
      </section>

      <section className="panel">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field-group">
            <label>المرحلة</label>
            <div className="chip-row">
              {(Object.keys(stageLabels) as Stage[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={stage === item ? 'chip active' : 'chip'}
                  onClick={() => handleStageChange(item)}
                >
                  {stageLabels[item]}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="grade">السنة</label>
            <select id="grade" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
              {gradeList.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group upload-box">
            <label htmlFor="file">رفع صورة السؤال</label>
            <input id="file" type="file" accept="image/*,capture=camera" onChange={handleFileChange} />
            {file ? <small>تم اختيار: {file.name}</small> : <small>يمكنك رفع صورة أو استخدام الكاميرا</small>}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'جاري التحليل...' : 'حل السؤال الآن'}
          </button>
        </form>
      </section>

      {error ? <div className="alert error">{error}</div> : null}

      {result ? (
        <section className="result-panel">
          <div className="result-header">
            <span>{stageLabels[stage]}</span>
            <span>السنة {grade}</span>
          </div>

          <h2>{result.summary}</h2>

          <div className="steps">
            {result.steps.map((step, index) => (
              <div key={index} className="step-item">
                <span className="step-number">{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div className="final-box">
            <h3>الإجابة النهائية</h3>
            <p>{result.finalAnswer}</p>
          </div>

          {result.note ? <p className="note">{result.note}</p> : null}
        </section>
      ) : null}
    </main>
  );
}
