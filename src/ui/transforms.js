import { composeTransforms, leftModel, rightModel } from '../scene/transforms.js';

function formatMatrix(matrix) {
  const rows = [];
  for (let row = 0; row < 4; row++) {
    const cells = [];
    for (let column = 0; column < 4; column++) {
      const value = matrix[column * 4 + row];
      cells.push((Math.abs(value) < 0.0005 ? 0 : value).toFixed(3).padStart(6));
    }
    rows.push(cells.join(' '));
  }
  return rows.join('\n');
}

export function bindTransformControls(form, trsOutput, srtOutput) {
  const inputs = [...form.querySelectorAll('input[type="range"]')];
  const order = form.elements.order;
  let models;
  function update() {
    const values = {};
    for (const input of inputs) {
      values[input.name] = input.valueAsNumber;
      form.querySelector(`output[for="${input.id}"]`).value = input.value;
    }
    const matrices = composeTransforms(values);
    trsOutput.textContent = formatMatrix(matrices.trs);
    srtOutput.textContent = formatMatrix(matrices.srt);
    models = [leftModel, matrices[order.value], rightModel];
  }
  form.addEventListener('input', update);
  update();
  return () => models;
}
