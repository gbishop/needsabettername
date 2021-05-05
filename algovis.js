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
        html`<div class="value"><span class="index">${i}</span>${item}</div>`
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

let observer = null;

/**
 * Show the states
 *
 * @param {number} frame - index of the state to show
 * @param {string} code - code of the function
 * @return {void}
 */
export function show(frame, code) {
  // clear any changed classes from last time
  for (const e of document.querySelectorAll(".changed")) {
    e.classList.remove("changed");
  }
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
          oninput=${({ target }) => show(target.value, code)}
          autofocus
        />
        <div class="variables">
          ${Object.entries(States[frame]).map(showVar)}
        </div>
      </div>
    </div>`
  );
  Prism.highlightAll();
  // setup a MutationObserver to highlight values that changed
  if (!observer) {
    observer = new MutationObserver((mutationList) => {
      // we get a record for each text change
      for (const mutation of mutationList) {
        // if the text changed inside one of our value divs
        if (mutation.target.parentElement.matches("div.value")) {
          // add the changed class
          mutation.target.parentElement.classList.add("changed");
        }
      }
    });
    observer.observe(document.querySelector("div.variables"), {
      characterData: true,
      subtree: true,
    });
  }
}
