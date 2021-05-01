import merge from "mergerino";
import { render, html } from "uhtml";

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
  return html`<div>
    <span class="name">${k}</span>:
    <span class="value">${JSON.stringify(v)}</span>
  </div>`;
}

function showCode(code, highlight) {
  code = code.replace(/\$.*/g, "");
  return html`<div class="code">
    ${code
      .split("\n")
      .map(
        (line, i) =>
          html`<pre class=${highlight == i + 1 ? "highlight" : ""}>
${line}</pre
          >`
      )}
  </div>`;
}

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
        />
        ${Object.entries(States[frame]).map(showVar)}
      </div>
    </div>`
  );
}