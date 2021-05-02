import merge from "mergerino";
import { render, html, Hole } from "uhtml";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-highlight/prism-line-highlight";
import "prismjs/plugins/line-highlight/prism-line-highlight.css";

const States = [{}];

/**
 * Update the state based on values given
 *
 * @param {Object} patch - new values for the states
 * @return {void}
 */
export function $(patch) {
  // clone any arrays in the patch
  patch = Object.fromEntries(
    Object.entries(patch).map(([k, v]) => [k, v instanceof Array ? [...v] : v])
  );
  States.push(merge(States[States.length - 1], patch));
}

function showVar([k, v]) {
  if (v instanceof Array) {
    let items = v.map(
      (item, i) =>
        html`<div class="item"><span class="index">${i}</span>${item}</div>`
    );
    return html`<div class="array">
      <div class="name">${k}</div>
      <div class="values">${items}</div>
    </div>`;
  } else {
    return html`<div>
      <div class="name">${k}</div>
      :
      <div class="value">${JSON.stringify(v)}</div>
    </div>`;
  }
}

/**
 * Display the code block
 *
 * @param {string} code - Code to display
 * @param {number} highlight - Line number to highlight
 * @return {Hole}
 */
function showCode(code, highlight) {
  code = code.replace(/\$.*/g, "");
  return html`<pre
    data-line=${highlight}
  ><code class="language-javascript">${code}</code></pre>`;
}

/**
 * Show the states
 *
 * @param {number} frame - index of the state to show
 * @param {string} code - code of the function
 * @return {void}
 */
export function show(frame, code) {
  render(
    document.body,
    html`<div>
      ${showCode(code, States[frame].line)}
      <div>
        <input
          type="range"
          value=${frame}
          min="1"
          max=${States.length - 1}
          oninput=${(e) => show(e.target.value, code)}
          autofocus
        />
        ${Object.entries(States[frame]).map(showVar)}
      </div>
    </div>`
  );
  Prism.highlightAll();
}
