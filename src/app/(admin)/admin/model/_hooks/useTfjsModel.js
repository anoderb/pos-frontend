import { useState, useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';

/**
 * Parse class.json dari Kaggle — support format Object {"0":"label"} dan Array ["label"]
 */
function parseClassLabels(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data.map((s) => String(s).toUpperCase());
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.every((k) => !isNaN(Number(k)))) {
      return keys.sort((a, b) => Number(a) - Number(b)).map((k) => String(data[k]).toUpperCase());
    }
  }
  return [];
}

/**
 * Preprocessing: fromPixels → resize 224x224 → toFloat → expandDims
 * TANPA normalisasi manual — model sudah punya layer Rescaling built-in
 */
function preprocess(element) {
  return tf.tidy(() => {
    const raw = tf.browser.fromPixels(element);
    const resized = tf.image.resizeBilinear(raw, [224, 224]);
    return resized.toFloat().expandDims(0);
  });
}

export default function useTfjsModel() {
  const [model, setModel] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modelRef = useRef(null);
  const classesRef = useRef([]);

  const loadModel = useCallback(async (modelUrl) => {
    if (!modelUrl) return;
    setLoading(true);
    setError(null);
    try {
      await tf.ready();
      const loaded = await tf.loadGraphModel(modelUrl);
      modelRef.current = loaded;
      setModel(loaded);

      // Auto-fetch class.json dari folder yang sama
      const classUrl = modelUrl.replace('model.json', 'class.json');
      try {
        const res = await fetch(classUrl);
        if (res.ok) {
          const labels = parseClassLabels(await res.json());
          if (labels.length > 0) {
            classesRef.current = labels;
            setClasses(labels);
          }
        }
      } catch { /* class.json optional */ }
    } catch (err) {
      console.error('Model load failed:', err);
      setError(err.message);
      modelRef.current = null;
      setModel(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const predict = useCallback(async (element) => {
    const m = modelRef.current;
    const labels = classesRef.current;
    if (!m || !element || labels.length === 0) return null;

    const t0 = performance.now();
    const input = preprocess(element);
    const output = m.predict(input);
    const probs = await output.data();
    input.dispose();
    output.dispose();

    const predictions = Array.from(probs)
      .map((score, i) => ({ label: labels[i] || `Class ${i}`, score }))
      .sort((a, b) => b.score - a.score);

    return { predictions, ms: Math.round(performance.now() - t0) };
  }, []);

  return { model, classes, loading, error, loadModel, predict, setClasses };
}
